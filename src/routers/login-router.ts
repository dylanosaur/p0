import express from 'express';
import utilities from '../services/utilities';
import hash from 'hash'
const loginRouter = express.Router()
const {sha256} = require('crypto-hash');
// when setting cookie information on a response .coookie(cookie info) must be called before .json(body info)
loginRouter.post('/', async (req, res) => {

    // immediately hash password, all references to password will be the hashed version
    if (!(req.body['password'] && req.body['username'])){ 
        res.status(400).send({error: `username and/or password not found in request`})
        return;
    }
    req.body['password'] = await sha256(req.body['password']);
    let match = await utilities.authenticateUser(req);
    if (match) {
        // create cookie for user identification
        let userCookie = {"userId": match.userid, "username": match.username, "password": match.password};
        console.log('setting cookie to', userCookie);
        // set response cookie as def above and response body to user information
        res.cookie('identity', userCookie);
        const result = await utilities.authenticateUser(req)
        res.json(result);
        // response ready to send
        res.send();
    }
    else {
        // something went wrong, and it's probably that the user information was invalid
        res.status(400).send({error: `Invalid Credentials with attempts`})}
    return;
})

export default loginRouter;