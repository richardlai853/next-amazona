import nc from 'next-connect';
import Booking from '../../../models/Booking';
import { isAdmin } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAdmin);
handler.get(async (req, res) => {
  await db.connect();
  const orders = await Booking.find({}).populate('user', 'name');
  await db.disconnect();
  res.send(orders);
});

export default handler;
