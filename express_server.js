const express = require('express');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


const generateRandomString = function() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const keyCheck = (email, userDatabase) => {
  for (let userKey in userDatabase) {
    let user = userDatabase[userKey];
    if (user.email === email) {
      return user;
    }
  }
  return false;
};
const passCheck = (user, password) => {
    if (bcrypt.compareSync(password, user.password)) {
      return true;
  }
  return false;
};

const idCheck = (id, userDatabase) => {
  for (let userKey in userDatabase) {
    let user = userDatabase[userKey];
    if (user.id === id) {
      return user;
    }
  }
  return false;
};

const URLCheck = (userID) => {
  let newObj = {};
  for (let shortURL in urlDatabase) {
    if (userID === urlDatabase[shortURL]['userID']) {
      newObj[shortURL] = urlDatabase[shortURL]['longURL']; 
    }
  }
  return newObj;
};



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
}

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
  const id = req.cookies['user_id'];
  const user = idCheck(id, users);
  if (!user) {
    res.status(403).json({message: "Please login or register!"})
  }
  const userURL = URLCheck(req.cookies['user_id'])
  const user_id = users[req.cookies['user_id']];
  // const shortURL = req.params.shortURL;
  const templateVars = { urls: userURL, user: user_id  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const id = req.cookies['user_id'];
  const user = idCheck(id, users);
  if (!user) {
    res.redirect('/login');
  } else {
  const user_id = users[req.cookies['user_id']];
  const templateVars = { user: user_id };
  res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies['user_id'];
  const user = idCheck(id, users);
  if (!user) {
    res.status(403).json({message: "Please login or register!"})
  }
  const user_id = users[req.cookies['user_id']];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]['longURL'];
  const templateVars = { shortURL, longURL: longURL, user: users[user_id] };
  
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const user_id = users[req.cookies['user_id']];
  const templateVars = { user: users[user_id] };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const user_id = users[req.cookies['user_id']];
  const templateVars = { user: users[user_id] };
  res.render("login", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});


app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies['user_id'] };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userURL = URLCheck(req.cookies['user_id'])
  if (!userURL) {
    res.status(403).json({message: "Does not have access"})
  }
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// Edit URLs
app.post("/urls/:id", (req, res) => {
  const userURL = URLCheck(req.cookies['user_id'])
  if (!userURL) {
    res.status(403).json({message: "Does not have access"})
  }
  const shortURL = req.params.id;
  // extract long url from form
  const longURL = req.body.longURL;
  // update long url in urlDatabase
  urlDatabase[shortURL] = {longURL: req.body.longURL , userID: req.cookie['user_id']};
  res.redirect("/urls/");
});

app.post("/login", (req, res) => {  
  const email = req.body.username;
  const password = req.body.password;
  const user = keyCheck(email, users)
  const userPass = passCheck(user, password)
  console.log('user', user)
  console.log('userPass', userPass)
  if(user){
    if(userPass){
    res.cookie('user_id', user.id);
    res.redirect("/urls")
    }
  }  
  res.status(403).json({message: "incorrect username/password!"})
});

app.post("/logout", (req, res) => {
  // const email = req.body.username;
  // console.log("req.body", req.body);
  // const user = keyCheck(email, users)
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = keyCheck(email, users)
  if (!email || !hashedPassword) {
    res.status(400).json({message: 'Bad Request no username/password provided'})
  } 
  else if (user){
    res.status(400).json({message: 'Bad Request email already exists'})
   return;
  } 
  else {
    let userID = generateRandomString();
    users[userID] = {
      id: userID, 
      email, 
      password: hashedPassword,
    };
    res.cookie('user_id', userID);
    res.redirect('/urls');
  };
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

