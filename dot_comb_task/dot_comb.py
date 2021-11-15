word = str(input(f'Input string: '))


def dot_comb(wrd):
    lst = wrd.split()
    lst.append(".".join(wrd))
    all_comb = 2 ** (len(wrd) - 1)
    comb = all_comb - 2 - (len(wrd) - 1)
    for i in range(1, len(wrd)):
        new_w = wrd[:i] + "." + wrd[i:]
        if new_w[-1] != ".":
            lst.append(new_w)
    for comb in range(comb):
        for i in range(1, len(wrd) - 1):
            for el in lst[1:]:
                if el[i] != "." and el[i-1] != ".":
                    new_w = el[:i] + "." + el[i:]
                    if new_w not in lst:
                        lst.append(new_w)
    return lst


print(dot_comb(word))
