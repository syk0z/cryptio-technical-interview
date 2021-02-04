import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import Dashboard from './Dashboard';
import Navbar from './Navbar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      padding: theme.spacing(3),
    },
  }),
);

const queryClient = new QueryClient();

const App = (): JSX.Element => {
  const classes = useStyles();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Navbar />
        <div className={classes.content}>
          <Dashboard />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
