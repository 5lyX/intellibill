import busboy from "busboy";
import { Handler } from "@netlify/functions";
import ExcelJS from "exceljs"; // Import exceljs
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import os from "os";

export const handler: Handler = async (event) => {
  try {
    if (
      event.httpMethod !== "POST" ||
      !event.headers["content-type"]?.includes("multipart/form-data")
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request" }),
      };
    }

    const parsedData = await parseMultipartForm(event);
    const file = parsedData.file[0];

    if (!file) {
      throw new Error("No file uploaded");
    }

    const { content, filename, type } = file;

    const tempFilePath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(tempFilePath, content);

    let fileToUploadPath = tempFilePath;

    if (
      type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const result = await processExcel(fileToUploadPath);
      console.log("Final Processed Data:", result);
      fs.unlinkSync(tempFilePath);
      if (fileToUploadPath !== tempFilePath) {
        fs.unlinkSync(fileToUploadPath);
      }
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    }

    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: type,
      displayName: filename,
    });

    fs.unlinkSync(tempFilePath);
    if (fileToUploadPath !== tempFilePath) {
      fs.unlinkSync(fileToUploadPath);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        fileUri: uploadResponse.file.uri,
        mimeType: uploadResponse.file.mimeType,
        displayName: uploadResponse.file.displayName,
      }),
    };
  } catch (error: any) {
    console.error("Error handling file upload:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function parseMultipartForm(event: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: event.headers });
    const fields: Record<string, any> = {};
    const files: any[] = [];

    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;
      const chunks: Buffer[] = [];

      file.on("data", (chunk) => chunks.push(chunk));
      file.on("end", () => {
        files.push({
          fieldname: name,
          filename,
          type: mimeType,
          content: Buffer.concat(chunks),
        });
      });
    });

    bb.on("field", (name, value) => {
      fields[name] = value;
    });

    bb.on("close", () => {
      resolve({ fields, file: files });
    });

    bb.on("error", (err) => reject(err));

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : event.body;

    bb.end(body);
  });
}

async function readExcel(filepath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filepath);
  const worksheet = workbook.worksheets[0]; // Get the first worksheet

  const columnNames: string[] = [];
  let rows: any[] = [];

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (Array.isArray(row.values) && row.values.length > 0) {
      if (rowNumber === 1) {
        columnNames.push(
          ...row.values.slice(1).map((cell) => cell?.toString() || "")
        );
      } else {
        const rowData: Record<string, any> = {};
        row.values.slice(1).forEach((cell, index) => {
          if (columnNames[index] && cell !== undefined && cell !== null) {
            rowData[columnNames[index]] = cell;
          }
        });
        rows.push(rowData);
      }
    }
  });

  if (!columnNames.length) {
    throw new Error("The sheet appears to be empty or missing headers.");
  }

  rows = rows.filter(
    (row) =>
      row["Serial Number"] &&
      row["Serial Number"].toString().toLowerCase() !== "totals"
  );
  console.log("Rows :", rows);
  return { columnNames, rows };
}

