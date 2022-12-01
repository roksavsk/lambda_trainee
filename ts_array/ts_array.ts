type T = any;

interface Array<T> {
    /**
     * Multiply ever element of array on provided number. If not provided - every element of array will be multiplied on 10.
     * 
     * @param factor - optional parameter which will be used for multiplying. 
     */
    multiply(factor?: number): number[];
    /**
     * Returns true if all elements match the given predicate.
     * 
     * @param predicate - reqired parameter.
     */
    all(predicate: T): boolean;
    /**
     * Returns true if at least one element matches the given predicate.
     * 
     * @param predicate - reqired parameter.
     */
    any(predicate: T): boolean;
    /**
     * Returns a Map containing the elements from the given sequence indexed by the key returned from keySelector function applied to each element.
     * 
     * @param marker - keySelector function applied to each element.
     */
    associateBy(marker: (item: T) => any): Map<string, object[]>;
    /**
     * Returns an average value of elements in the sequence.
     */
    average(): number;
    /**
     * Splits this sequence into a sequence of lists each not exceeding the given size. 
     * The last list in the resulting sequence may have fewer elements than the given size.
     * 
     * @param size - the number of elements to take in each list, must be positive and can be greater than the number of elements in this sequence.
     */
    chunked(size: number): T[];
    /**
     * Returns a sequence containing only elements from the given sequence having distinct keys returned by the given selector function.
     * Among elements of the given sequence with equal keys, only the first one will be present in the resulting sequence. The elements in the resulting sequence are in the same order as they were in the source sequence.
     * 
     * @param propertyExpression - required selector function.
     */
    distinctBy(propertyExpression?: (item: T) => any): T[];
    /**
     * Returns a sequence containing only elements matching the given predicate.
     * 
     * @param predicate - required parameter.
     */
    filterCustom(predicate: (item: T) => any): T[];
    /**
     * Returns a sequence containing only elements that don't match the given predicate.
     * 
     * @param predicate - required parameter.
     */
    filterNot(predicate: (item: T) => any): T[];
    /**
     * Returns a sequence containing only elements matching the given predicate.
     * 
     * @param predicate - function that takes the index of an element and the element itself and returns the result of predicate evaluation on the element.
     */
    filterIndexed(predicate: (index: number, element: T) => boolean): T[];
    /**
     * Returns the first element matching the given predicate, or null if no such element was found.
     * 
     * @param predicate - reqired parameter.
     */
    findCustom(predicate: (item: T) => any): T | null;
    /**
     * Returns the last element matching the given predicate, or null if no such element was found.
     * 
     * @param predicate - required parameter.
     */
    findLast(predicate: (item: T) => any): T | null;
    /**
     * Returns a sequence of all elements from all sequences in this sequence.
     */
    flatten(): T[];
    /**
     * Accumulates value starting with initial value and applying operation from left to right to current accumulator value and each element. 
     * Returns the specified initial value if the sequence is empty.
     * 
     * @param operation - function that takes current accumulator value and an element, and calculates the next accumulator value.
     * @param initial - starting value. 
     */
    fold(operation: (arg1: T, arg2: T) => any, initial: any): T;
    /**
     * Returns the first element yielding the largest value of the given function.
     * 
     * @param predicate - required selector.
     */
    maxBy(predicate: any): T;
    /**
     * Returns the first element yielding the smallest value of the given function.
     * 
     * @param predicate - required selector.
     */
    minBy(predicate: any): T;
    /**
     * Returns the number of elements in this sequence by the given selector.
     * 
     * @param predicate - required selector.
     */
    count(predicate: any): number;
    /**
     * Groups elements of the original sequence by the key returned by the given keySelector function applied to each element and returns a map where each group key is associated with a list of corresponding elements. 
     * 
     * The returned map preserves the entry iteration order of the keys produced from the original sequence.
     * 
     * @param predicate - required keySelector function.
     */
    groupBy(predicate: (item: T) => any): Map<T, Array<T>>;
    /**
     * Groups values returned by the valueTransform function applied to each element of the original sequence by the key returned by the given keySelector function applied to the element and returns a map where each group key is associated with a list of corresponding values.
     * 
     * The returned map preserves the entry iteration order of the keys produced from the original sequence.
     * 
     * @param predicate1 - reqired keySelector function;
     * @param predicate2 - required valueTransform function;
     */
    groupByValue(predicate1: (item: T) => any, predicate2: (item: T) => any): Map<T, Array<T>>;
}

