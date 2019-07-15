import db from '../sql-service/pg-connect'
import utilities from './utilities'
import Reimbursement from '../models/Reimbursement'

export async function getReimbursementsFromUserId(userId) {
    const queryString = `select * from reimbursements where author = $1 order by datesubmitted;`
    console.log(queryString, userId);
    const result = await db.query(queryString, [parseInt(userId)])
    const reimbursements: Array<Reimbursement> = [];
    console.log(result.rows);
    for (let value of result.rows) {
        reimbursements.push(new Reimbursement())
        const currentReimbursement = reimbursements[reimbursements.length + 1]
        for (let key of Object.keys(currentReimbursement)) { currentReimbursement[key] = value[key.toLowerCase()]; }
        console.log('pushing value', currentReimbursement);
    }
    return reimbursements
}

export async function getReimbursementsFromStatus(status) {
    const queryString = `select * from reimbursements where statusid = $1 order by datesubmitted;`
    const result = await db.query(queryString, [parseInt(status)]);
    const reimbursements = [];
    for (let value of result.rows) {
        reimbursements.push(new Reimbursement())
        const currentReimbursement = reimbursements[reimbursements.length + 1]
        for (let key of Object.keys(currentReimbursement)) { currentReimbursement[key] = value[key.toLowerCase()]; }
        console.log('pushing value', currentReimbursement);
    }
    return reimbursements
}

export async function addReimbursement(userId, body) {
    // reimbursements come with RID = 0 and will be assigned RID by postgresql table automatically
    delete body['reimbursementId'];
    // assign any valid fields to object literal, to be converted to SQL query
    const newReimbursement = utilities.sanitizeReimbursement(body, true);
    const nKeys = Object.keys(newReimbursement).length;
    console.log(nKeys, Object.keys(newReimbursement));
    const formatString = utilities.moneyString(1,nKeys+1);
    let updateString = `Insert into reimbursements (${Object.keys(newReimbursement).join(', ')}) 
                        values (${formatString}) returning *;`;
    console.log(updateString, Object.values(newReimbursement));
    // send update query, passing in valid field/value pairs as argument array
    const results = await db.query(updateString, Object.values(newReimbursement));
    const result = results.rows[0];
    const addedReimbursement = new Reimbursement();
    for (let key of Object.keys(addedReimbursement)) { addedReimbursement[key] = result[key.toLowerCase()]; }
    return addedReimbursement
}


export async function updateReimbursement(body) {
    const newReimbursement = utilities.sanitizeReimbursement(body);
    const nKeys = Object.keys(newReimbursement).length;
    console.log(nKeys, Object.keys(newReimbursement));
    const formatString = utilities.moneyString(1,nKeys+1);
    let updateString = `update reimbursements set (${Object.keys(newReimbursement).join(', ')}) 
                        = (${formatString}) where reimbursementid = $${nKeys+1} returning *;`;
    console.log(updateString, Object.values(newReimbursement));
    // send update query, passing in valid field/value pairs as argument array
    const queryParams = [...Object.values(newReimbursement), body['reimbursementId']];
    const results = await db.query(updateString, queryParams);
    const result = results.rows[0];
    const updatedReimbursement = new Reimbursement();
    for (let key of Object.keys(updatedReimbursement)) { updatedReimbursement[key] = result[key.toLowerCase()]; }
    return updatedReimbursement
}