async function generateQueryUsingGemini(columns, rows) {
  const prompt = `
  I have an Excel file with the following column names:
${columns.join(", ")}.

The goal is to extract structured data from this file into a single object with the following schema:
Schema :
{
  result: string; // JSON stringified data containing customers, invoices, and products
}
The result field should contain a JSON string matching this structure:

1. Customers
A list of customer details including:

customerName (string, required): The name or party name of the customer.
phoneNumber (string, required): The customer's or party name's phone number.
totalPurchaseAmount (number, required): The total amount the customer has spent.
customerCompany (string, required): The name of the company to which the customer or party is associate.

2. Invoices
A list of invoice details for purchased products, including:

serialNumber (string, required): The unique identifier for the invoice.
customerName (string, required): The name or party name of the customer associated with the invoice.
productName (string, required): The name of the product purchased.
quantity (number, required): The quantity of the product purchased.
tax (number, required): The tax amount applied to the product. (If not given, Tax Amount = Price with Tax - Unit Price(or Item Price))
taxPercentage (number, required): The tax percentage applied to the product.
totalAmount (number, required): The total amount for the invoice (including tax).
date (string, required): The date of the invoice, preserved exactly as it appears in the rows.

3. Products
A list of product details, including:

name (string, required): The name of the product.
quantity (number, required): The available quantity of the product.
unitPrice (number, required): The base price per unit of the product (excluding tax).
tax (number, required): The tax applied to the product. (If not given, Tax Amount = Price with Tax - Unit Price(or Item Price))
taxPercentage (number, required): The tax percentage applied to the product.
priceWithTax (number, required): The price of the product, including tax.
discount (number, required): Any discount applied to the product.

Context :
Data Preview: 
The rows from the Excel file are loaded into an array as follows:
rows[0:2] = ${rows.slice(0, 2)}

Requirements:

The generated TypeScript code must process the rows array to extract the data into the above schema.
The resulting data must conform to the JSON format below:
{
  "result": "{"customers": [{"customerName": "Shounak", "phoneNumber": "9999999994", "totalPurchaseAmount": 205481.00, "customerCompany":"Apple Inc"}], "invoices": [{"serialNumber": "INV-148CZS", "customerName": "Shounak", "productName": "GEMS CHOCLATE POUCH", "quantity": 1000.000, "tax": 238.10,"taxPercentage": 5.00, "totalAmount": 5000.00, "date": "12 Nov 2024"}], "products": [{"name": "GEMS CHOCLATE POUCH", "quantity": 1000.000, "unitPrice": 4.7619, "tax": 238.10, "taxPercentage": 5.00, "priceWithTax": 5.00, "discount": 0.00}]}"
}

Requirements :
The TypeScript code should process the rows array and return the final object as specified above.
All floating-point values should be trimmed to 2 decimal places.
All numeric fields should be positive.
If there is no Customer/Party Name field, the customers array will be empty. (i.e. {"customers":[]}, invoices and products will be filled appropriatly with the customerName field empty.)
If there is no Product Name field, the products array will be empty. (i.e. {"products":[]}, customers and invoices will be filled appropriatly with the productName field empty.)
Calculate the missing data using data from other columns.
example : We can calculate tax % by using taxAmount and priceWithTax. Similarly we can calculate tax amount by calculating priceWithTax - unitPrice.
Return an empty string '' for any missing data (including missing column names).
Party Company Name field is not equivalent to Product field. Do not use it as productName.
The date field must remain unmodified from its original format in the rows.
Ensure that the final object is a single object with a result field containing the JSON string.

Execution Context :
The TypeScript code must be directly executable using eval().
It will be embedded in the following function and executed:
async function processExcel(filePath) {
  const { columnNames, rows } = await readExcel(filePath);
  console.log("Extracted Column Names:", columnNames);
  const generatedLogic = await generateQueryUsingGemini(columnNames);
  console.log("Generated Logic:", generatedLogic);
  let processedData: any;
  try {
    // eslint-disable-next-line no-eval
    eval(
      "processedData = (function() { <your-generated-code-goes-here>; return processedData; })()"
    );
  } catch (error) {
    console.error("Error executing generated logic:", error);
    return null;
  }
  return processedData;
}
Deliverables
Output: Generate only the TypeScript code to produce the object { result: string } as specified.
Constraints:
Avoid using external libraries where possible.
Ensure precision requirements for floats (2 decimal places) and preserve the original date format.
The final output must strictly adhere to the schema provided.
Clarity: The generated code must be concise, executable, and accurate.

In the end perform the following to convert into required format,

// Convert customers and products objects to arrays
const customersArray = Object.values(customers);
const productsArray = Object.values(products);

// Format the final result object
const result = {
  customers: customersArray,
  invoices: invoices,
  products: productsArray
};

processedData = {
  result: JSON.stringify(result)
};

  `;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return result.response.text();
}

async function processExcel(filePath) {
  const { columnNames, rows } = await readExcel(filePath);
  console.log("Extracted Column Names:", columnNames);
  const generatedLogic = await generateQueryUsingGemini(columnNames, rows);
  console.log("Generated Logic:\n", generatedLogic);
  const sanitizedLogic = generatedLogic
    .trim()
    .replace(/^```typescript\n/, "")
    .replace(/\n```$/, "");
  console.log("Sanitized Generated Logic:\n", sanitizedLogic);
  let processedData: any;
  try {
    // eslint-disable-next-line no-eval
    eval(
      `processedData = (function() { ${sanitizedLogic}; return processedData; })()`
    );
  } catch (error) {
    console.error("Error executing generated logic:", error);
    return null;
  }

  return processedData;
}
