import { Card, List, ListItem, Stack, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import axios from "axios";
import { useState } from "react";
import { appendUniqueIds } from "../../app/utils";
import { useDispatch } from "react-redux";
import { addCustomer } from "../customerScreen/customerSlice";
import { addProduct } from "../productScreen/productSlice";
import { addInvoice } from "../invoiceScreen/invoiceSlice";

export default function HomeScreen() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setGeneratedText(null);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const fileResponse = await axios.post(
        "/.netlify/functions/file-service",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const fileData = fileResponse.data;

      let processedData;
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx")
      ) {
        setGeneratedText(
          "Open Invoices, Customers or Products Tab to see the data. Or upload a new file to add more data."
        );
        processedData = JSON.parse(fileData.result);
      } else {
        const geminiResponse = await axios.post(
          "/.netlify/functions/gemini-service",
          {
            fileUri: fileData.fileUri,
            mimeType: fileData.mimeType,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const geminiData = geminiResponse.data;
        setGeneratedText(
          "Open Invoices, Customers or Products Tab to see the data. Or upload a new file to add more data."
        );
        processedData = JSON.parse(geminiData.generatedText);
      }

      setUploadMessage("File processed successfully!");
      const finalData = appendUniqueIds(processedData);
      dispatch(addCustomer(finalData.customers));
      dispatch(addProduct(finalData.products));
      dispatch(addInvoice(finalData.invoices));
    } catch (error) {
      console.error("Error:", error);
      setUploadMessage("An error occurred while processing the file.");
    } finally {
      setIsUploading(false);
      event.target.value = ""; // Clear file input to allow new uploads
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", sm: "center" },
        justifyContent: "center",
      }}
    >
      <Typography color="neutral" level="h1">
        <span style={{ fontStyle: "italic" }}>Intelli</span>Bill 📝
      </Typography>
      <Box sx={{ minHeight: 20 }}></Box>
      <Typography level="body-md">
        Click the button below to upload a file. Files up to 20MB are supported.
      </Typography>
      <Box sx={{ minHeight: 20 }}></Box>
      <Card
        invertedColors
        variant="soft"
        color="warning"
        size="sm"
        sx={{ width: "auto", boxShadow: "none" }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <Typography level="title-sm">Allowed File Formats :</Typography>
        </Stack>

        <List>
          <ListItem>
            <Typography level="body-xs">Documents : PDF, Excel or</Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-xs">Images : PNG, JPEG, JPG</Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-xs">Max Size : 20MB</Typography>
          </ListItem>
        </List>
      </Card>
      <Box sx={{ minHeight: 20 }}></Box>
      <Box
        component="label"
        sx={{
          border: "2px dashed #ccc",
          padding: "20px",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
          maxWidth: "800px",
          textAlign: "center",
          "&:hover": { backgroundColor: "#f9f9f9" },
        }}
      >
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.xls,.xlsx,.csv,.jpeg,.png,.heic,.webp,.heif"
          style={{ display: "none" }}
        />
        {fileName ? (
          <Typography level="body-sm">Selected File: {fileName}</Typography>
        ) : (
          <Typography level="body-sm">Click here to upload a file</Typography>
        )}
      </Box>
      {isUploading ? (
        <Typography level="body-sm" color="neutral">
          Uploading and processing...
        </Typography>
      ) : (
        <Typography level="body-sm" color="success">
          {uploadMessage}
        </Typography>
      )}
      {generatedText && (
        <Box
          sx={{
            marginTop: 4,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxWidth: "800px",
          }}
        >
          <Typography level="body-sm" sx={{ whiteSpace: "pre-wrap" }}>
            {generatedText}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
