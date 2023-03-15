import nc from 'next-connect';
import Booking from '../../../../models/Booking';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  await db.connect();
  const order = await Booking.findById(req.query.id).populate('user', 'name');
  await db.disconnect();
  res.send(order);
});

export default handler;
