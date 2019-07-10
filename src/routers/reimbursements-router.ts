import express, { Request, Response } from 'express';
import utilities from '../services/utilities';
import User from '../models/User'
import db from '../models/db'


let users = db.users;
let refunds = db.refunds;
let financeManagerUser = users[1];
let adminUser = users[0];
import * as reimbursementService from '../services/reimbursement-service'

const refundRouter = express.Router();

// find reimbursements by user
refundRouter.get('/author/userId:userId', async (req, res) => { 
    let userCookie = req.cookies['identity']; // name of cookie with user details
    if (!(utilities.trueIfFinanceManger(userCookie) || userCookie.userId === req.params['id'])) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    // similiar filter operation to matchUserAndPassword but with userId
    refunds = await reimbursementService.getReimbursementsFromUserId(req.params['userId'])
    console.log(refunds);
    res.send(refunds)
}) 

// find reimbursements by statusId
refundRouter.get('/status/:statusId', (req, res) => {
    let userCookie = req.cookies['identity']; // name of cookie with user details
    if (!(utilities.trueIfFinanceManger(userCookie))) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    // similiar filter operation to matchUserAndPassword but with userId
    refunds = reimbursementService.getReimbursementsFromStatus(req.params['statusId'])
    res.send(refunds)
})


refundRouter.post('/', (req, res) => {
    let userCookie = req.cookies['identity'];
    if (req.body['reimbursementId'] !== 0) { 
        res.status(201).send('Incorrect reimbursementId, please set to 0');
        return;
    }
    let reimbursement = reimbursementService.addReimbursement(userCookie.userId, req.body);
    res.send(reimbursement); //users submit reimb requests here
})


refundRouter.patch('/', (req, res) => {
    let userCookie = req.cookies['identity']; // name of cookie with user details
    if (!(utilities.trueIfFinanceManger(userCookie))) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    let reimbursement = reimbursementService.updateReimbursement(req.body);
    if (reimbursement) {res.send(reimbursement)}
    else {res.send('That reimbursementId does not match any in the database')}
})

export default refundRouter