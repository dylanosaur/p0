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
    const isFinanceManager = await utilities.trueIfFinanceManger(userCookie);
    const isCurrentUser = (userCookie.userId === parseInt(req.params['userId']));
    console.log(userCookie, req.params )
    console.log('', isFinanceManager, isCurrentUser)
    if (!(isFinanceManager || isCurrentUser)) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    // similiar filter operation to matchUserAndPassword but with userId
    console.log('using userId', userCookie.userId, req.params['userId']);
    let refunds = await reimbursementService.getReimbursementsFromUserId(req.params['userId'])
    if (refunds.length > 0) { res.status(200).send(refunds); }
    else { res.sendStatus(500); }
})

// find reimbursements by statusId
refundRouter.get('/status/:statusId', async (req, res) => {
    let userCookie = req.cookies['identity']; // name of cookie with user details
    const isFinanceManager = await utilities.trueIfFinanceManger(userCookie);
    if (!isFinanceManager) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    // similiar filter operation to matchUserAndPassword but with userId
    let refunds = await reimbursementService.getReimbursementsFromStatus(req.params['statusId'])
    res.send(refunds)
})


refundRouter.post('/', async (req, res) => {
    let userCookie = req.cookies['identity'];
    if (req.body['reimbursementId'] !== 0) {
        res.status(201).send('Incorrect reimbursementId, please set to 0');
        return;
    }
    let reimbursement = await reimbursementService.addReimbursement(userCookie.userId, req.body);
    res.send(reimbursement); //users submit reimb requests here
})


refundRouter.patch('/', async (req, res) => {
    let userCookie = req.cookies['identity']; // name of cookie with user details
    if (!(utilities.trueIfFinanceManger(userCookie))) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    let reimbursement = await reimbursementService.updateReimbursement(req.body);
    if (reimbursement) { res.send(reimbursement) }
    else { res.send('That reimbursementId does not match any in the database') }
})

export default refundRouter