Array.prototype.multiply = function (factor = 10) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(this[i] * factor);
    }
    return result;
};

Array.prototype.average = function () {
    let num = 0;
    for (let i = 0; i < this.length; i++) {
        num += this[i];
    }
    num /= this.length;
    return num;
};

Array.prototype.chunked = function (size) {
    const result: Array<T>[] = [];
    const amount = Math.ceil(this.length / size);
    for (let c = 0; c < amount; c++) {
        result.push([]);
    }
    for (let a = 0; a < amount; a++) {
        for (let i = 0; i < this.length; i++) {
            if (result[a].length === size && result[a + 1].length === 0) {
                ++a;
                result[a].push(this[i]);
            } else {
                result[a].push(this[i]);
            }
        }
    }
    return result;
};

const arrayOfNumbers = [1, 2, 3, 4, 5];
console.log(arrayOfNumbers.multiply(2)); // [2, 4, 6, 8, 10]
console.log(arrayOfNumbers.multiply()); // [10, 20, 30, 40, 50]

console.log(arrayOfNumbers.average()); // 3
console.log(arrayOfNumbers.chunked(2)); // [ [ 1, 2 ], [ 3, 4 ], [ 5 ] ]
const words = 'one two three four five six seven eight nine ten'.split(' ');
const chunks = words.chunked(3);
console.log(chunks); // [
//     [ 'one', 'two', 'three' ],
//     [ 'four', 'five', 'six' ],
//     [ 'seven', 'eight', 'nine' ],
//     [ 'ten' ]
//   ]

Array.prototype.all = function (predicate) {
    let check = false;
    for (let i = 0; i < this.length; i++) {
        if (this[i] === predicate) {
            check = true;
        } else check = false;
    }
    return check;
};

Array.prototype.any = function (predicate) {
    let check = false;
    for (let i = 0; i < this.length; i++) {
        if (this[i] === predicate) {
            check = true;
        }
    }
    return check;
};

const fruits = ['banana', 'banana', 'apple'];
console.log(fruits.all('banana'));
console.log(fruits.any('apple'));

Array.prototype.associateBy = function (marker) {
    const result = new Map<string, object[]>();
    for (let i = 0; i < this.length; i++) {
        if (!result.get(marker(this[i]))) {
            result.set(marker(this[i]), []);
        }
        const arr: T[] = result.get(marker(this[i]))!;
        arr.push(this[i]);
    }
    return result;
};

const data = [{ emoji: '😀', sad: false }, { emoji: '🥲', sad: false }];
console.log(data.associateBy((item) => item.sad ? "sad" : "happy"));
// Map(1) {
//     'happy' => [ { emoji: '😀', sad: false }, { emoji: '🥲', sad: false } ]
//   }

Array.prototype.distinctBy = function (propertyExpression: (item: any) => any) {
    let result: Array<T> = [];
    if (!propertyExpression) {
        result = [...new Set(this)];
    } else if (propertyExpression) {
        for (let i = 0; i < this.length; i++) {
            result.push(propertyExpression(this[i]));
        }
        result = [...new Set(result)];
    }
    return result;
};

const list = ['a', 'A', 'b', 'B', 'A', 'a'];
console.log(list.distinctBy()); // [a, A, b, B]
console.log(list.distinctBy((item) => item.toUpperCase())); // [A, B]

Array.prototype.filterCustom = function (predicate: (item: any) => any) {
    const result: Array<T> = [];
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i])) {
            result.push(this[i]);
        }
    }
    return result;
};

Array.prototype.filterNot = function (predicate: (item: any) => any) {
    const result: Array<T> = [];
    for (let i = 0; i < this.length; i++) {
        if (!predicate(this[i])) {
            result.push(this[i]);
        }
    }
    return result;
};

Array.prototype.filterIndexed = function (predicate) {
    const result: Array<T> = [];
    for (let i = 0; i < this.length; i++) {
        if (predicate(i, this[i])) {
            result.push(this[i]);
        }
    }
    return result;
};

