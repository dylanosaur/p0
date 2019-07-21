import express from "express";
import bodyParser from "body-parser";
import usersRouter from './routers/users-router'
import loginRouter from './routers/login-router'
import reimbursementsRouter from './routers/reimbursements-router'
import db from './sql-service/pg-connect'
import session from 'express-session'

const app = express();
app.use(session({
    resave: false,
    secret: 'my-secret',
}));

//Enable express to use body-parser and cookie-parser as middle-ware
app.use(bodyParser.json());
app.use(express.json());

// allow connections from any port
/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    next();
  });
*/
app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', String(req.headers.origin));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 

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
