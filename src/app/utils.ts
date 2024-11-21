import { v4 as uuidv4 } from "uuid";

export function openSidebar() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--SideNavigation-slideIn", "1");
  }
}

export function closeSidebar() {
  if (typeof window !== "undefined") {
    document.documentElement.style.removeProperty("--SideNavigation-slideIn");
    document.body.style.removeProperty("overflow");
  }
}

export function toggleSidebar() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--SideNavigation-slideIn");
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

export function appendUniqueIds(data: any) {
  return {
    customers: data.customers.map((customer: any) => ({
      ...customer,
      id: uuidv4(),
    })),
    products: data.products.map((product: any) => ({
      ...product,
      id: uuidv4(),
    })),
    invoices: data.invoices.map((invoice: any) => ({
      ...invoice,
      id: uuidv4(),
    })),
  };
}
