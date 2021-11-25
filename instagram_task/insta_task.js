const _ = require("lodash");  
const fs = require("fs");
const path = require('path');
files = fs.readdirSync(__dirname);

let unique = new Set();

function uniqueValues() {
  files.forEach(file => {
    if (path.extname(file) == ".txt"){
      const array = fs.readFileSync(file).toString().split("\n");
      for(i in array) {
        unique.add(array[i]);
      };
    };
  });
  return `Уникальных словосочетаний: ${unique.size}`
};

function uniqueOne() {
  let uniq = [];
  files.forEach(file => {
    if (path.extname(file) == ".txt"){
      const array = fs.readFileSync(file).toString().split("\n");
      for(i in array) {
        uniq.push(array[i]);
      };
    };
  });
  let count = _.countBy(uniq);
  let result = [];
  for (i in count) {
    if (count[i] == 1) result.push(count[i]);
  };
  return `Уникальных словосочетаний, которые встречаются только один раз и только в одном файле: ${result.length}`
};

let existAll = new Array();

function existInAllFiles() {
  files.forEach(file => {
    if (path.extname(file) == ".txt"){
      const array = fs.readFileSync(file).toString().split("\n");
      existAll.push(array)
    };
  });
  let common = _.intersection.apply(_, existAll);
  return `Словосочетаний, которые есть во всех 20 файлах: ${common.length}`
};

let existTen = new Set();

function existInTen() {
  let existTenCount = [];
  for (i in existAll){
    let count = _.countBy(existAll[i]);
    existTenCount.push(count);
  };
  unique.forEach(function(value) {
    n = 0;
    for (el in existTenCount) {
      if (value in existTenCount[el]) {
        n += 1;
      };
      if (n == 10) {
        existTen.add(value);
        n = 0;
      };
    };
  });
  return `Словосочетаний, которые есть, как минимум, в десяти файлах: ${existTen.size}`
};

console.log(uniqueValues());
console.log(uniqueOne())
console.log(existInAllFiles());
console.log(existInTen());

// Уникальных словосочетаний: 129240
// Уникальных словосочетаний, которые встречаются только один раз и только в одном файле: 6
// Словосочетаний, которые есть во всех 20 файлах: 441
// Словосочетаний, которые есть, как минимум, в десяти файлах: 73245
