import { Card, List, ListItem, Stack, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import axios from "axios";
import { useState } from "react";

export default function HomeScreen() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [generatedText, setGeneratedText] = useState<string | null>(null);

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
    formData.append("file", file); // Ensure the field name matches the backend

    try {
      // Upload file via `file-service`
      const fileResponse = await axios.post(
        "/.netlify/functions/file-service",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const fileData = fileResponse.data;
      console.log("File uploaded:", fileData);

      // Pass uploaded file URI to `gemini-service`
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
      console.log("Gemini response:", geminiData);

      setGeneratedText(geminiData.generatedText);
      setUploadMessage("File processed successfully!");
    } catch (error) {
      console.error("Error:", error);
      setUploadMessage("An error occurred while processing the file.");
    } finally {
      setIsUploading(false);
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
        Drag and drop a file or click the button below to upload it. Files up to
        2GB are supported.
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
            <Typography level="body-xs">
              Documents : PDF, Excel, CSV or
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-xs">
              Images : PNG, JPEG, WEBP, HEIC, HEIF
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-xs">Max Size : 2GB</Typography>
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
          <Typography level="body-sm">
            Click or Drag a file to upload
          </Typography>
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
          <Typography level="body-md">Generated Text:</Typography>
          <Typography level="body-sm" sx={{ whiteSpace: "pre-wrap" }}>
            {generatedText}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
