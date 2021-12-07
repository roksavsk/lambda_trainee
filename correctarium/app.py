from flask import Flask, request, jsonify
import calendar
import datetime
import pandas as pd
from dateutil import parser

app = Flask(__name__)


@app.route("/")
def main():
    return "Welcome to Correctarium!"


allowed_format = [None, "doc", "docx", "rtf"]


@app.route("/cost/<string:language>/<string:file_extension>/<int:chr_count>")
def cost_calculation(language, file_extension, chr_count):
    chr_price = 0
    minimal_cost = 0
    if language == "ukr" or "rus":
        chr_price = 0.05
        minimal_cost = 50
    if language == "eng":
        chr_price = 0.12
        minimal_cost = 120
    price = chr_price * int(chr_count)
    if file_extension not in allowed_format:
        price += price * 0.2
    if price < minimal_cost:
        return str(minimal_cost)
    price = str(round(price, 2))
    return {
        "language": language,
        "character_count": chr_count,
        "file_extension": file_extension,
        "price": price
    }


@app.route("/deadline/<string:language>/<string:file_extension>/<int:chr_count>/<string:order_time>")
def deadline(language, file_extension, chr_count, order_time):
    lead_time = 0
    chr_per_hour = 0
    time_minimum = 1
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
    order_time = pd.Timestamp(order_time, tz='Europe/Kiev')
    business_hours = pd.tseries.offsets.BusinessHour(n=round(time_total), start='10:00', end='19:00', offset=datetime.timedelta(0))
    deadline_date = order_time + business_hours
    future_timetuple = deadline_date.timetuple()
    future_timestamp = calendar.timegm(future_timetuple)
    return {
        "time": str(round(time_total)),
        "deadline": future_timestamp,
        "deadline_date": str(deadline_date.strftime("%Y-%m-%d %H:%M:%S"))
    }


@app.route("/deadline_cost", methods=['POST'])
def deadline_cost():
    request_data = request.get_json()
    language = request_data["language"]
    file_extension = request_data["file_extension"]
    chr_count = request_data["chr_count"]
    order_time = request_data["order_time"]
    chr_price = 0
    minimal_cost = 0
    if language == "ukr" or "rus":
        chr_price = 0.05
        minimal_cost = 50
    if language == "eng":
        chr_price = 0.12
        minimal_cost = 120
    price = chr_price * int(chr_count)
    if file_extension not in allowed_format:
        price += price * 0.2
    if price < minimal_cost:
        return str(minimal_cost)
    price = str(round(price, 2))
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
    order_time = pd.Timestamp(order_time, tz='Europe/Kiev')
    business_hours = pd.tseries.offsets.BusinessHour(n=round(time_total), start='10:00', end='19:00',
                                                     offset=datetime.timedelta(0))
    deadline_date = order_time + business_hours
    future_timetuple = deadline_date.timetuple()
    future_timestamp = calendar.timegm(future_timetuple)
    return jsonify(
        price=price,
        time=str(round(time_total)),
        deadline=future_timestamp,
        deadline_date=str(deadline_date.strftime("%Y-%m-%d %H:%M:%S"))
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
