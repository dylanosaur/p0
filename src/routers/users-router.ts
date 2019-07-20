import express, { Request, Response } from 'express';
import utilities from '../services/utilities';
import * as usersService from '../services/users-service';
import User from '../models/User'

const usersRouter = express.Router();

// allow (only) finance manager to view current users and information 
usersRouter.get('/', async (req, res) => {
    // pull cookie data with .session['cookie name']
    let userCookie = req.session['identity']; // name of cookie with user details
    if (!userCookie) { 
        res.status(400).send({error: 'invalid cookie'+process.env.POSTGRES_URL});
        return;
    }
    if (await utilities.trueIfFinanceManger(userCookie)) { 
        let users:Array<User> = await usersService.getAllUsers();
        res.send(users); 
    } else { res.send("Invalid Credentials... you're not big DK!"); }
})

// the information in the URL /stuff/:id gets stored in req.params['id']
// this is routing and will try to match any request id to a database id
usersRouter.get('/:id', async (req, res) => {
    const userCookie = req.session['identity']; // name of cookie with user details
    if (!userCookie) { 
        res.status(400).send({error: 'invalid cookie'});
        return;
    }
    const userId = parseInt(req.params['id']);
    if (!userId) { 
        res.status(400).send({error: `invalid id given: ${userId}`});
        return;
    }
    if (!(await utilities.trueIfFinanceManger(userCookie) || userCookie.userId === userId)) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return;
    }
    let matchedUser: User = await usersService.matchUserWithUserId(userId);
    delete matchedUser.password;
    res.send(matchedUser)
})

// update sql database and return updated user information
usersRouter.patch('/', async (req, res) => {
    console.log('request session:', req.session['identity']);
    if (!await utilities.trueIfAdmin(req.session['identity'])) {
        res.send('Invalid credentials, this incident will be reported');
        return;
    }
    const userId = parseInt(req.body['userId']);
    if (!userId) { 
        res.status(400).send({error: `invalid userId given: ${userId}`});
        return;
    }
    try { 
        let updatedUser: User = await usersService.updateUser(userId, req.body);
        delete updatedUser.password
        res.send(updatedUser);
    } catch (error) { 
        res.status(400).send('database failed to update with error: '+error);
    }
})

export default usersRouter;