import express from 'express';
import * as viewController from '../controllers/viewController.js';
import * as authController from '../controllers/authController.js';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.get(
  '/',
  // bookingController.createBookinCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/my-account', authController.protect, viewController.getAccount);
router.get(
  '/my-bookings',
  authController.protect,
  viewController.getMyBookings
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

export default router;
