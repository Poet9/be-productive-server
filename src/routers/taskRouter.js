const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = express.Router({strict: true});

/**** creating a task */
router.post('/tasks', auth, async (req, res)=>{
   const newTask = new Task({...req.body, owner: req.user._id});
   try {
      await newTask.save();
      res.header("Access-Control-Allow-Origin", "*");
      res.status(201).send(newTask);
   } catch(e){
      res.status(400).send({error: e});
   }
});
// getting a task
router.get('/tasks', auth, async (req, res)=>{
   try {
         const tasks = await Task.find({owner: req.user._id},{},{
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip)
         });
         res.header("Access-Control-Allow-Origin", "*");
         return res.status(200).send(tasks);
   } catch(e){
      res.status(500).send({error: e});  
   }
});
/****** updating a task *******/
router.patch('/tasks/:id', auth, async (req, res)=>{
   const allowedUpdate = ['field', 'percentage'];
   const updates = Object.keys(req.body);
   isValid = updates.every( update => allowedUpdate.includes(update));
   if(!isValid){
      return res.status(403).send({error: 'Unvaild update.'});
   }
   try {
      const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
      if(!task){
         return res.status(404).send({error: 'Task not found.'});
      }
      updates.forEach(update=>{
         if(req.body[update] !== task[update]){
            task[update] = req.body[update];
         }
      });
      await task.save();
      res.header("Access-Control-Allow-Origin", "*");
      res.send(task);
   } catch(e) {
      res.status(500).send({error: e});
   }
});
/**** deleting a task ****/
router.delete('/tasks/:id', auth, async (req, res)=>{
   try {
      const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
      if(!task){
         return res.status(404).send({error: 'Task not found.'});
      }
      await task.remove();
      res.header("Access-Control-Allow-Origin", "*");
      res.send('Task deleted');
   } catch(e) {
      res.status(500).send({error: e});
   }
});

module.exports = router;