const numarr = [1, 2, 3, 4, 5, 6, 7];
console.log(numarr.filterCustom((item) => item % 2 === 0)); // [2, 4, 6]
console.log(numarr.filterNot((item) => item % 3 === 0)); // [1, 2, 4, 5, 7]
const numarr2 = [0, 1, 2, 3, 4, 8, 6];
console.log(numarr2.filterIndexed((index, i) => index === i)); // [0, 1, 2, 3, 4, 6]

Array.prototype.findCustom = function (propertyExpression) {
    for (let i = 0; i < this.length; i++) {
        if (propertyExpression(this[i])) {
            return this[i];
        }
    }
    return null;
};

Array.prototype.findLast = function (propertyExpression) {
    for (let i = this.length; i > 0; i--) {
        if (propertyExpression(this[i])) {
            return this[i];
        }
    }
    return null;
};

const arrnum = [1, 2, 3, 4, 5, 6, 7];
console.log(arrnum.findCustom((item) => item % 2 != 0)); // 1
console.log(arrnum.findLast((item) => item % 2 === 0)); // 6

Array.prototype.flatten = function () {
    const result: T[] = [];
    for (let i = 0; i < this.length; i++) {
        if (this[i].length) {
            const arr = this[i].flatten();
            for (let j = 0; j < arr.length; j++) {
                result.push(arr[j]);
            }
        } else {
            result.push(this[i]);
        }
    }
    return result;
};

const flatarr = [1, 2, 3, [4, 5, [1, 2]], 6, 7];
console.log(flatarr.flatten()); // [1, 2, 3, 4, 5, 1, 2, 6, 7]

Array.prototype.fold = function (operation, initial) {
    for (let i = 0; i < this.length; i++) {
        initial = operation(initial, this[i]);
    }
    return initial;
};

console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].fold((sum, number) => sum + number, 0)); // 55
const numbers = [1, 2, 3, 4, 5];
console.log(numbers.fold((x, y) => x + y.toString(), '')); // '12345'

Array.prototype.maxBy = function (predicate) {
    let max = 0;
    let result;
    for (let i = 0; i < this.length; i++) {
        if (this[i][predicate] > max) {
            max = this[i][predicate];
            result = this[i];
        }
    }
    return result;
};

Array.prototype.minBy = function (predicate) {
    let min = this[0][predicate];
    let result;
    for (let i = 0; i < this.length; i++) {
        if (this[i][predicate] < min) {
            min = this[i][predicate];
            result = this[i];
        }
    }
    return result;
};

const arr = [{ n: 10 }, { n: 5 }, { n: 3 }, { n: 12 }];
console.log(arr.maxBy('n')); // { 'n': 12 }
console.log(arr.minBy('n')); // { 'n': 3 }

Array.prototype.count = function (predicate) {
    let result = 0;
    for (let i = 0; i < this.length; i++) {
        result += this[i][predicate];
    }
    return result;
};

const arrcount = [{ n: 10 }, { n: 5 }, { n: 3 }, { n: 12 }];
console.log(arrcount.count('n')); // 30

Array.prototype.groupBy = function (predicate) {
    const result = new Map<T, T[]>();
    for (let i = 0; i < this.length; i++) {
        if (!result.get(predicate(this[i]))) {
            result.set(predicate(this[i]), []);
        }
        const arr: T[] = result.get(predicate(this[i]))!;
        arr.push(this[i]);
    }
    return result;
}

Array.prototype.groupByValue = function (predicate, predicate2) {
    const result = new Map<T, T[]>();
    for (let i = 0; i < this.length; i++) {
        if (!result.get(predicate(this[i]))) {
            result.set(predicate(this[i]), []);
        }
        const arr: T[] = result.get(predicate(this[i]))!;
        arr.push(predicate2(this[i]));
    }
    return result;
};

const list2 = ['a', 'abc', 'ab', 'def', 'abcd'];
const grouped = list2.groupBy((item) => item.length);
console.log(grouped);
console.log(grouped.keys(), grouped.values()); // [1, 3, 2, 4] , [[a], [abc, def], [ab], [abcd]]

const list3 = [['Alice', 'Marketing'], ['Bob', 'Sales'], ['Carol', 'Marketing']];
const grouped2 = list3.groupByValue((item) => item[1], (item) => item[0]);
console.log(grouped2);
