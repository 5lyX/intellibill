import customerReducer, {
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "./customerSlice";

describe("customer reducer", () => {
  const initialState = [
    {
      id: "1",
      customerName: "John Doe",
      phoneNumber: "1234567890",
      totalPurchaseAmount: 100,
      customerCompany: "Apple Inc",
    },
  ];

  it("should handle initial state", () => {
    expect(customerReducer(undefined, { type: "unknown" })).toEqual([]);
  });

  it("should handle addCustomer", () => {
    const newCustomer = {
      id: "2",
      customerName: "Jane Smith",
      phoneNumber: "0987654321",
      totalPurchaseAmount: 200,
      customerCompany: "Google",
    };
    const actual = customerReducer(initialState, addCustomer(newCustomer));
    expect(actual).toEqual([...initialState, newCustomer]);
  });

  it("should handle addCustomer with multiple customers", () => {
    const newCustomers = [
      {
        id: "2",
        customerName: "Jane Smith",
        phoneNumber: "0987654321",
        totalPurchaseAmount: 200,
        customerCompany: "NVIDIA",
      },
      {
        id: "3",
        customerName: "Alice Johnson",
        phoneNumber: "1122334455",
        totalPurchaseAmount: 300,
        customerCompany: "AMD",
      },
    ];
    const actual = customerReducer(initialState, addCustomer(newCustomers));
    expect(actual).toEqual([...initialState, ...newCustomers]);
  });

  it("should handle updateCustomer", () => {
    const updatedCustomer = {
      id: "1",
      customerName: "Johnathan Doe",
      phoneNumber: "1234567890",
      totalPurchaseAmount: 150,
      customerCompany: "Mercedez Inc",
    };
    const actual = customerReducer(
      initialState,
      updateCustomer(updatedCustomer)
    );
    expect(actual).toEqual([updatedCustomer]);
  });

  it("should handle deleteCustomer", () => {
    const actual = customerReducer(initialState, deleteCustomer("1"));
    expect(actual).toEqual([]);
  });
});
