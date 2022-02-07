const data = require('./schedule.json');
const fs = require('fs');

let newData = [];

function optimization(data) {
    let weekends = {};
    let ids = {};
    for (let i = 0; i < data.length; i++) {
        let name = data[i].user.name;
        let id = data[i].user._id;
        if (!weekends[name]) {
            weekends[name] = [];
            ids[name] = id;
        }
        weekends[name].push({"startDate": data[i].startDate, "endDate": data[i].endDate});
    }
    for (let name in weekends) {
        newData.push({"userId": ids[name], "name": name, "weekendsDates": weekends[name]});
    }
}

optimization(data);

console.log(newData);

const fileData = JSON.stringify(newData);

fs.writeFile('new_schedule.json', fileData, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});