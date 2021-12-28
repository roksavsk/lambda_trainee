const express = require('express')
const app = express()
const port = 3000
const momentBusinessTime = require("moment-business-time");
const moment = require("moment");
const jsonParser = express.json();

app.get('/', (req, res) => {
  res.send('Welcome to Correctarium!')
})

moment.updateLocale('en', {
    workinghours: {
        0: null,
        1: ['10:00:00', '19:00:00'],
        2: ['10:00:00', '19:00:00'],
        3: ['10:00:00', '19:00:00'],
        4: ['10:00:00', '19:00:00'],
        5: ['10:00:00', '19:00:00'],
        6: null
    }
});

let allowed_format = new Array (null, "doc", "docx", "rtf");

app.get('/deadline_cost', jsonParser, function (req, res) {

    let language = req.body.language;
    let file_extension = req.body.file_extension; 
    let chr_count = req.body.chr_count;
    let order_time = req.body.order_time;
    let chr_price = 0, minimal_cost = 0, lead_time = 0, chr_per_hour = 0;

    if (language == "ukr" || "rus") {
        chr_price = 0.05;
        minimal_cost = 50;
    }
    if (language == "eng") {
        chr_price = 0.12;
        minimal_cost = 120;
    }
    let price = chr_price * Number(chr_count);
    if (!allowed_format.includes(file_extension)) {
        price += price * 0.2;
    }
    if (price < minimal_cost) {
        return String(minimal_cost);
    }
    price = price.toFixed(2);

    let time_minimum = 1;
    order_time = Date.parse(order_time);

    if (language == "ukr" || "rus"){
        chr_per_hour = 1333;
    }
    if (language == "eng") {
        chr_per_hour = 333;
    }
    if (!allowed_format.includes(file_extension)) {
        lead_time += lead_time * 0.2;
    }
    lead_time = chr_count / chr_per_hour
    time_total = 0.5 + lead_time
    if (time_total < time_minimum) {
        time_total = time_minimum;
    }
    business_hours = momentBusinessTime(order_time).addWorkingTime(Math.round(time_total), 'hours');
    timestamp = Math.floor(business_hours / 1000);
    deadline_date = business_hours.toString();

    res.json({
        "price": price, 
        "time": String(Math.round(time_total)), 
        "timestamp": timestamp, 
        "deadline_date": deadline_date,
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})