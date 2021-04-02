const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = mongoose.Schema({
   username: {
      type: String,
      required: true,
      trim: true
   },
   email: {
      type: String,
      required: true,
      trim: true,
      lowerCase: true,
      unique: true,
      validate(value){
         const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
         if(!value.match(pattern)){
            throw new Error('Unvalid email address');
         }
      }
   },
   password : {
      type: String,
      required: true,
      validate(value){
         if(value.length <7){
            throw new Error('Password too short.');
         }
      }
   },
   tokens: [{
      token: {
         type: String,
         required: true
      },
      address: {
         type: String,
         required: true
      }
   }]
}, {
   timeStamps: true
});

/***** static methods *****/
userSchema.statics.findByCredentials= async (email, password)=>{
   const user = await User.findOne({email});
   if(!user){
      throw new Error('Unvalid email or password.');
   }
   const decoded = jwt.verify(password, process.env.CLIENT_KEY);
   const isMatch = await bcrypt.compare(decoded.password, user.password);
   if(!isMatch){
      throw new Error('Unvalid email or password.');
   }
   return user;
}
/****** virtuals ****/
userSchema.virtual('tasks', {
   ref: 'Task',
   localField: '_id',
   foreignField: 'owner'
});
/***** user instance methods *****/
userSchema.methods.generateWebToken = async function(address){
   const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECKEY);
   this.tokens = this.tokens.concat({token, address});
   await this.save();
   return token;
}
/****** delete secret stuff from user object *****/
userSchema.methods.toJSON = function(){
   const userObject = this.toObject();
   delete userObject.tokens;
   delete userObject.password;
   return userObject;
};
/***** execute before saving the user ******/
userSchema.pre('save', async function(next){
   if(this.isModified('password')){
      const decoded = jwt.verify(this.password, process.env.CLIENT_KEY);
      this.password = await bcrypt.hash(decoded.password, 8);
   }
   next();
});
/******* populate tasks and delete em when user gets deleted *****/
userSchema.pre('remove', async function(next){
   await Task.deleteMany({owner: this._id});
   next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;