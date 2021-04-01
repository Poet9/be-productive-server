const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next)=>{
   try {
      const token = req.cookies.Authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECKEY);
      const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
      if(!user){
         throw new Error();
      }
      const index = user.tokens.findIndex(storedtoken => token === storedtoken.token);
      //const matched = req.connection?.remoteAddress=== user.tokens[index].address;
      if(!matched){
         throw new Error()
      }
      req.user = user;
      req.token = token;
      next();

   } catch (e){
   res.status(400).send({error: 'Please login.'});
}
}

module.exports = auth;

