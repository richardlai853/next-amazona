import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, require: true },
    remark: { type: String, require: false },
    phone: { type: String, require: true },
    paymentMethod: { type: String, require: false },
    totalPrice: { type: Number, require: true },
    isPaid: { type: Boolean, require: true, default: false },
    isDelivered: { type: Boolean, require: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
