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
                description: "Tax in percentage applied to the product",
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
                description: "Tax in percentage applied to the product",
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
              customerCompany: {
                type: SchemaType.STRING,
                description: "Company name of customer or party",
                nullable: false,
              },
            },
            required: [
              "customerName",
              "phoneNumber",
              "totalPurchaseAmount",
              "customerCompany",
            ],
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
        text: `Analyze the invoice file and give the necessary data as described in schema.`,
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
