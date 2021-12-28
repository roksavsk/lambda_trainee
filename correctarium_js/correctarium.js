const momentBusinessTime = require("moment-business-time");
const moment = require("moment");

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

function deadlineCost (language, file_extension, chr_count, order_time) {
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

    return [price, String(Math.round(time_total)), timestamp, deadline_date]
};

module.exports = deadlineCost;

console.log(deadlineCost("rus", "doc", 2941, "2021-11-30 11:15")); // [ '147.05', '3', 1638274500, 'Tue Nov 30 2021 14:15:00 GMT+0200' ]
console.log(deadlineCost("eng", "null", 970, "2021-12-04 18:00")); // [ '139.68', '3', 1638788400, 'Mon Dec 06 2021 13:00:00 GMT+0200' ]
console.log(deadlineCost("ukr", "other", 970, "2021-12-01 14:25")); // [ '58.20', '1', 1638365100, 'Wed Dec 01 2021 15:25:00 GMT+0200' ]
console.log(deadlineCost("eng", "rtf", 1216, "2021-12-02 18:45")); // [ '145.92', '4', 1638531900, 'Fri Dec 03 2021 13:45:00 GMT+0200' ]
console.log(deadlineCost("rus", "doc", 2500, "2021-12-03 22:15")); // [ '125.00', '2', 1638784800, 'Mon Dec 06 2021 12:00:00 GMT+0200' ]
console.log(deadlineCost("ukr", "other", 10000, "2021-12-06 23:30")); // [ '600.00', '8', 1638892800, 'Tue Dec 07 2021 18:00:00 GMT+0200' ]
console.log(deadlineCost("eng", "other", 20000, "2021-12-13 21:50")); // [ '2880.00', '61', 1640185200, 'Wed Dec 22 2021 17:00:00 GMT+0200' ]