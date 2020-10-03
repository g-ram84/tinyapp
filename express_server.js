const express = require('express');
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const getUserByEmail = require('./helpers.js');
const generateRandomString = require('./helpers.js');
const keyCheck = require('./helpers.js');
const passCheck = require('./helpers.js');
const URLCheck = require('./helpers.js');
const idCheck = require('./helpers.js');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ481W" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ481W" }
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  const user = idCheck(id, users);
  if (!user) {
    res.status(403).json({message: "Please login or register!"});
    return;
  }
  const userURL = URLCheck(req.session.user_id);
  const user_id = users[req.session.user_id];
  // const shortURL = req.params.shortURL;
  const templateVars = { urls: userURL, user: user_id  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const user = idCheck(id, users);
  if (!user) {
    res.redirect('/login');
  } else {
    const user_id = users[req.session.user_id];
    const templateVars = { user: user_id };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id;
  const user = idCheck(user_id, users);
  if (!user) {
    res.status(403).json({message: "Please login or register!"});
    return;
  }
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]['longURL'];
  const templateVars = { shortURL, longURL: longURL, user: user_id };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const user_id = users[req.session.user_id];
  const templateVars = { user: users[user_id] };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const user_id = users[req.session.user_id];
  const templateVars = { user: users[user_id] };
  res.render("login", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});


app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  urlDatabase[shortURL] = { longURL: longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  const userURL = URLCheck(userID);
  if (!userURL) {
    res.status(403).json({message: "Does not have access"});
    return;
  }
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// Edit URLs
app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const userURL = URLCheck(userID);
  if (!userURL) {
    res.status(403).json({message: "Does not have access"});
    return;
  }
  const shortURL = req.params.id;
  // update long url in urlDatabase
  urlDatabase[shortURL] = {longURL: req.body.longURL , userID};
  res.redirect("/urls/");
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (user === req.session.user_id) {
    const userPass = passCheck(user, password);
    if (userPass) {
      req.session.user_id = user.id;
      res.redirect("/urls");
    }
  } else {
    res.status(403).json({message: "incorrect username/password!"});
  }
});

app.post("/logout", (req, res) => {
  // const email = req.body.username;
  // console.log("req.body", req.body);
  // const user = keyCheck(email, users)
  req.session = null;
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = keyCheck(email, users);
  if (!email || !hashedPassword) {
    res.status(400).json({message: 'Bad Request no username/password provided'});
    return;
  } else if (user) {
    res.status(400).json({message: 'Bad Request email already exists'});
    return;
  } else {
    let userID = generateRandomString();
    users[userID] = {
      id: userID,
      email,
      password: hashedPassword,
    };
    req.session.user_id = userID;
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

