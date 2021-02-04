import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flex: 1,
      padding: theme.spacing(10),
      justifyContent: 'center',
    },
  }),
);

interface ApiError {
  response: {
    status: number;
    data: string;
  };
}

interface ErrorProps {
  error: ApiError;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  const classes = useStyles();

  let errorMessage = '';

  if (error.response.status === 429) errorMessage = 'Too Many Requests (API Limitations)';
  else errorMessage = error.response.data;

  return (
    <div className={classes.root}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {errorMessage}
      </Alert>
    </div>
  );
};

export default Error;
