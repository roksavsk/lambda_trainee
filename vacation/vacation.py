import json

with open('schedule.json', 'r') as file:
    data = json.load(file)


def one():
    for i in range(len(data)):
        if "usedDays" in data[i]:
            del data[i]["usedDays"]
        if "status" in data[i]:
            del data[i]["status"]
        if "_id" in data[i]:
            del data[i]["_id"]
        if "user" in data[i]:
            data[i]["user_id"] = data[i]["user"]["_id"]
            data[i]["user_name"] = data[i]["user"]["name"]
            del data[i]["user"]
        if "startDate" in data[i]:
            data[i]["weekend_dates"] = []
            data[i]["weekend_dates"].append(dict(startDate=data[i]["startDate"], endDate=data[i]["endDate"]))
            del data[i]["startDate"]
            del data[i]["endDate"]


one()
new_data = list(data)


def two():
    for i in range(len(data)):
        for k in range(i+1, len(data)):
            if data[i]["user_name"] == data[k]["user_name"] and data[k] in new_data:
                data[i]["weekend_dates"].append(dict(startDate=data[k]['weekend_dates'][0]["startDate"], endDate=data[k]['weekend_dates'][0]["endDate"]))
                new_data.remove(data[k])


two()

for i in range(len(new_data)):
    print(new_data[i])

with open('new_schedule.json', 'w') as write_file:
    json.dump(new_data, write_file)


