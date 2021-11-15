let result = [];

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function dotComb(str, i = 0) {
    while (i + 1 < str.length) {
        i++;
        let newWord = insert(str, i, ".");
        result.push(newWord);
        dotComb(newWord, i + 1);
    }
    let allComb = 2 ** (str.length - 1);
    if (result.length == allComb - 1) result.push(str);
    return result;
}

console.log(dotComb("abcd"))
