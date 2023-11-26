import axios from 'axios';
import { UserType } from '../types/UserType';

// const config = {
//   baseUrl: import.meta.env.VITE_API_BASE_URL as string,
// };

// export async function login(): Promise<UserType> {
//   // const response = await axios.post(`${config.baseUrl}/auth/login`, {});
//   // mock data from /mocks/User.json
//   const response = await axios.get('/mocks/User.json');
//   return response.data;
// }

export async function fetchSession(): Promise<UserType> {
  const resonse = await axios.post('', {
    credentials: 'include',
  });

  return resonse.json();
}
