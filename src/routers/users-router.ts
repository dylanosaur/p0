import express, { Request, Response } from 'express';
import utilities from '../services/utilities';
import * as usersService from '../services/users-service';


const usersRouter = express.Router();

// allow (only) finance manager to view current users and information 
usersRouter.get('/', async (req, res) => {
    // pull cookie data with .cookies['cookie name']
    let userCookie = req.cookies['identity']; // name of cookie with user details
    if (await utilities.trueIfFinanceManger(userCookie)) { 
        let users = await usersService.getAllUsers();
        res.send(users); 
    } else { res.send("Invalid Credentials... you're not big DK!"); }
})

// the information in the URL /stuff/:id gets stored in req.params['id']
// this is routing and will try to match any request id to a database id
usersRouter.get('/:id', async (req, res) => {
    const userCookie = req.cookies['identity']; // name of cookie with user details
    const userId = parseInt(req.params['id']);
    if (!(await utilities.trueIfFinanceManger(userCookie) || userCookie.userId === userId)) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return;
    }
    let matchedUser = await usersService.matchUserWithUserId(userId);
    res.send(matchedUser)
})

// update sql database and return updated user information
usersRouter.patch('/', async (req, res) => {
    if (!await utilities.trueIfAdmin(req.cookies['identity'])) {
        res.send('Invalid credentials, this incident will be reported');
        return;
    }
    let matchedUser = await usersService.matchUserWithUserId(req.body['userId']);
    let updatedUser = await usersService.updateUser(matchedUser, req.body);
    res.send(updatedUser);
})


export default usersRouter;