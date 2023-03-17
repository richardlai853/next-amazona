import nc from 'next-connect';
import Booking from '../../../models/Booking';
import db from '../../../utils/db';
import { OnError } from '../../../utils/error';

const handler = nc({
  OnError,
});

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Booking.find({ date: { $gte: new Date() } }).select(
    '_id date'
  );
  res.send(orders);
});

export default handler;
