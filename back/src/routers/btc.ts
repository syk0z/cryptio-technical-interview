/* eslint-disable camelcase */
import { Router } from 'express';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { BtcBalanceBody, BtcAddressInfo } from '../type/types';
import { BTC_API_URL, BTC_TX_MAX } from '../constants/api';

const btcRouter = Router();

const satoshiToBtc = (value: string | number): number => {
  const res = new BigNumber(value).dividedBy(100000000);
  return Number(res);
};

const calculateHistoricalBalances = (data: Array<BtcBalanceBody>) => {
  const reduced = data.reduceRight((prev, curr, index) => {
    if (index === data.length - 1) {
      prev.push({ ...curr, balance: curr.formattedValue });
    } else {
      prev.unshift({ ...curr, balance: curr.formattedValue + prev[0].balance });
    }
    return prev;
  }, <Array<BtcBalanceBody>>[]);
  return reduced;
};

const parseTx = (data: BtcAddressInfo, address: string): Array<BtcBalanceBody> => {
  const processedTxs = data.txs.map(txItem => {
    const parsedInputs = txItem.inputs
      .filter(item => item.prev_out.addr === address)
      .map(item => item.prev_out.value)
      .reduce((n1, n2) => n1 + n2, 0);

    const parsedOutputs = txItem.out
      .filter(item => item.addr === address)
      .map(item => item.value)
      .reduce((n1, n2) => n1 + n2, 0);

    const formattedValue = -parsedInputs + parsedOutputs;

    return {
      inputsValue: satoshiToBtc(parsedInputs),
      outputsValue: satoshiToBtc(parsedOutputs),
      formattedValue: satoshiToBtc(formattedValue),
      time: txItem.time,
      balance: 0,
    };
  });
  return processedTxs;
};

const getTransactions = async (
  address: string,
  offset: number = 0,
  data: Array<BtcBalanceBody> = [],
): Promise<Array<BtcBalanceBody> | any> => {
  try {
    const res = await axios.get<BtcAddressInfo>(
      `${BTC_API_URL}/rawaddr/${address}?offset=${offset * BTC_TX_MAX}`,
    );
    const newValues = parseTx(res.data, address);
    data.push(...newValues);
    const { n_tx } = res.data;
    if (n_tx <= BTC_TX_MAX || (offset + 1) * BTC_TX_MAX >= n_tx)
      return calculateHistoricalBalances(data);
    return await getTransactions(address, offset + 1, data);
  } catch (error) {
    if (error.response) {
      return { status: error.response.status, message: error.response.data };
    }
    if (error.request) {
      return { status: error.request.res.statusCode, message: error.request.res.statusMessage };
    }
    return { status: 500, message: error.message };
  }
};

btcRouter.get('/address/:addr?', async (req, res) => {
  const { addr } = req.params;
  if (!addr) {
    res.status(400).json('You need to specify a bitcoin address');
    return;
  }

  const result = await getTransactions(addr);
  if (result.status) res.status(result.status || 500).json(result.message);
  else res.json(result);
});

export default btcRouter;
