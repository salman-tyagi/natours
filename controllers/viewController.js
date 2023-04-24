import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';

export const getOverview = catchAsync(async (req, res) => {
  // 1. Get tours data from the collection
  const tours = await Tour.find();

  // 2. Generate a template of the collected tour
  // 3. Render that generated template

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
    user: req.user,
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  // 1. Get tour data from the collection
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'name, review, rating',
  });

  if (!tour) {
    return next(new AppError('No tour available with this id', 404));
  }

  // 2. Generate a template of the collected tour
  // 3. Render that generated template
  res.status(200).render('tour', {
    title: tour.name,
    tour,
    user: req.user,
  });
});

export const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
    user: req.user,
  });
};

export const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My account',
    user: req.user,
  });
};

export const getMyBookings = catchAsync(async (req, res, next) => {
  // 1. Find all the related bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2. Find tours with id of bookings
  const toursId = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: toursId } });

  res.status(200).render('overview', {
    title: 'My bookings',
    user: req.user,
    tours,
  });
});

export const updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'My account',
    user: updatedUser,
  });
});
