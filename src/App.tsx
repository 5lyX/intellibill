import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import Home from "./features/home/Home";
import InvoiceScreen from "./features/invoiceScreen/Invoice";
import ProductScreen from "./features/productScreen/Product";
import CustomerScreen from "./features/customerScreen/Customer";

export default function App() {
  const currentScreen = useSelector(
    (state: RootState) => state.screen.currentScreen
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case "Home":
        return <Home />;
      case "Invoices":
        return <InvoiceScreen />;
      case "Products":
        return <ProductScreen />;
      case "Customers":
        return <CustomerScreen />;
      default:
        return <Typography level="h1">Unknown Screen</Typography>;
    }
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          {renderScreen()}
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
