import axios from 'axios';
import { showAlert } from './alerts.js';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  const url =
    type === 'password'
      ? `${window.location.origin}/api/v1/users/update-my-password`
      : `${window.location.origin}/api/v1/users/update-me`;

  try {
    const result = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (result.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated Successfully!`);
    }
  } catch (err) {
    if (err.isAxiosError) showAlert('error', err.response.data.message);
    else console.log(err);
  }
};
