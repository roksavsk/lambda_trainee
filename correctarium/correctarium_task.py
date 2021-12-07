import calendar
import datetime
import pandas as pd
from dateutil import parser

allowed_format = [None, "doc", "docx", "rtf"]


def cost_calculation(language, file_extension, chr_count):
    chr_price = 0
    minimal_cost = 0
    if language == "ukr" or "rus":
        chr_price = 0.05
        minimal_cost = 50
    if language == "eng":
        chr_price = 0.12
        minimal_cost = 120
    price = chr_price * chr_count
    if file_extension not in allowed_format:
        price += price * 0.2
    if price < minimal_cost:
        return minimal_cost
    return round(price, 2)


def deadline(language, file_extension, chr_count, order_time=datetime.datetime.now()):
    lead_time = 0
    chr_per_hour = 0
    time_minimum = 1
    if type(order_time) == str:
        order_time = parser.parse(order_time)
    if language == "ukr" or "rus":
        chr_per_hour = 1333
    if language == "eng":
        chr_per_hour = 333
    if file_extension not in allowed_format:
        lead_time += lead_time * 0.2
    lead_time = chr_count / chr_per_hour
    time_total = 0.5 + lead_time
    if time_total < time_minimum:
        time_total = time_minimum
    print(f"Will be ready in {round(time_total)} hours")
    order_time = pd.Timestamp(order_time, tz='Europe/Kiev')
    business_hours = pd.tseries.offsets.BusinessHour(n=round(time_total), start='10:00', end='19:00', offset=datetime.timedelta(0))
    deadline_date = order_time + business_hours
    future_timetuple = deadline_date.timetuple()
    future_timestamp = calendar.timegm(future_timetuple)
    # print(future_timestamp)
    return deadline_date.strftime("%Y-%m-%d %H:%M:%S")


print(cost_calculation("eng", None, 1941))  # 232.92 (как на сайте)
print(deadline("eng", None, 1941))  # 6,33 (на сайте 11:45 - 18:30)
print(cost_calculation("rus", "doc", 1941))  # 97.05 (106,75 сайт умножает на 0.055)
print(deadline("rus", "doc", 1941))
print(deadline("rus", "doc", 1941, "2021-11-30 11:15"))  # 2 часа (как на сайте) 2021-11-30 13:15:00
print(cost_calculation("eng", "docx", 970))   # 120 b=970
print(deadline("eng", "docx", 970, "2021-12-04 18:00"))   # 3 часа (как на сайте) 2021-12-06 13:00:00
print(cost_calculation("eng", "other", 970))    # 139.68
print(deadline("eng", "other", 970, "2021-12-01 14:00"))    # Will be ready in 3 hours 2021-12-01 17:00:00
print(cost_calculation("ukr", "rtf", 1216))    # 60.8
print(deadline("ukr", "rtf", 1216, "2021-12-02 18:45"))    # 2021-12-03 10:45:00
print(deadline("rus", "doc", 2500, "2021-12-03 22:15"))     # 2021-12-06 12:00:00
print(cost_calculation("ukr", "other", 10000))  # 600.0
print(deadline("ukr", "other", 10000, "2021-12-06 23:30"))  # 2021-12-07 18:00:00
