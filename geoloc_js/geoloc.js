const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to Geolocation!')
})

app.get('/get_my_ip', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  return res.status(200).json({'Your IP': ip})
})

app.get('/get_my_location', (req, res) => {

  function toIp(int) {
    return ( (int>>>24) +'.'+ (int>>16 & 255) +'.'+ (int>>8 & 255) +'.'+ (int & 255) );
  }

  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  let ip1 = ip.split(".");
  let ip2 = (ip1[0] * (256 ** 3)) + (ip1[1] * (256 ** 2)) + (ip1[2] * (256 ** 1)) + (ip1[3] * (256 ** 0));

  let data = require("fs").readFileSync("IP2LOCATION-LITE-DB1.CSV", "utf8");
  data = data.split("\r\n");
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].replace(/['"]+/g, '').split(",");
  }

  for (let row of data){
    if (+row[0] < ip2 && ip2 < +row[1]) {
      return res.status(200).json({
        "Your IP adress": ip,
        "Location": row[2],
        "Country": row[3],
        "IP range start": toIp(row[0]),
        "IP range end": toIp(row[1])
      })
    }
  }

})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})