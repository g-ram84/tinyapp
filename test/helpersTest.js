const { assert } = require('chai');
const  helpers  = require('../helpers.js');

// console.log(getUserByEmail.getUserByEmail("user@example.com", "abc.com"))
const testUsers = {
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
describe('getUserByEmail', function() {
  it('should return a user with a valid email', function() {
    const user = helpers.getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput, "emails match!");
  });
  it('should return undefined if email doesn\'t exist', function() {
    const user = helpers.getUserByEmail("dgsdga@g.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput, "undefined");
  });
});