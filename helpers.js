const { express_server } = require('./express_server.js');


const getUserByEmail = (email, database) => {
  console.log("getUserByEmail"); return;
  // return "userRandomID";
  for (let value in database) {
    if (database[value].email === email) {
      return database[value].id;
    }
  }
  return undefined;
};

const generateRandomString = function() {
  console.log("generateRandomString"); return;
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  console.log('RESULT', result);
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


// module.exports.getUserByEmail = getUserByEmail;
// exports.generateRandomString = generateRandomString;
// module.exports = generateRandomString;
// module.exports = keyCheck;
// module.exports = passCheck;
// module.exports = URLCheck;
// module.exports = idCheck;

// module.exports = {
//   getUserByEmail,
//   generateRandomString,
//   keyCheck,
//   passCheck,
//   URLCheck,
//   idCheck
// }