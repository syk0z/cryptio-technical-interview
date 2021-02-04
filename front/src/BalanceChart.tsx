import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { TransactionsResponse, CoinsValue } from './type/types';

interface BalanceChartProps {
  data: Array<TransactionsResponse>;
  coinsValue: CoinsValue | null;
  currency: string;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data, coinsValue, currency }) => {
  const timeAxis = data.map((item: TransactionsResponse) =>
    new Date(item.time * 1000).toLocaleString('en-US'),
  );
  const balanceAxis = data.map((item: TransactionsResponse) => item.balance);
  const balanceUsdAxis = coinsValue
    ? data.map(
        (item: TransactionsResponse) =>
          item.balance * coinsValue[currency.toLowerCase() as keyof CoinsValue],
      )
    : [];
  const [options] = useState({
    chart: {
      id: 'basic-bar',
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: 'Balance History',
      align: 'left',
    },
    xaxis: {
      categories: timeAxis.reverse(),
      title: {
        text: 'Time',
      },
    },
    yaxis: [
      {
        title: {
          text: 'Balance',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Balance in USD',
        },
      },
    ],
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    markers: {
      size: 1,
    },
  });
  const [series] = useState([
    {
      name: 'Balance',
      data: balanceAxis.reverse(),
    },
    {
      name: 'Balance in USD',
      data: balanceUsdAxis.reverse(),
    },
  ]);

  return (
    <div>
      <Chart options={options} series={series} type="line" width="70%" />
    </div>
  );
};

export default BalanceChart;
