export interface TableProductClient {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TableProductPayload {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TableClient {
  _id: string;
  number: number;
  location: string;
  isOccupied: boolean;
}

export interface TableWithProducts extends TableClient {
  products: TableProductClient[];
}

export interface TableInput {
  location: string;
}
