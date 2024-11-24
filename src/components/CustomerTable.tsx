import { useSelector } from "react-redux";
import { selectCustomers } from "../features/customerScreen/customerSlice";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

export default function CustomerTable() {
  const customers = useSelector(selectCustomers);
  const reversedCustomers = [...customers].reverse();

  const isColumnEmpty = (key: any) =>
    reversedCustomers.every(
      (row) =>
        !row[key] && row[key] !== 0 && row[key] !== "N/A" && row[key] !== "null"
    );

  const headers = [
    { key: "id", label: "User ID" },
    { key: "customerName", label: "Name" },
    { key: "phoneNumber", label: "Phone" },
    { key: "totalPurchaseAmount", label: "Total Purchase Amount" },
    { key: "customerCompany", label: "Company Name" },
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
      {reversedCustomers.length === 0 ? (
        <Sheet
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <Typography sx={{ mb: 2 }}>No customer data available.</Typography>
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
                    padding: "12px 6px",
                    color: isColumnEmpty(header.key) ? "red" : "inherit",
                  }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reversedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <Typography level="body-xs">
                    {customer.id?.slice(0, 6) || "N/A"}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {customer.customerName || "N/A"}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {customer.phoneNumber || "N/A"}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {customer.totalPurchaseAmount || "N/A"}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {customer.customerCompany || "N/A"}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Sheet>
  );
}
