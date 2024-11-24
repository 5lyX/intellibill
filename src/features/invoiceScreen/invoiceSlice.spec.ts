import invoiceReducer, {
  addInvoice,
  updateInvoice,
  deleteInvoice,
} from "./invoiceSlice";

describe("invoice reducer", () => {
  const initialState = [
    {
      id: "1",
      customerName: "John Doe",
      date: "2024-01-01",
      productName: "Widget",
      quantity: 10,
      serialNumber: "ABC123",
      tax: 5,
      taxPercentage: 10,
      totalAmount: 55,
    },
  ];

  it("should handle initial state", () => {
    expect(invoiceReducer(undefined, { type: "unknown" })).toEqual([]);
  });

  it("should handle addInvoice", () => {
    const newInvoice = {
      id: "2",
      customerName: "Jane Smith",
      date: "2024-01-02",
      productName: "Gadget",
      quantity: 5,
      serialNumber: "XYZ789",
      tax: 2.5,
      taxPercentage: 5,
      totalAmount: 52.5,
    };
    const actual = invoiceReducer(initialState, addInvoice(newInvoice));
    expect(actual).toEqual([...initialState, newInvoice]);
  });

  it("should handle addInvoice with multiple invoices", () => {
    const newInvoices = [
      {
        id: "2",
        customerName: "Jane Smith",
        date: "2024-01-02",
        productName: "Gadget",
        quantity: 5,
        serialNumber: "XYZ789",
        tax: 2.5,
        taxPercentage: 5,
        totalAmount: 52.5,
      },
      {
        id: "3",
        customerName: "Alice Johnson",
        date: "2024-01-03",
        productName: "Device",
        quantity: 2,
        serialNumber: "LMN456",
        tax: 1,
        taxPercentage: 2,
        totalAmount: 21,
      },
    ];
    const actual = invoiceReducer(initialState, addInvoice(newInvoices));
    expect(actual).toEqual([...initialState, ...newInvoices]);
  });

  it("should handle updateInvoice", () => {
    const updatedInvoice = {
      id: "1",
      customerName: "John Doe",
      date: "2024-01-01",
      productName: "Updated Widget",
      quantity: 20,
      serialNumber: "ABC123",
      tax: 10,
      taxPercentage: 10,
      totalAmount: 110,
    };
    const actual = invoiceReducer(initialState, updateInvoice(updatedInvoice));
    expect(actual).toEqual([updatedInvoice]);
  });

  it("should handle deleteInvoice", () => {
    const actual = invoiceReducer(initialState, deleteInvoice("1"));
    expect(actual).toEqual([]);
  });
});
