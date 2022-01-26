const express = require('express');
const app = express();
const port = 5000;

const mongo = require('mongodb').MongoClient;
let db;
let connectionString = 'mongodb://127.0.0.1:27017';

const jwt = require('jsonwebtoken');
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];
const getRandom = () => {
  return Math.floor(Math.random() * (60 - 30) + 30);
}

const bodyParser = require('body-parser');
app.use(bodyParser.json());

mongo.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    db = client.db('db_name');
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
})

app.get('/', (req, res) => {
  res.send('Welcome')
})

app.post("/sign_up", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
    const oldUser = await db.collection('users').findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const user = await db.collection('users').insertOne({
      first_name,
      last_name,
      email,
      password,
    });

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await db.collection('users').findOne({ email });
    if (user && password === user.password) {
      
      const token = jwt.sign({ user_id: user._id, email }, tokenKey, {expiresIn: getRandom()});
      const refreshToken = jwt.sign({ user_id: user._id, email }, refreshTokenSecret);
      refreshTokens.push(refreshToken);

      user.token = token;
      user.refreshToken = refreshToken;
      
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, tokenKey, (err, user) => {
          if (err) {
            return res.sendStatus(401);
          }
          req.user = user;
          next();
      });
  } else {
    res.sendStatus(401);
  }
};

app.post("/refresh", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }
  jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const accessToken = jwt.sign({ user_id: user._id, email: user.email }, tokenKey, { expiresIn: '1d'});
      res.json({
        accessToken
      });
  });
});

app.get("/me:num", verifyToken, (req, res) => {
  try {
    const user = req.user;
    res.json({
      "request_num": req.params["num"],
      "data": {
        "email": user.email
      }
  });
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});