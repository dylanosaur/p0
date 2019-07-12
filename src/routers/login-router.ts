import express from 'express';
import utilities from '../services/utilities';

const loginRouter = express.Router()
// when setting cookie information on a response .coookie(cookie info) must be called before .json(body info)
loginRouter.post('/', async (req, res) => {
    let match = await utilities.authenticateUser(req)
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
})

export default loginRouter;