/* eslint-disable camelcase */
export interface EthTxInfo {
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timeStamp: string;
}

export interface EthBalanceBody {
  from: string;
  to: string;
  formattedValue: number;
  fees: number;
  balance: number;
  time: number;
}

export interface BtcTxOutput {
  spent: boolean;
  tx_index: number;
  type: number;
  addr: string;
  value: number;
  n: number;
  script: string;
}

export interface BtcTxInput {
  sequence: number;
  witness: string;
  prev_out: BtcTxOutput;
  script: string;
}

export interface BtcTxInfo {
  lock_time: number;
  result: number;
  size: number;
  block_index: number;
  time: number;
  tx_index: number;
  vin_sz: number;
  hash: string;
  vout_sz: number;
  inputs: Array<BtcTxInput>;
  out: Array<BtcTxOutput>;
}

export interface BtcAddressInfo {
  hash160: string;
  address: string;
  n_tx: number;
  total_received: number;
  total_sent: number;
  final_balance: number;
  txs: Array<BtcTxInfo>;
}

export interface BtcBalanceBody {
  inputsValue: number;
  outputsValue: number;
  formattedValue: number;
  time: number;
  balance: number;
}
