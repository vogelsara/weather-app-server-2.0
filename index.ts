import express from 'express';

const axios = require('axios');
const app = express();
const PORT = 8000;
const API_KEY = 'ded5bd16eed0f94476ad6420e0bf3455'
const GOTHENBURG_COORD = {
    lat: 57.71,
    lon: 11.97,
}

app.get('/', (req,res) => {
  axios.get(`http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${GOTHENBURG_COORD.lat}&lon=${GOTHENBURG_COORD.lon}&dt=1629025098&&appid=${API_KEY}`)
  .then((response: { data: any; }) => {
    res.send(response.data);
  })

})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});