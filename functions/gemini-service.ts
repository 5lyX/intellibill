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
        Invoices: {
          type: SchemaType.ARRAY,
          description: "List of invoices",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              SerialNumber: {
                type: SchemaType.STRING,
                description: "Serial number of the invoice",
                nullable: false,
              },
              CustomerName: {
                type: SchemaType.STRING,
                description: "Name of the customer",
                nullable: false,
              },
              ProductName: {
                type: SchemaType.STRING,
                description: "Name of the product",
                nullable: false,
              },
              Quantity: {
                type: SchemaType.NUMBER,
                description: "Quantity of the product",
                nullable: false,
              },
              Tax: {
                type: SchemaType.NUMBER,
                description: "Tax applied to the product",
                nullable: false,
              },
              TotalAmount: {
                type: SchemaType.NUMBER,
                description: "Total amount for the invoice",
                nullable: false,
              },
              Date: {
                type: SchemaType.STRING,
                description: "Date of the invoice",
                nullable: false,
              },
            },
            required: [
              "SerialNumber",
              "CustomerName",
              "ProductName",
              "Quantity",
              "Tax",
              "TotalAmount",
              "Date",
            ],
          },
        },
        Products: {
          type: SchemaType.ARRAY,
          description: "List of products",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              Name: {
                type: SchemaType.STRING,
                description: "Name of the product",
                nullable: false,
              },
              Quantity: {
                type: SchemaType.NUMBER,
                description: "Available quantity of the product",
                nullable: false,
              },
              UnitPrice: {
                type: SchemaType.NUMBER,
                description: "Unit price of the product",
                nullable: false,
              },
              Tax: {
                type: SchemaType.NUMBER,
                description: "Tax applied to the product",
                nullable: false,
              },
              PriceWithTax: {
                type: SchemaType.NUMBER,
                description: "Price of the product including tax",
                nullable: false,
              },
              Discount: {
                type: SchemaType.NUMBER,
                description: "Discount applied to the product",
                nullable: false,
              },
            },
            required: [
              "Name",
              "Quantity",
              "UnitPrice",
              "Tax",
              "PriceWithTax",
              "Discount",
            ],
          },
        },
        Customers: {
          type: SchemaType.ARRAY,
          description: "List of customers",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              CustomerName: {
                type: SchemaType.STRING,
                description: "Name of the customer",
                nullable: false,
              },
              PhoneNumber: {
                type: SchemaType.STRING,
                description: "Phone number of the customer",
                nullable: false,
              },
              TotalPurchaseAmount: {
                type: SchemaType.NUMBER,
                description: "Total amount spent by the customer",
                nullable: false,
              },
            },
            required: ["CustomerName", "PhoneNumber", "TotalPurchaseAmount"],
          },
        },
      },
      required: ["Invoices", "Products", "Customers"],
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
        text: "You are the best accountant in the world. Analyze the file and tell me the details asked. Fill '' for any missing data.",
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
