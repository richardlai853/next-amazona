import nc from 'next-connect';
import Booking from '../../../models/Booking';
import db from '../../../utils/db';
import { OnError } from '../../../utils/error';
import { isAuth } from '../../../utils/auth';

const handler = nc({
  OnError,
});

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  const newBooking = new Booking({
    ...req.body,
    user: req.user._id,
  });
  const order = await newBooking.save();

  res.status(201).send(order);

  await db.disconnect();
});

export default handler;
