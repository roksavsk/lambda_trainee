import pymongo
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, create_refresh_token
from pymongo import MongoClient
import datetime
import random


client = MongoClient("mongodb://localhost:27017/")

db = client["app_database"]

user = db["User"]

app = Flask(__name__)
jwt = JWTManager(app)


app.config["JWT_SECRET_KEY"] = "this-is-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = datetime.timedelta(days=30)


@app.route("/sign_up", methods=["POST"])
def register():
    request_form = request.get_json()
    email = request_form["email"]
    test = user.find_one({"email": email})
    if test:
        return jsonify(message="User already exist"), 409
    else:
        first_name = request_form["first_name"]
        last_name = request_form["last_name"]
        password = request_form["password"]
        user_info = dict(first_name=first_name, last_name=last_name, email=email, password=password)
        user.insert_one(user_info)
        return jsonify(message="User added successfully"), 201


@app.route("/login", methods=["POST"])
def login():
    if request.is_json:
        email = request.json["email"]
        password = request.json["password"]
    else:
        email = request.form["email"]
        password = request.form["password"]

    test = user.find_one({"email": email, "password": password})
    if test:
        access_token = create_access_token(identity=email, fresh=datetime.timedelta(seconds=random.randint(30, 60)))
        refresh_token = create_refresh_token(identity=email)
        return jsonify(message="Login Succeeded!", access_token=access_token, refresh_token=refresh_token), 201
    else:
        return jsonify(message="Bad Email or Password"), 401


@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity, fresh=datetime.timedelta(seconds=random.randint(30, 60)))
    return jsonify(access_token=access_token)


@app.route("/me<int:num>", methods=["GET"])
@jwt_required(fresh=True)
def user_data(num):
    current_user = get_jwt_identity()
    return {
        "request_num": num,
        "data": {
            "username": current_user
        }
    }


if __name__ == '__main__':
    app.run(host="localhost", debug=True)
