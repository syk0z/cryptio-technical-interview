export interface TransactionsResponse {
  balance: number;
  time: number;
  formattedValue: number;
  fees?: number;
}

export interface CoinsValue {
  btc: number;
  eth: number;
}
