export type PaymentType = "efectivo" | "tarjeta" | "dividido";
export type SaleStatus = "pagado" | "pendiente";

export interface PaymentDetails {
  cashAmount: number;
  cardAmount: number;
}

export interface SaleProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SaleProductPopulated {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface SaleClient {
  _id: string;
  products: SaleProductPopulated[];
  status: SaleStatus;
  paymentType: PaymentType;
  paymentDetails: PaymentDetails;
  total: number;
  createdAt: string;
}

export interface ClosedDayClient {
  _id: string;
  totalAmount: number;
  saleCount: number;
  date: string;
  closedAt?: string;
}

export interface RecentSale {
  _id: string;
  totalAmount: number;
  saleCount: number;
  date: string;
  closedAt?: string;
}

export interface OpenDay {
  _id: string;
  date: string;
  totalAmount: number;
  saleCount: number;
  isClosed: boolean;
}

export interface SalesSummary {
  day: number;
  month: number;
  year: number;
  changeDay: number;
  changeMonth: number;
  changeYear: number;
  cashTotal?: number;
  cardTotal?: number;
  cashTotalMonth?: number;
  cardTotalMonth?: number;
  recentSales?: RecentSale[];
  openDays?: OpenDay[];
}

export interface MonthlyTotal {
  month: string;
  total: number;
  efectivo: number;
  tarjeta: number;
}
