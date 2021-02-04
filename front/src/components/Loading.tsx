import React from 'react';
import { CircularProgress } from '@material-ui/core';
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

const Loading = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
