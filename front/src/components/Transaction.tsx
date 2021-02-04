import React from 'react';
import { Typography, Grid, Paper, CardContent, CardActions } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import { TransactionsResponse, CoinsValue } from '../type/types';

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    greenText: {
      color: green[500],
    },
    redText: {
      color: red[500],
    },
  }),
);

interface InfoCardProps {
  item: TransactionsResponse;
  currency: string;
  coinsValue?: CoinsValue | null;
}

const Transaction: React.FC<InfoCardProps> = ({ item, currency, coinsValue }) => {
  const classes = useStyles();

  const usdValue = coinsValue
    ? `(${(item.formattedValue * coinsValue[currency.toLowerCase() as keyof CoinsValue]).toFixed(
        2,
      )} USD)`
    : '';

  const usdBalanceValue = coinsValue
    ? `(${(item.balance * coinsValue[currency.toLowerCase() as keyof CoinsValue]).toFixed(2)} USD)`
    : '';

  const usdFeesValue =
    coinsValue && currency === 'ETH' && item.fees
      ? `(${(item.fees * coinsValue[currency.toLowerCase() as keyof CoinsValue]).toFixed(2)} USD)`
      : '';

  return (
    <Grid item xs={12} sm={8} md={6}>
      <Paper>
        <CardContent>
          <Typography
            variant="button"
            component="p"
            className={item.formattedValue < 0 ? classes.redText : classes.greenText}
          >
            {item.formattedValue > 0
              ? `+${item.formattedValue} ${currency} ${usdValue}`
              : `${item.formattedValue} ${currency} ${usdValue}`}
          </Typography>
          {currency === 'ETH' && item.formattedValue < 0 && (
            <Typography
              variant="caption"
              color="textSecondary"
            >{`Fees: ${item.fees} ${currency} ${usdFeesValue}`}</Typography>
          )}
          <Typography variant="body2">{`New balance: ${item.balance} ${currency} ${usdBalanceValue}`}</Typography>
        </CardContent>
        <CardActions>
          <Typography variant="caption" color="textSecondary">
            {new Date(item.time * 1000).toLocaleString('en-US')}
          </Typography>
        </CardActions>
      </Paper>
    </Grid>
  );
};

export default Transaction;
