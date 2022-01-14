function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
};

function dotComb (str) {
    let result = [str];
    result.push(str.split("").join("."));
    let all_comb = 2 ** (str.length - 1);
    let comb = all_comb - 2 - (str.length - 1);
    for (let i=1; i < str.length; i++) {
        let new_v = insert(str, i, ".");
        if (new_v[-1] != "."){
            result.push(new_v);
        };
    };
    for (let k=0; k < comb; k++) {
        for (let i=1; i < str.length-1; i++) {
            for (let item of result.slice(1)) {
                if (item[i] != "." && item[i-1] != "."){
                    new_w = insert(item, i, ".");
                    if (!result.includes(new_w)) {
                        result.push(new_w);
                    }
                }

            }

        }
    };
    return result;
};

console.log(dotComb("abcd"));