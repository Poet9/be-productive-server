const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router({strict: true});

/**creating new user  **/
router.post('/users', async (req, res)=>{
   const newUser = new User(req.body);
   try {
      await newUser.save();
      const token = await newUser.generateWebToken(req.connection?.localAddress);
      const fakeToken= `eyqlk57REl8Tqeruqerg.gvfgnbGogibntiognwdfh.PgdjfoinRbdfiubrvdfvoqaknonlkplcv`;
      res.cookie("__noMeaning", fakeToken, { sameSite: "none", secure: true});
      res.cookie('Authorization', token, {sameSite: "none", httpOnly: true, secure: true});
      res.status(201).send({newUser});
   } catch (e) {
      res.status(400).send({error: e});
   }
});
//login to user
router.post('/users/login', async (req, res)=>{
   try {
      const myEmail =  req.body.email.toString().toLowerCase();
      const user = await User.findByCredentials(myEmail, req.body.password);
      const token = await newUser.generateWebToken(req.connection?.localAddress);
      const fakeToken= `eyqlk57REl8Tqeruqerg.vdfvoqabGogibntiognwdfh.PgdjfoinRbdfgvfNqUbrknonlkplcv`;
      res.cookie("__noMeaning", fakeToken, { sameSite: "none", secure: true});
      res.cookie("Authorization", token, {httpOnly: true, sameSite: "none", secure: true});
      res.send({user});
   } catch (e) {
      res.status(400).send({error: e});
   }
});
/****** get user ******/
router.get('/users/me', auth, async (req, res) =>{
   try {
      res.send(req.user);
   } catch (e) {
      res.status(500).send(e);
   }
});
// updating my user
router.patch('/users/me', auth, async (req, res)=>{
   const allowedUpdates = ['username', 'password', 'email'];
   const updates = Object.keys(req.body);
   const isValid = updates.every(value => allowedUpdates.includes(value))
   if(!isValid){
      return res.status(401).send({Error: 'Unauthorized update.'});
   }   
   try {
      updates.forEach(update=>{
         if(req.user[update]=== req.body[update]){
            return res.status(403).send({error: `Please provide a new value for ${update}`});
         }
         req.user[update] = req.body[update];
      });
      await req.user.save();
      res.send(req.user);
   } catch (e) {
      res.status(500).send({error: e});
   }
});
/****** login out *******/
router.post('/users/logout', auth, async(req, res)=>{
   try {
      req.user.tokens = req.user.tokens.filter(token => token.token !==req.token);
      await req.user.save();
      res.clearCookie("__noMeaning", {sameSite: "none", secure: true});
      res.clearCookie("Authorization", {sameSite: "none", secure: true});
      res.send({res: 'logged out successfully.'});
   } catch (e) {
      res.status(500).send({error: e});
   }
});
// loging out from all sessions
router.post('/users/logoutAll', auth, async (req, res)=>{
   try {
      req.user.tokens = [];
      await req.user.save();
      res.clearCookie("__noMeaning", {sameSite: "none", secure: true});
      res.clearCookie("Authorization", {sameSite: "none", secure: true});
      res.send({res: 'logged out successfully.'});
   } catch (e) {
      res.status(500).send({error: e});
   }
});
// delete my user
router.delete('/users/me', auth, async (req, res)=>{
   try {
      await req.user.remove();
      res.clearCookie("__noMeaning", {sameSite: "none", secure: true});
      res.clearCookie("Authorization", {sameSite: "none", secure: true});
      res.send({res: 'user deleted successfully.'})
   } catch (e) {
      res.status(500).send({error: e});
   }
});

module.exports = router;