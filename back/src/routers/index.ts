import { Router } from 'express';
import btcRouter from './btc';
import ethRouter from './eth';

const routes = Router();

routes.use('/btc', btcRouter);
routes.use('/eth', ethRouter);

export default routes;
