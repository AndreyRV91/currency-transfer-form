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

export interface TransferRequestBody {
  currencyId: number;
  fromUserId: number;
  toUserId: number;
  amount: string;
}
export interface TransferResponse {
  transferId: string;
  amount: string;
}
