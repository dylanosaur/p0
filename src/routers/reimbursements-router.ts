import express, { Request, Response } from 'express';
import utilities from '../services/utilities';
import Reimbursement from '../models/Reimbursement'
import * as reimbursementService from '../services/reimbursement-service'

const refundRouter = express.Router();

// find reimbursements by user
refundRouter.get('/author/userId/:userId', async (req, res) => {
    let userCookie = req.session['identity']; // name of cookie with user details
    if (!userCookie) { 
        res.status(400).send({error: 'invalid cookie'});
        return;
    }
    const isFinanceManager = await utilities.trueIfFinanceManger(userCookie);
    const userId = req.params && parseInt(req.params['userId']);
    if (!userId) { 
        res.status(400).send({error: `invalid userId field given: ${req.params['userId']}`});
        return;
    }
    const isCurrentUser = (userCookie.userId === userId);
    console.log(userCookie, req.params)
    console.log('', isFinanceManager, isCurrentUser)
    if (!(isFinanceManager || isCurrentUser)) {
        res.status(400).send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    // similiar filter operation to matchUserAndPassword but with userId
    console.log('using userId', userCookie.userId, userId);
    let refunds: Array<Reimbursement> = await reimbursementService.getReimbursementsFromUserId(userId)
    if (refunds.length > 0) { res.status(200).send(refunds); }
    else { res.status(200).send({'msg':'no reimbursements found for that user'}); }
})

// find reimbursements by statusId
refundRouter.get('/status/:statusId', async (req, res) => {
    let userCookie = req.session['identity']; // name of cookie with user details
    if (!userCookie) { 
        res.status(400).send({error: 'invalid cookie'});
        return;
    }
    const statusId = req.params && parseInt(req.params['statusId']);
    if (!statusId) { 
        res.status(400).send({error: `Invalid statusId: ${statusId}`});
        return;
    }
    const isFinanceManager = await utilities.trueIfFinanceManger(userCookie);
    if (!isFinanceManager) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    // similiar filter operation to matchUserAndPassword but with userId
    let refunds: Array<Reimbursement> = await reimbursementService.getReimbursementsFromStatus(statusId)
    if (refunds.length) { res.status(200).send(refunds); }
    else { res.status(200).send('No refunds are found with that status')}
})


refundRouter.post('/', async (req, res) => {
    let userCookie = req.session['identity'];
    req.body['reimbursementId'] = parseInt(req.body['reimbursementId']);
    req.body['statusId'] = parseInt(req.body['statusId']);
    console.log(userCookie);
    if (!userCookie) { 
        res.status(400).send({error: 'invalid cookie'});
        return;
    }
    if (parseInt(req.body['reimbursementId']) !== 0) {
        res.status(400).send('Incorrect reimbursementId, please set to 0');
        return;
    }
    try {
        req.body.author = userCookie.userId;
        let reimbursement: Reimbursement = await reimbursementService.addReimbursement(req.body);
        res.status(200).send(reimbursement); //users submit reimb requests here
    } catch (error) { 
        res.status(400).send({error: 'Database request error: '+error});
    }
})


refundRouter.patch('/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    let userCookie = req.session['identity']; // name of cookie with user details
    if (!userCookie) { 
        res.status(400).send({error: 'invalid cookie'});
        return;
    }
    if (!(utilities.trueIfFinanceManger(userCookie))) {
        res.send("Invalid Credentials... you're not that user or big DK!");
        return
    }
    try { 
        let reimbursement: Reimbursement = await reimbursementService.updateReimbursement(req.body);
        if (reimbursement) { res.send(reimbursement) }
        else { res.send(`The reimbursementId ${parseInt(req.body['reimbursementId'])} does not match any in the database`) }
    } catch (error) { 
        res.status(400).send({error: 'Database request error: '+error})
    }
})

export default refundRouter