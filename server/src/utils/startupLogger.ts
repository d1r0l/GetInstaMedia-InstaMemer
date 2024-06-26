import axios from 'axios';
import errorHandler from './errorHandler';
import { axiosProxy } from './config';
import { envMode } from './config';

interface MyIpResponse {
  ip: string;
  country: string;
  cc: string;
}

/**
 * Logs the server startup message with the current environment mode
 * and IP address and country of the outgoing connection.
 *
 * @param {void} - No parameters
 * @return {void} - No return value
 */
const startupLogger = () => {
  console.log(`Starting server in ${envMode} mode`);

  axios({
    method: 'get',
    url: 'https://api.myip.com',
    proxy: axiosProxy,
  })
    .then((res) => {
      const resData = res.data as MyIpResponse;
      console.log(
        `Connected from ${resData.ip} (${resData.cc}: ${resData.country})`,
      );
    })
    .catch(errorHandler);
};

export default startupLogger;
