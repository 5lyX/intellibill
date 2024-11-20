import busboy from "busboy";
import { Handler } from "@netlify/functions";
import { GoogleAIFileManager } from "@google/generative-ai/server";
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

    const fileManager = new GoogleAIFileManager(process.env.REACT_APP_API_KEY!);

    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: type,
      displayName: filename,
    });

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);

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
