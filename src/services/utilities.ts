import User from 'models/User'
import * as qDB from '../sql-service/queryDB'

// check username: password combination against lookup table
let authenticateUser = async function(req) {
    let usn: string = req.body.username;
    let pass: string = req.body.password;
    console.log('authenticating user', req.body); // DEBUG
    // return true if usn and password match the pair values from DB
    let matchUserAndPassword = (user) => (usn===user.username && pass===user.password)
    // compare the given username/password with the user in the DB (if it exists) 
    let queryString = `select * from users where username = '${usn}';`
    console.log(queryString);
    let matchedUser = await qDB.queryDB(queryString);
    console.log('found users:', matchedUser[0]) // DEBUG
    return matchedUser[0]
}


// useful for checking credentials
// these two functions could be combined, but will decrease readability
let trueIfFinanceManger = async function(userCookie) {
    let queryString = `select * from users where role = 2;`
    console.log(queryString);
    let fm = await qDB.queryDB(queryString);
    console.log('found finance-manager', fm[0]);
    return (userCookie.userId == fm[0].userId && userCookie.password == fm[0].password) 
}

let trueIfAdmin = async function(userCookie){
    let queryString = `select * from users where role = 1;`
    console.log(queryString);
    let admin = await qDB.queryDB(queryString);
    console.log('found admin: ', admin[0]);
    return (userCookie.userId == admin[0].userId && userCookie.password == admin[0].password)
}


const keyValueSQL = function(object) {
    // return a string formatted like: key1 = value1, key2 = 'string2', ..., keyFinal = valueFinal
    // strings will have quotes around them, numbers will be bare
    let keysValuesString = ''
    for (let key of Object.keys(object)) {
        switch(typeof object[key]) {
            case 'string': keysValuesString += ` ${key} = '${object[key]}', `; break;
            case 'number': keysValuesString += ` ${key} = ${object[key]}, `; break;
        }
    }
    keysValuesString = keysValuesString.substring(0, keysValuesString.lastIndexOf(',')) //remove the final comma
    return keysValuesString 
}

const csvKeys = function(object) {
    // return a string formatted like: key1, key2, key3, ..., keyN
    const keyList = Object.keys(object)
    let keysString = ''
    for (let key of keyList) {
        keysString += `${key}, `
    }
    keysString = keysString.substring(0, keysString.lastIndexOf(',')) //remove the final comma
    return keysString 
}

const csvValues = function(object) {
    // return a string formatted like: key1 = value1, key2 = 'string2', ..., keyFinal = valueFinal
    // strings will have quotes around them, numbers will be bare
    let valuesString = ''
    const keyList = Object.keys(object)
    for (let key of keyList) {
        switch(typeof object[key]) {
            case 'number': valuesString += `${object[key]}, `; break;
            case 'string': valuesString += `'${object[key]}',  `; break;
        }
    }
    valuesString = valuesString.substring(0, valuesString.lastIndexOf(',')) //remove the final comma
    return valuesString 
}

const removeRID = function(object) { 
    let newReimbursement = {}
    for (let key of Object.keys(object)) {
        // reimbursementId is always set to 0 in body, and will be assigned automatically
        if (key == 'reimbursementId') {continue} 
        newReimbursement[key] = object[key] 
    }
    return newReimbursement 
}

export default {authenticateUser, trueIfAdmin, trueIfFinanceManger, keyValueSQL, csvKeys, csvValues, removeRID }
