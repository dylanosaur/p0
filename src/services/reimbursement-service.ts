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
        const currentReimbursement = reimbursements[reimbursements.length - 1]
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
        const currentReimbursement = reimbursements[reimbursements.length - 1]
        for (let key of Object.keys(currentReimbursement)) { currentReimbursement[key] = value[key.toLowerCase()]; }
        console.log('pushing value', currentReimbursement);
    }
    return reimbursements
}

export async function updateReimbursement(body) {
    // reimbursements come with RID = 0 and will be assigned RID by postgresql table automatically
    const reimbursementId = parseInt(body['reimbursementId'])
    const currentReimbursementResults = await db.query('select * from reimbursements where reimbursementid =$1', [reimbursementId])
    const currentReimbursement = currentReimbursementResults.rows[0];
    // assign any valid fields to object literal, to be converted to SQL query
    const updates = utilities.sanitizeReimbursement(body);
    const newReimbursement = {...currentReimbursement, ...utilities.keysToLowerCase(updates)}
    delete newReimbursement.dateresolved;
    let updateString = `update reimbursements set
                        (reimbursementid, author, amount, datesubmitted,
                        dateresolved, description, resolver, statusid, typeid) = 
                        ($1, $2, $3, $4, ${Date.now()}, $5, $6, $7, $8) where reimbursementid = $1
                        returning *;`
    console.log(updateString, Object.values(newReimbursement));
    // send update query, passing in valid field/value pairs as argument array
    const results = await db.query(updateString, Object.values(newReimbursement));
    const result = results.rows[0];
    const addedReimbursement = new Reimbursement();
    for (let key of Object.keys(addedReimbursement)) { addedReimbursement[key] = result[key.toLowerCase()]; }
    return addedReimbursement
}

export async function addReimbursement(body) {
    // reimbursements come with RID = 0 and will be assigned RID by postgresql table automatically
    // assign any valid fields to object literal, to be converted to SQL query
    const newRMBT = utilities.sanitizeReimbursement(body, true);
    let updateString = `Insert into reimbursements 
                        (author, amount, datesubmitted, dateresolved, 
                        description, resolver, statusid, typeid) values 
                        ($1, $2, ${Date.now()}, null, 
                        $3, null, 1, $4) returning *;`
    console.log(updateString, [newRMBT.author, newRMBT.amount, newRMBT.description, newRMBT.typeId]);
    // send update query, passing in valid field/value pairs as argument array
    const results = await db.query(updateString, [newRMBT.author, newRMBT.amount, newRMBT.description, newRMBT.typeId]);
    const result = results.rows[0];
    const addedReimbursement = new Reimbursement();
    for (let key of Object.keys(addedReimbursement)) { addedReimbursement[key] = result[key.toLowerCase()]; }
    return addedReimbursement
}