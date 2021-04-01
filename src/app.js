const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

const app = express();
app.use(cors({
   credentials: true,
   origin: "http://localhost:3000/"
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users/", userRouter);
app.use("/api/tasks/", taskRouter);

module.exports = app;



