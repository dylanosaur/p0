import express from "express";
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import usersRouter from './routers/users-router'
import loginRouter from './routers/login-router'
import reimbursementsRouter from './routers/reimbursements-router'
import db from './sql-service/pg-connect'

const app = express();

//Enable express to use body-parser and cookie-parser as middle-ware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

// define socket port channel for app/server communication and start listening
const port = 3005;
const port_handler = app.listen(port, () => console.log(`ERS app listening on port ${port}!`));

app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/reimbursements', reimbursementsRouter)

// Close the pool when app shuts down
process.on('SIGINT', () => {
    db.end().then(() => console.log('pool has ended'));
    port_handler.close();
});

// todo
// test all the way through at least once more

// test change
// stretch to do
// hash passwords and compare hashes
// add QC on inputs
//  
