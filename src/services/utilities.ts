import Reimbursement from '../models/Reimbursement'
import db from '../sql-service/pg-connect'
import User from '../models/User';

// check username: password combination against lookup table
let authenticateUser = async function(req) {
    console.log('authenticating user', req.body); // DEBUG
    // look for matches in db
    let queryString = `select * from users where username = $1 and password = $2;`;
    console.log(queryString);
    const matchedUser = await db.query(queryString, [req.body.username, req.body.password]);
    const user = new User();
    const userInfo = matchedUser.rows[0];
    if (userInfo) {
        for (let key of Object.keys(user)) { user[key] = userInfo[key.toLowerCase()]}
        console.log('found users:', user); // DEBUG
    }
    return user;
}


// useful for checking credentials
// these two functions could be combined, but will decrease readability
let trueIfFinanceManger = async function(userCookie) {
    const queryString = `select (roleid) from users where username = $1 and password = $2;`
    console.log(queryString);
    const username = userCookie && userCookie.username;
    const password = userCookie && userCookie.password;
    const result = await db.query(queryString, [userCookie.username, userCookie.password]);
    const userRole = result.rows[0] && result.rows[0].roleid;
    console.log('userRole is found to be:', userRole, typeof(userRole) );
    return (userRole===2)
}

let trueIfAdmin = async function(userCookie){
    const queryString = `select (roleid) from users where username = $1 and password = $2;`
    console.log(queryString);
    const username = userCookie && userCookie.username;
    const password = userCookie && userCookie.password;
    const result = await db.query(queryString, [userCookie.username, userCookie.password]);
    const userRole = result.rows[0] && result.rows[0].roleid;
    console.log('userRole is found to be:', userRole, typeof(userRole) );
    return (userRole===1)
}

const sanitizeObject = function(obj, removeId=false, myType='Reimbursement') { 
    let newObj;
    switch (myType) {
        case 'Reimbursement': newObj = new Reimbursement(); break;
        case 'User': newObj = new User(); break;
    }
    console.log(Object.keys(newObj), Object.keys(obj));
    // remove fields that are not lowercase/samecase versions of valid fields on reimbursement objects
    for (let key of Object.keys(newObj)) {
        if (Object.keys(obj).includes(key)) { 
            if (removeId && key==='reimbursementId') {continue;}
            newObj[key] = obj[key];
        }
        if (!newObj[key]) { delete newObj[key]; }
    }
    return newObj
}

const keysToLowerCase = function(myObj){
    const newObj = {}
    for (let key of Object.keys(myObj)) { newObj[key.toLowerCase()] = myObj[key] }
    return newObj
}

export default {authenticateUser, trueIfAdmin, trueIfFinanceManger, sanitizeObject, keysToLowerCase}