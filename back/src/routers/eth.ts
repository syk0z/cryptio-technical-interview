/* eslint-disable camelcase */
import { Router } from 'express';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { EthTxInfo, EthBalanceBody } from '../type/types';
import { ETH_API_KEY, ETH_API_URL, ETH_TX_MAX } from '../constants/api';

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const ethRouter = Router();

const weiToEth = (value: string): string => {
  const res = new BigNumber(value).dividedBy(1000000000000000000).toString(10);
  return res;
};

const calculateFees = (gasUsed: string, gasPrice: string) => {
  const res = new BigNumber(gasUsed)
    .multipliedBy(gasPrice)
    .dividedBy(1000000000000000000)
    .toString(10);
  return res;
};

const calculateHistoricalBalances = (data: Array<EthBalanceBody>) => {
  const reduced = data.reduceRight((prev, curr, index) => {
    if (index === data.length - 1) {
      prev.push({ ...curr, balance: curr.formattedValue });
    } else {
      let balance = Number((prev[0].balance + curr.formattedValue).toFixed(10));
      if (curr.formattedValue < 0) balance -= curr.fees;
      prev.unshift({ ...curr, balance });
    }
    return prev;
  }, <Array<EthBalanceBody>>[]);
  return reduced;
};

const parseTx = (data: Array<EthTxInfo>, address: string): Array<EthBalanceBody> => {
  const result = data.map(txItem => {
    const { from } = txItem;
    const { to } = txItem;
    const ethVal = weiToEth(txItem.value);
    const formattedValue =
      from === address.toLowerCase() ? Math.abs(Number(ethVal)) * -1 : Number(ethVal);
    const fees = Number(calculateFees(txItem.gasUsed, txItem.gasPrice));
    return { from, to, formattedValue, fees, balance: 0, time: Number(txItem.timeStamp) };
  });
  return result;
};

const getTransactions = async (
  address: string,
  page: number = 1,
  data: Array<EthBalanceBody> = [],
): Promise<Array<EthBalanceBody> | any> => {
  try {
    if (page * ETH_TX_MAX > 10000) return calculateHistoricalBalances(data); // Careful api cannot return more than 10 000 records even through pagination !!!
    const res = await axios.get(
      `${ETH_API_URL}?module=account&action=txlist&address=${address}&sort=desc&page=${page}&offset=${ETH_TX_MAX}&apikey=${ETH_API_KEY}`,
    );
    if (res.data.status === '0' && res.data.message === 'NOTOK')
      throw Error('Invalid address format');
    const newValues = parseTx(res.data.result, address);
    data.push(...newValues);
    const n_tx = res.data.result.length;
    if (n_tx < ETH_TX_MAX) return calculateHistoricalBalances(data);
    return await getTransactions(address, page + 1, data);
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

ethRouter.get('/address/:addr?', async (req, res) => {
  const { addr } = req.params;
  if (!addr) {
    res.status(400).json('You need to specify a ethereum address');
    return;
  }

  const result = await getTransactions(addr);
  if (result.status) res.status(result.status || 500).json(result.message);
  else res.json(result);
});

export default ethRouter;
