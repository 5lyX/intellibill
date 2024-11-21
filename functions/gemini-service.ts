import { Handler } from "@netlify/functions";
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

export const handler: Handler = async (event: any) => {
  try {
    const { fileUri, mimeType } = JSON.parse(event.body);
    console.log(fileUri, mimeType);
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);

    const schema = {
      description:
        "JSON output containing invoices, products, and customers information",
      type: SchemaType.OBJECT,
      properties: {
        invoices: {
          type: SchemaType.ARRAY,
          description: "List of invoices",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              serialNumber: {
                type: SchemaType.STRING,
                description: "Serial number of the invoice",
                nullable: false,
              },
              customerName: {
                type: SchemaType.STRING,
                description: "Name of the customer",
                nullable: false,
              },
              productName: {
                type: SchemaType.STRING,
                description: "Name of the product",
                nullable: false,
              },
              quantity: {
                type: SchemaType.NUMBER,
                description: "Quantity of the product",
                nullable: false,
              },
              tax: {
                type: SchemaType.NUMBER,
                description: "Tax applied to the product",
                nullable: false,
              },
              taxPercentage: {
                type: SchemaType.NUMBER,
                description: "Total tax percentage applied to the product",
                nullable: false,
              },
              totalAmount: {
                type: SchemaType.NUMBER,
                description: "Total amount for the invoice",
                nullable: false,
              },
              date: {
                type: SchemaType.STRING,
                description: "Date of the invoice",
                nullable: false,
              },
            },
            required: [
              "serialNumber",
              "customerName",
              "productName",
              "quantity",
              "tax",
              "taxPercentage",
              "totalAmount",
              "date",
            ],
          },
        },
        products: {
          type: SchemaType.ARRAY,
          description: "List of products",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: {
                type: SchemaType.STRING,
                description: "Name of the product",
                nullable: false,
              },
              quantity: {
                type: SchemaType.NUMBER,
                description: "Available quantity of the product",
                nullable: false,
              },
              unitPrice: {
                type: SchemaType.NUMBER,
                description: "Unit price of the product",
                nullable: false,
              },
              tax: {
                type: SchemaType.NUMBER,
                description: "Tax applied to the product",
                nullable: false,
              },
              taxPercentage: {
                type: SchemaType.NUMBER,
                description: "Total tax percentage applied to the product",
                nullable: false,
              },
              priceWithTax: {
                type: SchemaType.NUMBER,
                description: "Price of the product including tax",
                nullable: false,
              },
              discount: {
                type: SchemaType.NUMBER,
                description: "Discount applied to the product",
                nullable: false,
              },
            },
            required: [
              "name",
              "quantity",
              "unitPrice",
              "tax",
              "taxPercentage",
              "priceWithTax",
              "discount",
            ],
          },
        },
        customers: {
          type: SchemaType.ARRAY,
          description: "List of customers",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              customerName: {
                type: SchemaType.STRING,
                description: "Name of the customer",
                nullable: false,
              },
              phoneNumber: {
                type: SchemaType.STRING,
                description: "Phone number of the customer",
                nullable: false,
              },
              totalPurchaseAmount: {
                type: SchemaType.NUMBER,
                description: "Total amount spent by the customer",
                nullable: false,
              },
            },
            required: ["customerName", "phoneNumber", "totalPurchaseAmount"],
          },
        },
      },
      required: ["invoices", "products", "customers"],
    };

    // const model = genAI.getGenerativeModel({
    //   model: "gemini-1.5-flash",
    // });
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-001",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: mimeType,
          fileUri: fileUri,
        },
      },
      {
        text: `Analyze the given file (PDF, Excel, or Image) and extract the following details, organizing them into a structured JSON format based on the schema below:

Invoices:

Serial Number: The unique serial number of the invoice (e.g., 'INV-148CZS').
Customer Name: The name of the customer associated with the invoice (e.g., 'Shounak').
Product Name: The name of the product listed on the invoice (e.g., 'GEMS CHOCLATE POUCH').
Quantity: The quantity of the product sold in the invoice (e.g., 1000).
Tax: The tax applied to the product in the invoice (e.g., 15).
Tax Percentage: The tax percentage applied to the product (e.g., 10%).
Total Amount: The total amount for the invoice (e.g., 1000.50).
Date: The date when the invoice was issued (e.g., '12 Nov 2024').
Products:

Product Name: The name of the product (e.g., 'IPHONE 16').
Quantity: The available quantity of the product (e.g., 50).
Unit Price: The price per unit of the product (e.g., 1000.0).
Tax: The tax applied to the product (e.g., 100).
Tax Percentage: The total tax percentage applied to the product (e.g., 10%).
Price with Tax: The total price of the product after tax (e.g., 1100.0).
Discount: The discount applied to the product (e.g., 50).
Customers:

Customer Name: The name of the customer (e.g., 'Shounak').
Phone Number: The phone number of the customer (e.g., '123-456-7890').
Total Purchase Amount: The total amount spent by the customer across all transactions (e.g., 5000.0).
Ensure that all the required fields for invoices, products, and customers are extracted correctly and that each object follows the structure defined in the schema. The output should be a valid JSON object with an array for invoices, products, and customers.`,
      },
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({ generatedText: result.response.text() }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
