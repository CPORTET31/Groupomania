/*Gestion de jwt*/

//import
let jwt = require('jsonwebtoken')

const TOKEN = process.env.SECRET_KEY;

module.exports = {
  tokenSign : TOKEN,
  generateToken: function (user) {
    return jwt.sign({
      userId: user.id,
      isAdmin: user.isAdmin
    },
      this.tokenSign,
      {
        expiresIn: '1h'
      })
  },
  getUserId: function (data) {
    if (data.length > 1) {
      let token = data.split(' ')[1];
      try {
        let decodedToken = jwt.verify(token, this.tokenSign)
        userId = decodedToken.userId
        return userId
      }
      catch (err) {
        return err
      }
    };
  }
}