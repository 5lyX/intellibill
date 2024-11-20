import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

const invoices = [
  {
    serial: "INV-148CZS",
    customer: "Nagesh",
    product: "Cadbury",
    quantity: "100",
    tax: "12",
    total: "33600",
    date: "10 Nov 2024",
  },
  {
    serial: "INV-149CZS",
    customer: "Rajesh",
    product: "Kitkat",
    quantity: "10",
    tax: "18",
    total: "3600",
    date: "12 Nov 2024",
  },
  {
    serial: "INV-150CZS",
    customer: "Amin",
    product: "Cadbury Horlicks",
    quantity: "20",
    tax: "8",
    total: "4600",
    date: "8 Nov 2024",
  },
  {
    serial: "INV-151CZS",
    customer: "Nagesh",
    product: "Icemcream",
    quantity: "10",
    tax: "10",
    total: "3100",
    date: "3 Nov 2024",
  },
];

export default function ProductTable() {
  const reversedInvoices = [...invoices].reverse();

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
      <Table
        aria-labelledby="tableTitle"
        stickyHeader
        hoverRow
        sx={{
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
          "--TableCell-paddingY": "4px",
          "--TableCell-paddingX": "8px",
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: "12px 6px" }}>Serial Number</th>
            <th style={{ width: "15%", padding: "12px 6px" }}>Customer</th>
            <th style={{ width: "15%", padding: "12px 6px" }}>Product Name</th>
            <th style={{ padding: "12px 6px" }}>Quantity</th>
            <th style={{ padding: "12px 6px" }}>Tax (%)</th>
            <th style={{ padding: "12px 6px" }}>Total Amount (Rs.)</th>
            <th style={{ padding: "12px 6px" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {reversedInvoices.map((row) => (
            <tr key={row.serial}>
              <td>
                <Typography level="body-xs">{row.serial}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.customer}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.product}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.quantity}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.tax}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.total}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.date}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
