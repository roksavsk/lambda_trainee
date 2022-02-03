const fetch = require("node-fetch");

const links = ["https://jsonbase.com/lambdajson_type1/793",
         "https://jsonbase.com/lambdajson_type1/955",
         "https://jsonbase.com/lambdajson_type1/231",
         "https://jsonbase.com/lambdajson_type1/94",
         "https://jsonbase.com/lambdajson_type1/931",
         "https://jsonbase.com/lambdajson_type1/93",
         "https://jsonbase.com/lambdajson_type2/342",
         "https://jsonbase.com/lambdajson_type2/770",
         "https://jsonbase.com/lambdajson_type2/491",
         "https://jsonbase.com/lambdajson_type2/281",
         "https://jsonbase.com/lambdajson_type2/718",
         "https://jsonbase.com/lambdajson_type3/310",
         "https://jsonbase.com/lambdajson_type3/806",
         "https://jsonbase.com/lambdajson_type3/469",
         "https://jsonbase.com/lambdajson_type3/258",
         "https://jsonbase.com/lambdajson_type3/516",
         "https://jsonbase.com/lambdajson_type4/79",
         "https://jsonbase.com/lambdajson_type4/706",
         "https://jsonbase.com/lambdajson_type4/521",
         "https://jsonbase.com/lambdajson_type4/350",
         "https://jsonbase.com/lambdajson_type4/64",
]

function findKey(dict) {
    if ("isDone" in dict) {
        return dict["isDone"];
    } else {
        for (let value of Object.values(dict)) {
            if (typeof(value) == "object" && "isDone" in value) {
                return value["isDone"];
            }
        }
    }
}

let tru = 0;
let fals = 0;
let retries = 0;

async function getOne(url) {
    try {
        let response = await fetch(url);
        let json = await response.json();
        if (findKey(json)) { tru++ } else { fals++ };
        console.log(`${url}: isDone - ${findKey(json)}`);
    } catch (error) {
        if (retries < 3) {
            retries++;
            console.log('Retrying', retries, error.message);
            getOne(url);
        } else {
            console.log(error);
        }
    }
}

async function getAll() {
    for (let url of links){
        await getOne(url);
    };
    console.log(`Значений True: ${tru},\nЗначений False: ${fals}`);
}

getAll();
