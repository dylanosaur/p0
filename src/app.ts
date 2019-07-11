import express from "express";
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import usersRouter from './routers/users-router'
import loginRouter from './routers/login-router'
import reimbursementsRouter from './routers/reimbursements-router'

const app = express();

//Enable express to use body-parser and cookie-parser as middle-ware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json())

// define socket port channel for app/server communication and start listening
const port = 3000
app.listen(port, () => console.log(`ERS app listening on port ${port}!`))

app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/reimbursements', reimbursementsRouter)


// todo
// use delete property where posssible instead of stripping reimbursementID
// make db calls more explicit ("be explicit, not implicit" -Zen of Python)
// re make db so that model field keys and db field keys are 1 to 1
// test change
// stretch to do
// hash passwords and compare hashes
// add QC on inputs
// move pool to top level so that 1 pool is created and used throughout a session
//  
