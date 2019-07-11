import User from 'models/User'
import db from '../models/db'
let users = db.users
let financeManagerUser = users[1];
let adminUser = users[0];

// check username: password combination against lookup table
let authenticateUser = function(req) {
    let usn: string = req.body.username;
    let pass: string = req.body.password;
    console.log('authenticating user', req.body); // DEBUG
    // return true if usn and password match the pair values from DB
    let matchUserAndPassword = (user) => (usn===user.username && pass===user.password)
    // filter array for elements that make function true - i.e. the user with matching usn/pass (only 0 or 1 match possible)
    let matchedUser: User = users.filter(matchUserAndPassword)[0]
    console.log('found users:', matchedUser) // DEBUG
    return matchedUser
}


// useful for checking credentials
// these two functions could be combined, but will decrease readability
let trueIfFinanceManger = function(userCookie): boolean {
    let fm = financeManagerUser; // quick alias for readability
    return (userCookie.userId == fm.userId && userCookie.password == fm.password) 
}
let trueIfAdmin = function(userCookie): boolean {
    return (userCookie.userId == adminUser.userId && userCookie.password == adminUser.password)
}


const keyValueSQL = function(object, includeKeys=true, includeValues=true) {
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
    // return a string formatted like: key1 = value1, key2 = 'string2', ..., keyFinal = valueFinal
    // strings will have quotes around them, numbers will be bare
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
