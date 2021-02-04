import React from 'react';
import { Typography, Grid, Paper, CardContent, Avatar } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

interface InfoCardProps {
  title: string;
  content: string | number;
  secondaryContent?: string | null;
  iconBgColor?: string;
  iconColor?: string;
  icon?: JSX.Element | null;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  content,
  secondaryContent,
  iconBgColor,
  iconColor,
  icon,
}) => (
  <Grid item xs={12} md={4}>
    <Paper style={{ height: '100%' }}>
      <CardContent>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="button" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5" color="textPrimary">
              {content}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {secondaryContent}
            </Typography>
          </Grid>
          {icon && (
            <Grid item>
              <Avatar style={{ color: iconColor, backgroundColor: iconBgColor }}>{icon}</Avatar>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Paper>
  </Grid>
);

InfoCard.defaultProps = {
  iconBgColor: blue[500],
  iconColor: '#fff',
  icon: null,
  secondaryContent: '',
};

export default InfoCard;
