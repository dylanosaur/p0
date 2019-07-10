
import db from '../models/db'
import Reimbursement from '../models/Reimbursement';
let refunds = db.refunds;
import * as qDB from '../sql-service/queryDB'

export function getReimbursementsFromUserId(userId) {
    let queryString = `select * from reimbursements where author = ${parseInt(userId)};`
    //let queryString = `select * from reimbursements;`
    console.log(queryString);
    let result = qDB.queryDB(queryString)
    return result
}

export function getReimbursementsFromStatus(status) {
    let queryString = `select * from reimbursements where status = ${parseInt(status)};`
    let result = qDB.queryDB(queryString)
    //let matchRefundsWithStatus = (refund) => (refund.status=== parseInt(status) )
    //let matchedRefunds: Array<Reimbursement> = refunds.filter(matchRefundsWithStatus);
    return result
}

export function addReimbursement(userId, body): Reimbursement {
    let newRId: Number = refunds.length + 1
    // should probably onlyl require certain fields and should check for those fields
    let newReimbursement = new Reimbursement(1, userId, 0, String(Date()), '', '', 1, 0, 4);
    for (let key of Object.keys(body)) { 
        newReimbursement[key] = body[key]
    }
    newReimbursement['reimbursementId'] = newRId;
    db.refunds.push(newReimbursement);
    return newReimbursement
}

export function updateReimbursement(body): Reimbursement|null {
    let matchRefundsWithRefundId = (refund) => (refund.reimbursementId=== parseInt(body['reimbursementId']));
    let matchedRefund: Reimbursement = refunds.filter(matchRefundsWithRefundId)[0];
    if (!(matchedRefund)) return null
    for (let key of Object.keys(body)) { 
        matchedRefund[key] = body[key]
    }
    return matchedRefund
}