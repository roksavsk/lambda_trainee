import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 250,
    iterations: 250,
};

const params = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const user1 = {
    'name': 'locate-r4frv018-UAmade',
    'password': 'yixcnjn6',
    'search': 'enter',
    'store': 'Converse',
};

const user2 = {
    'name': 'mental-s53ummdl-Funko-Pop',
    'password': '01c0werq',
    'search': 'current',
    'store': 'Cropp',
};

const user3 = {
    'name': 'equator-ozl4tdvc-UAmade',
    'password': 'g71anr8w',
    'search': 'sugar',
    'store': 'Cropp',
};

const user4 = {
    'name': 'telephone-r2ahptpp-New-Yorker',
    'password': '82mr9bkx',
    'search': 'pitch',
    'store': 'Converse',
};

const user5 = {
    'name': 'coach-408t3g4o-Converse',
    'password': 't42m73q3',
    'search': 'life',
    'store': 'Cropp',
};

const arr = [user1, user2, user3, user4, user5];

const num = Math.floor(Math.random() * 5);

export default function () {
    const data = arr[num];
    console.log(data);
    let res = http.post('https://ns82guto0c.execute-api.us-east-1.amazonaws.com/dev/store', JSON.stringify(data), params);
    check(res, { 'success login': (r) => r.status === 200 });
    sleep(1);
}