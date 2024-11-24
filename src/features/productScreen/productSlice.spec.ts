import productReducer, {
  addProduct,
  updateProduct,
  deleteProduct,
} from "./productSlice";

describe("product reducer", () => {
  const initialState = [
    {
      id: "1",
      name: "Widget",
      unitPrice: 10,
      quantity: 5,
      tax: 2,
      taxPercentage: 20,
      priceWithTax: 12,
      discount: 1,
    },
  ];

  it("should handle initial state", () => {
    expect(productReducer(undefined, { type: "unknown" })).toEqual([]);
  });

  it("should handle addProduct", () => {
    const newProduct = {
      id: "2",
      name: "Gadget",
      unitPrice: 20,
      quantity: 3,
      tax: 3,
      taxPercentage: 15,
      priceWithTax: 23,
      discount: 2,
    };
    const actual = productReducer(initialState, addProduct(newProduct));
    expect(actual).toEqual([...initialState, newProduct]);
  });

  it("should handle addProduct with multiple products", () => {
    const newProducts = [
      {
        id: "2",
        name: "Gadget",
        unitPrice: 20,
        quantity: 3,
        tax: 3,
        taxPercentage: 15,
        priceWithTax: 23,
        discount: 2,
      },
      {
        id: "3",
        name: "Device",
        unitPrice: 30,
        quantity: 2,
        tax: 4,
        taxPercentage: 10,
        priceWithTax: 34,
        discount: 3,
      },
    ];
    const actual = productReducer(initialState, addProduct(newProducts));
    expect(actual).toEqual([...initialState, ...newProducts]);
  });

  it("should handle updateProduct", () => {
    const updatedProduct = {
      id: "1",
      name: "Updated Widget",
      unitPrice: 15,
      quantity: 10,
      tax: 3,
      taxPercentage: 20,
      priceWithTax: 18,
      discount: 1.5,
    };
    const actual = productReducer(initialState, updateProduct(updatedProduct));
    expect(actual).toEqual([updatedProduct]);
  });

  it("should handle deleteProduct", () => {
    const actual = productReducer(initialState, deleteProduct("1"));
    expect(actual).toEqual([]);
  });
});
