import Stripe from 'stripe';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import Booking from '../models/bookingModel.js';
import * as factory from '../controllers/handlerFactory.js';

export const getBookingSession = catchAsync(async (req, res, next) => {
  // 1. Get the current tour
  const tour = await Tour.findById(req.params.tourId);

  // 2. Checkout the strip session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-bookings`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    client_reference_id: req.params.tourId,
    customer: req.user.stripeCustomerId,
    line_items: [
      {
        price_data: {
          unit_amount: tour.price,
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  // 3. Send strip as resonse
  res.status(200).json({
    status: 'success',
    session,
  });
});

// export const createBookinCheckout = catchAsync(async (req, res, next) => {
//   // This is temporay and not secured because user can book tour without paying
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookinCheckout = async session => {
  const tour = session.client_reference_id;
  const user = await User.findOne({ email: req.user.email });
  const price = session.line_items[0].price_data.unit_amount;
  await Booking.create({ tour, user, price });
};

export const checkoutSession = (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = request.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookinCheckout(event.data.object);
    res.status(200).json({ recieved: true });
  }
};

export const createBoking = factory.createOne(Booking);
export const getAllBookings = factory.getAll(Booking);
export const getBooking = factory.getOne(Booking);
export const updateBooking = factory.updateOne(Booking);
export const deleteBooking = factory.deleteOne(Booking);
