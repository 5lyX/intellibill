import { useSelector } from "react-redux";
import { selectInvoices } from "../features/invoiceScreen/invoiceSlice";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

export default function InvoiceTable() {
  const invoices = useSelector(selectInvoices);
  const reversedInvoices = [...invoices].reverse();

  const isColumnEmpty = (key: any) =>
    reversedInvoices.every((row) => !row[key] && row[key] !== 0);

  const headers = [
    { key: "serialNumber", label: "Serial Number" },
    { key: "customerName", label: "Customer" },
    { key: "productName", label: "Product Name" },
    { key: "quantity", label: "Quantity" },
    { key: "taxPercentage", label: "Tax (%)" },
    { key: "tax", label: "Tax (Rs.)" },
    { key: "totalAmount", label: "Total Amount (Rs.)" },
    { key: "date", label: "Date" },
  ];

  return (
    <Sheet
      className="OrderTableContainer"
      variant="outlined"
      sx={{
        display: { xs: "none", sm: "initial" },
        width: "100%",
        borderRadius: "sm",
        flexShrink: 1,
        overflow: "auto",
        minHeight: 0,
      }}
    >
      {reversedInvoices.length === 0 ? (
        <Sheet
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <Typography sx={{ mb: 2 }}>No invoice data available.</Typography>
          <Typography level="body-md" sx={{ mb: 2, color: "text.secondary" }}>
            Upload a file in the home tab.
          </Typography>
        </Sheet>
      ) : (
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  style={{
                    padding: "10px 6px",
                    color: isColumnEmpty(header.key) ? "red" : "inherit",
                  }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reversedInvoices.map((row) => (
              <tr key={row.id}>
                <td>
                  <Typography level="body-xs">{row.serialNumber}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.customerName}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {row.productName ? row.productName : "N/A"}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.quantity}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {row.taxPercentage} {`%`}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.tax}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.totalAmount}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.date}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Sheet>
  );
}
