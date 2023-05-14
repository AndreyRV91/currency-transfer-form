export interface Currency {
  id: number;
  code: string;
  name: string;
  decimals: number;
}

export interface User {
  id: number;
  name: string;
  currencies: Record<string, string>;
}
