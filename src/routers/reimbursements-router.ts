import express, { Request, Response } from 'express';
import utilities from '../services/utilities';
import User from '../models/User'
import users from '../models/db'
let financeManagerUser = users[1];
let adminUser = users[0];

const refundRouter = express.Router();

// find reimbursements by user
refundRouter.get('/reimbursements/author/userId:userId', (req, res) => { 
    let userCookie = req.cookies['identity']; // name of cookie with user details
    if (!(utilities.trueIfFinanceManger(userCookie))) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    // similiar filter operation to matchUserAndPassword but with userId
    let matchUserWithId = (user) => (req.params['id'] === String(user.userId))
    let matchedUser: User = users.filter(matchUserWithId)[0];
    
    res.send(matchedUser)
}) 

// find reimbursements by statusId
refundRouter.get('/reimbursements/status/:statusId', (req, res) => console.log('should return all reim of a given status'))


refundRouter.post('/reimbursements', (req, res) => res.send(req.body.params) ); //users submit reimb requests here


refundRouter.patch('/reimbursements', (req, res) => console.log('upating existing reimbursement')) //finance manager app/deny reimb requests here



