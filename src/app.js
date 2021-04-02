const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

const app = express();
app.use(cors({
   origin: 'http://192.168.1.3:3000',
   allowedHeaders: ['content-type, Authorization, __noMeaning, Accept'],
   methods: 'POST, GET, PATCH, DELETE, OPTIONS',
   credentials: true,
   preflightContinue: false
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/users/", userRouter);
app.use("/api/tasks/", taskRouter);

module.exports = app;



