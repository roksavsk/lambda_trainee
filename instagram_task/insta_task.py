import glob
import time
import collections


unique = set()


def uniqueValues():
    for filename in glob.glob("*.txt"):
        content = open(filename).read().splitlines()
        for line in content:
            unique.add(line)
    return f"Уникальных словосочетаний: {len(unique)}"


def unique_one_time():
    uniq = list()
    for filename in glob.glob("*.txt"):
        content = open(filename).read().splitlines()
        for line in content:
            uniq.append(line)
    count = collections.Counter(uniq)
    result = [i[0] for i in count.items() if i[1] == 1]
    return f"Уникальных словосочетаний, которые встречаются только один раз и только в одном файле: {len(result)}"


exist = list()


def existInAllFiles():
    for filename in glob.glob("*.txt"):
        content = open(filename).read().splitlines()
        exist.append(content)
    result = len(set.intersection(*[set(lst) for lst in exist]))
    return f"Словосочетаний, которые есть во всех 20 файлах: {result}"


exist_ten = set()


def existInAtLeastTen():
    dict_exist = list()
    for el in exist:
        count = collections.Counter(el)
        d = dict()
        d.update(count)
        dict_exist.append(d)
    for line in unique:
        n = 0
        for el in dict_exist:
            if line in el:
                n += 1
            if n == 10:
                exist_ten.add(line)
                n = 0
    return f"Словосочетаний, которые есть, как минимум в десяти файлах: {len(exist_ten)}"


start = time.time()
print(uniqueValues())
print(unique_one_time())
print(existInAllFiles())
print(existInAtLeastTen())
end = time.time() - start
print(f"Process time in {round(end)} seconds")

# Output
# Уникальных словосочетаний: 129240
# Один раз в одном файле: 6
# Словосочетаний, которые есть во всех 20 файлах: 441
# Словосочетаний, которые есть, как минимум, в десяти файлах: 73245
# Process time in 2 seconds
