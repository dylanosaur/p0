
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

export async function addReimbursement(userId, body) {
    let newRId: Number = refunds.length + 1
    // should probably onlyl require certain fields and should check for those fields
    let newReimbursement = new Reimbursement(7, userId, 0, 0, 0, ' ', 1, 1, 4);
    let v = newReimbursement;
    let k = Object.keys(newReimbursement);
    let valuesString = ` ${v[k[0]]}, ${v[k[1]]}, ${v[k[2]]}, ${v[k[3]]}, '${v[k[4]]}', 
                        '${v[k[5]]}', ${v[k[6]]}, ${v[k[7]]}, ${v[k[8]]} `
    let updateString = `Insert into reimbursements values (${valuesString});`
    console.log(updateString);
    await qDB.queryDB(updateString);
    let queryString = `select * from reimbursements 
                WHERE reimbursementid = ${v[k[0]]};`
    console.log(queryString);
    let result = await qDB.queryDB(queryString);
    return result
}

export async function updateReimbursement(body) {
    let keysValuesString = ''
    for (let key of Object.keys(body)) { keysValuesString += ` ${key} = ${body[key]}, `}
    keysValuesString = keysValuesString.substring(0, keysValuesString.lastIndexOf(',')) //remove the final comma
    let updateString = `UPDATE reimbursements SET ${keysValuesString} 
                WHERE reimbursementid = ${parseInt(body['reimbursementId'])};`
    console.log(updateString);
    await qDB.queryDB(updateString);
    let queryString = `select * from reimbursements 
                WHERE reimbursementid = ${parseInt(body['reimbursementId'])};`
    console.log(queryString);
    let result = await qDB.queryDB(queryString);
    return result
}