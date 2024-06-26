import axios from 'axios';
import errorHandler from './errorHandler';

interface MyIpResponse {
  ip: string;
  country: string;
  cc: string;
}

const logConnectionIp = () => {
  axios({
    method: 'get',
    url: 'https://api.myip.com',
  })
    .then((res) => {
      const resData = res.data as MyIpResponse;
      console.log(
        `Connected from ${resData.ip} (${resData.cc}: ${resData.country})`,
      );
    })
    .catch(errorHandler);
};

export default logConnectionIp;
