const mongoose = require('mongoose');
try{
   mongoose.connect(process.env.MONGODB_URL, {  
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
   },
      ()=>console.log("mongoose is connected"));
} catch (e){
   console.log("Connection failed");
}