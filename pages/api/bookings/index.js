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
  const oldOrder = await Booking.findOne({ date: req.body.date }).exec();
  if (oldOrder == null) {
    const newBooking = new Booking({
      ...req.body,
      user: req.user._id,
    });
    const order = await newBooking.save();
    res.status(201).send(order);
  } else {
    res.status(409).send('already booked');
  }

  await db.disconnect();
});

export default handler;
