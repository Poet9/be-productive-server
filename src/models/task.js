const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
   title: {
      type: String,
      trim: true,
      required: true
   },
   percentage: {
      type: Number,
      max: 100,
      min: 0,
      default: 0
   },
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   },
   field: {
      type: String,
      required: true,
      enum: ['todo', 'inprogress', 'urgent', 'done']
   }
}, {
   timeStamp: true
});


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;