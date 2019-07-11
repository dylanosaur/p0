
import db from '../models/db'
import Reimbursement from '../models/Reimbursement';
let refunds = db.refunds;
import * as qDB from '../sql-service/queryDB'
import utilities from './utilities'

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

export async function addReimbursement(userId, body) {
   
    let newReimbursement = utilities.removeRID(body)
    let valuesString = utilities.csvValues(newReimbursement)
    let keysString = utilities.csvKeys(newReimbursement)
    let updateString = `Insert into reimbursements (${keysString}) values (${valuesString});`
    console.log(updateString);
    await qDB.queryDB(updateString);
    // get the latest reimbursement
    let queryString = `select * from reimbursements ORDER BY reimbursementid DESC LIMIT 1;`
    console.log(queryString);
    let result = await qDB.queryDB(queryString);
    return result
}


export async function updateReimbursement(body) {
    
    let data = utilities.removeRID(body)
    let keysValuesString = utilities.keyValueSQL(data);
    let updateString = `UPDATE reimbursements SET ${keysValuesString} 
                where reimbursementid = ${body['reimbursementId']};`
    console.log(updateString);
    await qDB.queryDB(updateString);
    let queryString = `select * from reimbursements ORDER BY reimbursementid DESC LIMIT 1;`
    console.log(queryString);
    let result = await qDB.queryDB(queryString);
    return result
}