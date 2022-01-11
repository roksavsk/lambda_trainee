import requests
from requests.adapters import HTTPAdapter

links = ["https://jsonbase.com/lambdajson_type1/793",
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

tru = 0
fals = 0


def find_key(dictionary):
    if "isDone" in dictionary:
        return dictionary["isDone"]
    else:
        for key in dictionary.items():
            for k in key:
                if "isDone" in k:
                    return k["isDone"]


def download_site(url, session):
    global tru, fals
    try:
        with session.get(url) as response:
            response.raise_for_status()
            res_data = response.json()
            if find_key(res_data):
                tru += 1
            elif find_key(res_data) is False:
                fals += 1
            print(f"Reading isDone - {find_key(res_data)} from {url}")
    except Exception as e:
        print(e)


def download_all_sites(all_sites):
    with requests.Session() as session:
        adapter = HTTPAdapter(max_retries=3)
        session.mount('http://', adapter)
        for site in all_sites:
            download_site(site, session)


if __name__ == "__main__":
    download_all_sites(links)
    print(f"Значений True: {tru},\n"
          f"Значений False: {fals}")
