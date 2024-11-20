import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

const products = [
  {
    name: "Cadbury",
    quantity: "2",
    unitPrice: "30000",
    tax: "12",
    priceWithTax: "33600",
    discount: "10",
  },
  {
    name: "Kitkat",
    quantity: "12",
    unitPrice: "13000",
    tax: "18",
    priceWithTax: "22600",
    discount: "",
  },
  {
    name: "Cadbury Horlicks",
    quantity: "3",
    unitPrice: "3000",
    tax: "12",
    priceWithTax: "3360",
    discount: "11",
  },
  {
    name: "Cadbury",
    quantity: "2",
    unitPrice: "30000",
    tax: "12",
    priceWithTax: "33600",
    discount: "10",
  },
];

export default function ProductTable() {
  const reversedCustomers = [...products].reverse();

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
            <th style={{ width: "30%", padding: "12px 6px" }}>Product Name</th>
            <th style={{ padding: "12px 6px" }}>Quantity</th>
            <th style={{ padding: "12px 6px" }}>Unit Price (Rs.)</th>
            <th style={{ padding: "12px 6px" }}>Discount (%)</th>
            <th style={{ padding: "12px 6px" }}>Tax (%)</th>
            <th style={{ padding: "12px 6px" }}>Price with Tax (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {reversedCustomers.map((row) => (
            <tr>
              <td>
                <Typography level="body-xs">{row.name}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.quantity}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.unitPrice}</Typography>
              </td>
              <td>
                <Typography level="body-xs">
                  {row.discount ? row.discount : "N/A"}
                </Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.tax}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.priceWithTax}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
