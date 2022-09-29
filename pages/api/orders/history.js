import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../utils/db';
import { OnError } from '../../../utils/error';
import { isAuth } from '../../../utils/auth';

const handler = nc({
  OnError,
});

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({ user: req.user._id });

  res.send(orders);

  await db.disconnect();
});

export default handler;
