import http from 'k6/http';
import { check, sleep } from 'k6';

const randomWords = require('random-words');

const arr = ['UAmade', 'Converse', 'Cropp', 'New-Yorker', 'Funko-Pop', 'wasted'];

const num = Math.floor(Math.random() * 6);
const pass = () => { return Math.random().toString(36).slice(-8); };

const user = () => {
    return {
        name: randomWords() + '-' + pass() + '-' + arr[num],
        password: pass(),
        search: randomWords(),
        store: arr[num],
    }; 
};

export const options = {
    vus: 700,
    iterations: 700,
};

const params = {
    headers: {
        'Content-Type': 'application/json',
    },
};

export default function () {
    const data = user();
    console.log(data);
    let res = http.post('https://ns82guto0c.execute-api.us-east-1.amazonaws.com/dev/store', JSON.stringify(data), params);
    check(res, { 'success login': (r) => r.status === 200 });
    sleep(1);
}