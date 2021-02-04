/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  MenuItem,
  TextField,
  TablePagination,
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { useQueries } from 'react-query';
import axios from 'axios';
import { green, blue } from '@material-ui/core/colors';
import BalanceChart from './BalanceChart';
import InfoCard from './InfoCard';
import Transaction from './Transaction';
import Loading from './Loading';
import Error from './Error';
import { API, GECKO_API } from '../api';
import { TransactionsResponse, CoinsValue } from '../type/types';

// Array representing the differents options available (TextField Select)
const coins = [
  {
    value: 'BTC',
    label: 'Bitcoin',
  },
  {
    value: 'ETH',
    label: 'Ethereum',
  },
];

// Functions passed to React-Query which then handle fetching datas
const fetchTransactions = async (address: string, currency: string): Promise<any> => {
  const res = await axios.get(`${API}/${currency.toLowerCase()}/address/${address}`);
  return res;
};

const fetchCoinsPrice = async (): Promise<any> => {
  const res = await axios.get(GECKO_API);
  return res;
};
// ==================================================================

// Map through an array of transactions to render a card for each of them
const displayTransactions = (
  array: Array<TransactionsResponse>,
  currency: string,
  coinsValue: CoinsValue | null,
): JSX.Element => (
  <div>
    <Box mt={10} mb={5}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography variant="h5" color="textPrimary">
            Transactions History
          </Typography>
        </Grid>
        {array &&
          array.map((item: TransactionsResponse) => (
            <Transaction item={item} currency={currency} coinsValue={coinsValue} />
          ))}
      </Grid>
    </Box>
  </div>
);

const Dashboard: React.FC = () => {
  const [currency, setCurrency] = useState('BTC');
  const [address, setAddress] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [transactions, setTransactions] = useState<Array<TransactionsResponse> | null>(null);
  const [coinsValue, setCoinsValue] = useState<CoinsValue | null>(null);
  const results: any = useQueries([
    {
      queryKey: 'transactions',
      queryFn: () => fetchTransactions(address, currency),
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: ({ data }: any) => {
        setTransactions(data);
      },
    },
    {
      queryKey: 'coinsPrice',
      queryFn: fetchCoinsPrice,
      onSuccess: ({ data }: any) => {
        setCoinsValue({ btc: data.bitcoin.usd, eth: data.ethereum.usd });
      },
    },
  ]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTransactions(null);
    results[0].remove();
    setCurrency(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAddress(event.target.value);
  };

  const handleButton = (): void => {
    setTransactions(null);
    results[0].remove();
    results[0].refetch();
  };

  // Array containing only the transactions within pagination range
  const paginatedArray =
    transactions && transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const SearchBar = (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                id="outlined-select-currency"
                select
                label="Type"
                value={currency}
                onChange={handleCurrencyChange}
                variant="outlined"
              >
                {coins.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={8} md={7}>
              <TextField
                value={address}
                onChange={handleAddressChange}
                fullWidth
                id="address-input"
                label="Address"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button onClick={handleButton} fullWidth size="large" color="primary">
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container>
      <Grid container spacing={3}>
        {SearchBar}
        {results[0].isLoading && <Loading />}
        {results[0].isError && <Error error={results[0].error} />}
        {!results[0].isLoading && transactions && (
          <>
            <InfoCard
              title="Final Balance"
              content={`${transactions[0].balance} ${currency}`}
              secondaryContent={
                coinsValue &&
                `${(
                  transactions[0].balance * coinsValue[currency.toLowerCase() as keyof CoinsValue]
                ).toFixed(2)} USD`
              }
              iconBgColor={green[500]}
              icon={<AttachMoneyIcon />}
            />
            <InfoCard
              title="Total Transactions"
              content={transactions.length}
              iconBgColor={blue[500]}
              icon={<ReceiptIcon />}
            />
            <Grid item xs={12}>
              <Paper>
                <CardContent>
                  <BalanceChart data={transactions} coinsValue={coinsValue} currency={currency} />
                </CardContent>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
      {!results[0].isLoading &&
        paginatedArray &&
        displayTransactions(paginatedArray, currency, coinsValue)}
      {!results[0].isLoading && transactions && (
        <TablePagination
          style={{ display: 'flex', justifyContent: 'center' }}
          component="div"
          count={transactions && transactions.length}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </Container>
  );
};

export default Dashboard;
