const express = require('express');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

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
    return false;
  }
};



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  const user_id = users[req.cookies['user_id']];
  const templateVars = { urls: urlDatabase, user: user_id };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user_id = users[req.cookies['user_id']];
  const templateVars = { user: user_id };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = users[req.cookies['user_id']];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
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
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// Edit URLs
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  // extract long url from form
  const longURL = req.body.longURL;
  // update long url in urlDatabase
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls/");
});

app.post("/login", (req, res) => {  
  const email = req.body.username;
  const user = keyCheck(email, users)
  if(user){
    res.cookie('user_id', user.id);
    res.redirect("/urls")
  } else  {
    res.status(403).json({message: "user not found!"})

  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).json({message: 'Bad Request no username/password provided'})
  } else if (keyCheck(email, users)){
    res.status(400).json({message: 'Bad Request email already exists'})
  } else {
    let userID = generateRandomString();
    users[userID] = {
      id: userID, 
      email, 
      password
    };
    res.cookie('user_id', userID);
  };
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

