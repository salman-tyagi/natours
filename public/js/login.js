import axios from 'axios';
import { showAlert } from './alerts.js';

export const login = async (mail, pass) => {
  try {
    const result = await axios({
      method: 'POST',
      url: `${window.location.origin}/api/v1/users/login`,
      data: {
        email: mail,
        password: pass,
      },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1200);
    }
  } catch (err) {
    if (err.isAxiosError) showAlert('error', err.response.data.message);
    else console.log(err);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: `${window.location.origin}/api/v1/users/logout`,
    });

    if (result.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error in logging out. Try again later!');
  }
};
