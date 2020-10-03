const { express_server } = require('./express_server.js');


const getUserByEmail = (email, database) => {
  // return "userRandomID";
  for (let value in database) {
    if (database[value].email === email) {
      return database[value].id;
    }
  }
  return undefined;
};

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
const URLCheck = (userID) => {
  let newObj = {};
  for (let shortURL in urlDatabase) {
    if (userID === urlDatabase[shortURL]['userID']) {
      newObj[shortURL] = urlDatabase[shortURL]['long URL'];
    }
  }
  return newObj;
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


exports.getUserByEmail = getUserByEmail;
module.exports = generateRandomString;
module.exports = keyCheck;
module.exports = passCheck;
module.exports = URLCheck;
module.exports = idCheck;