import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { selectProducts } from "../features/productScreen/productSlice";
import { useSelector } from "react-redux";

export default function ProductTable() {
  const products = useSelector(selectProducts);
  const reversedProducts = [...products].reverse();

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
      {reversedProducts.length === 0 ? (
        <Sheet
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <Typography sx={{ mb: 2 }}>No products data available.</Typography>
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
              <th style={{ width: "30%", padding: "12px 6px" }}>
                Product Name
              </th>
              <th style={{ padding: "12px 6px" }}>Quantity</th>
              <th style={{ padding: "12px 6px" }}>Unit Price (Rs.)</th>
              <th style={{ padding: "12px 6px" }}>Discount (%)</th>
              <th style={{ padding: "12px 6px" }}>Tax (%)</th>
              <th style={{ padding: "12px 6px" }}>Price with Tax (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {reversedProducts.map((row) => (
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
      )}
    </Sheet>
  );
}
