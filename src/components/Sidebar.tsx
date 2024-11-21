import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";

import ColorSchemeToggle from "./ColorSchemeToggle";
import { appendUniqueIds, closeSidebar } from "../app/utils";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import { useDispatch, useSelector } from "react-redux";
import { setScreen } from "../features/screen/screenSlice";
import { RootState } from "../app/store";
import axios from "axios";
import { addCustomer } from "../features/customerScreen/customerSlice";
import { addProduct } from "../features/productScreen/productSlice";
import { addInvoice } from "../features/invoiceScreen/invoiceSlice";

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: "grid",
            transition: "0.2s ease",
            "& > *": {
              overflow: "hidden",
            },
          },
          open ? { gridTemplateRows: "1fr" } : { gridTemplateRows: "0fr" },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const currentScreen = useSelector(
    (state: RootState) => state.screen.currentScreen
  );
  const handleScreenChange = (screen: string) => {
    dispatch(setScreen(screen));
  };
  const [isProcessing, setIsProcessing] = React.useState(false);
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
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
      console.log("File uploaded:", fileData);

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
      const parsedData = JSON.parse(geminiData.generatedText);

      const processedData = appendUniqueIds(parsedData);
      dispatch(addCustomer(processedData.customers));
      dispatch(addProduct(processedData.products));
      dispatch(addInvoice(processedData.invoices));
      setIsProcessing(false);
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography level="title-lg">
          <span style={{ fontStyle: "italic" }}>Intelli</span>Bill
        </Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton
              selected={currentScreen === "Home"}
              onClick={() => handleScreenChange("Home")}
            >
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Home</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={currentScreen === "Invoices"}
              onClick={() => handleScreenChange("Invoices")}
            >
              <DashboardRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Invoices</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={currentScreen === "Products"}
              onClick={() => handleScreenChange("Products")}
            >
              <ShoppingCartRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Products</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={currentScreen === "Customers"}
              onClick={() => handleScreenChange("Customers")}
            >
              <PeopleAltIcon />
              <ListItemContent>
                <Typography level="title-sm">Customers</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
        <Card
          invertedColors
          variant="soft"
          color="warning"
          size="sm"
          sx={{ boxShadow: "none" }}
        >
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography level="title-sm">
              {isProcessing
                ? "Uploading and Processing..."
                : "Allowed File Formats:"}
            </Typography>
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
              <Typography level="body-xs">Max Size : 10 MB</Typography>
            </ListItem>
          </List>
        </Card>
        <Box
          sx={{
            minHeight: 20,
          }}
        ></Box>
        <Button
          color="primary"
          startDecorator={<UploadRoundedIcon />}
          size="md"
          onClick={triggerFileInput}
        >
          {isProcessing ? "Processing..." : "Upload Invoice"}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.xls,.xlsx,.csv,.jpeg,.png,.heic,.webp,.heif"
          style={{ display: "none" }}
        />
      </Box>
    </Sheet>
  );
}
