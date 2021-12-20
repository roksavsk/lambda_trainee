from flask import Flask, jsonify, request
import csv

app = Flask(__name__)


@app.route("/")
def main():
    return "Welcome to Geolocation!"


@app.route("/get_my_ip", methods=["GET"])
def get_my_ip():
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    return jsonify({'ip': ip}), 200


@app.route("/get_my_location", methods=["GET"])
def detect_location():
    if request.headers.getlist("X-Forwarded-For"):
        ip_add = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip_add = request.remote_addr
    if request.is_json:
        ip_add = request.json["ip"]
    a = [int(x) for x in ip_add.split(".")]
    ip = (a[0] * (256 ** 3)) + (a[1] * (256 ** 2)) + (a[2] * (256 ** 1)) + (a[3] * (256 ** 0))
    with open("IP2LOCATION-LITE-DB1.csv", 'r') as file:
        csvreader = csv.reader(file)
        for row in csvreader:
            if int(row[0]) < int(ip) < int(row[1]):
                start = '.'.join([str(int(row[0]) >> (i << 3) & 0xFF) for i in range(4)[::-1]])
                end = '.'.join([str(int(row[1]) >> (i << 3) & 0xFF) for i in range(4)[::-1]])
                return jsonify(
                    ip_address=ip_add,
                    location=row[2],
                    country=row[3],
                    ip_range_start=start,
                    ip_range_end=end
                )


if __name__ == '__main__':
    app.run(host="localhost", debug=True)
