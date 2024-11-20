import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

const customers = [
  { id: "U-0001", name: "Shounak", phone: "9999999994", total: "30000" },
  { id: "U-0002", name: "Ram", phone: "9999699994", total: "10000" },
  { id: "U-0003", name: "Akrit", phone: "9999999994", total: "20000" },
  { id: "U-0004", name: "Anjali", phone: "9999999994", total: "50000" },
  { id: "U-0001", name: "Shounak", phone: "9999999994", total: "30000" },
  { id: "U-0002", name: "Ram", phone: "9999699994", total: "10000" },
  { id: "U-0003", name: "Akrit", phone: "9999999994", total: "20000" },
  { id: "U-0004", name: "Anjali", phone: "9999999994", total: "50000" },
  { id: "U-0001", name: "Shounak", phone: "9999999994", total: "30000" },
  { id: "U-0002", name: "Ram", phone: "9999699994", total: "10000" },
  { id: "U-0003", name: "Akrit", phone: "9999999994", total: "20000" },
  { id: "U-0004", name: "Anjali", phone: "9999999994", total: "50000" },
  { id: "U-0001", name: "Shounak", phone: "9999999994", total: "30000" },
  { id: "U-0002", name: "Ram", phone: "9999699994", total: "10000" },
  { id: "U-0003", name: "Akrit", phone: "9999999994", total: "20000" },
  { id: "U-0004", name: "Anjali", phone: "9999999994", total: "50000" },
  { id: "U-0001", name: "Shounak", phone: "9999999994", total: "30000" },
  { id: "U-0002", name: "Ram", phone: "9999699994", total: "10000" },
  { id: "U-0003", name: "Akrit", phone: "9999999994", total: "20000" },
  { id: "U-0004", name: "Anjali", phone: "9999999994", total: "50000" },
  // Add more rows here
];

export default function ProductTable() {
  const reversedCustomers = [...customers].reverse();

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
            <th style={{ width: "30%", padding: "12px 6px" }}>Name</th>
            <th style={{ width: "30%", padding: "12px 6px" }}>
              Total Amount (Rs.)
            </th>
            <th style={{ width: "30%", padding: "12px 6px" }}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {reversedCustomers.map((row) => (
            <tr key={row.id}>
              <td>
                <Typography level="body-xs">{row.name}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.total}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.phone}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
