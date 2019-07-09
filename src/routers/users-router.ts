import express, { Request, Response } from 'express';
import utilities from '../services/utilities';
import User from '../models/User'
import users from '../models/db'
let financeManagerUser = users[1];
let adminUser = users[0];

const usersRouter = express.Router();

// allow (only) finance manager to view current users and information 
usersRouter.get('/', (req, res) => {
    // pull cookie data with .cookies['cookie name']
    let userCookie = req.cookies['identity']; // name of cookie with user details
    if (utilities.trueIfFinanceManger(userCookie)) { res.send(users) }
    else { res.send("Invalid Credentials... you're not big DK!"); }
})

// the information in the URL /stuff/:id gets stored in req.params['id']
// this is routing and will try to match any request id to a database id
usersRouter.get('/:id', (req, res) => {
    let userCookie = req.cookies['identity']; // name of cookie with user details
    if (!(utilities.trueIfFinanceManger(userCookie) || userCookie.userId === req.params['id'])) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    // similiar filter operation to matchUserAndPassword but with userId
    let matchUserWithId = (user) => (req.params['id'] === String(user.userId))
    let matchedUser: User = users.filter(matchUserWithId)[0];
    res.send(matchedUser)
})

// update sql database and return updated user information
usersRouter.patch('/', (req, res) => {
    if (!utilities.trueIfAdmin(req.cookies['identity'])) {
        res.send('Invalid credentials, this incident will be reported');
        return
    }
    let matchUserWithId = (user) => (req.body['userId'] === String(user.userId))
    let matchedUser: User = users.filter(matchUserWithId)[0];
    let providedKeys: Array<string> = Object.keys(req.body);
    for (let key of providedKeys) matchedUser[key] = req.body[key];
    res.send(matchedUser);
})


export default usersRouter;