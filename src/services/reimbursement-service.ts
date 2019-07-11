import * as qDB from '../sql-service/queryDB'
import utilities from './utilities'

export function getReimbursementsFromUserId(userId) {
    let queryString = `select * from reimbursements where author = ${parseInt(userId)};`
    console.log(queryString);
    let result = qDB.queryDB(queryString)
    return result
}

export function getReimbursementsFromStatus(status) {
    let queryString = `select * from reimbursements where status = ${parseInt(status)};`
    let result = qDB.queryDB(queryString)
    return result
}

export async function addReimbursement(userId, body) {
    // reimbursements come with RID = 0 and will be assigned RID by postgresql table automatically
    let newReimbursement = utilities.removeRID(body)
    // prepare values and keys strings for sql statement
    let valuesString = utilities.csvValues(newReimbursement)
    let keysString = utilities.csvKeys(newReimbursement)
    let updateString = `Insert into reimbursements (${keysString}) values (${valuesString});`
    console.log(updateString);
    // send update query, wait for reimbursement to be added and then query for validation
    await qDB.queryDB(updateString);
    // get the latest reimbursement
    let queryString = `select * from reimbursements ORDER BY reimbursementid DESC LIMIT 1;`
    console.log(queryString);
    // wait for db to return latest reimbursement i.e. the added reimbursement
    let result = await qDB.queryDB(queryString);
    return result
}


export async function updateReimbursement(body) {
    // do not try to update reimbursementID
    // data is new, different object with the RID field stripped
    let data = utilities.removeRID(body)
    // make string of keys and values for SQL statement - numbers and strings are acceptable as value types
    let keysValuesString = utilities.keyValueSQL(data);
    let updateString = `UPDATE reimbursements SET ${keysValuesString} 
                where reimbursementid = ${body['reimbursementId']};`
    console.log(updateString);
    // wait until DB finishes updating before querying
    await qDB.queryDB(updateString);
    // get updated reimbursement and echo back to server for validation
    let queryString = `select * from reimbursements where reimbursementid = ${body['reimbursementId']};`
    console.log(queryString);
    // wait for db to return updated reimbursement
    let result = await qDB.queryDB(queryString);
    return result
}