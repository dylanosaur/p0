import express from "express";
import bodyParser from "body-parser";
import usersRouter from './routers/users-router'
import loginRouter from './routers/login-router'
import reimbursementsRouter from './routers/reimbursements-router'
import db from './sql-service/pg-connect'
import cors from 'cors'
var cookieSession = require('cookie-session')

const app = express();
app.use(cookieSession({
    name: 'session',
    keys: ['identity']
    //resave: false,
    //secret: 'my-secret',
}));

//Enable express to use body-parser and cookie-parser as middle-ware
app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
    origin: 'http://ers-front-end.s3.us-east-2.amazonaws.com/index.html',
    //origin: ['http://localhost:3000', 'https://ers-front-end.s3.us-east-2.amazonaws.com:3000/'],
    credentials: true,

}))

// define socket port channel for app/server communication and start listening
const port = 3000;
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

// stretch to do
//  
