import axios from 'axios';
import { UserType } from '../types/UserType';

// const config = {
//   baseUrl: import.meta.env.VITE_API_BASE_URL as string,
// };

export async function fetchSession(): Promise<UserType> {
  const response = await axios.get('/mocks/User.json');

  return response.data;
}
