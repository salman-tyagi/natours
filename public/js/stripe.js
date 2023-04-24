import axios from 'axios';
import { showAlert } from './alerts.js';

export const bookTour = async tourId => {
  try {
    // 1. Get data from the api
    const session = await axios(
      `${window.location.origin}/api/v1/booking/checkout-session/${tourId}`
    );

    // 2. Create checkout form and charge the credit
    if (session.data.status === 'success') {
      showAlert(
        'success',
        'Redirecting to the payment page. Do not back or close the page!'
      );
      window.setTimeout(() => {
        location.assign(session.data.session.url);
      }, 2000);
    }
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
  } catch (err) {
    if (err.isAxiosError) showAlert('error', err);
    else console.log(err);
  }
};
