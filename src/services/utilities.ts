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
    for (let key of Object.keys(user)) { user[key] = userInfo[key.toLowerCase()]}
    console.log('found users:', user); // DEBUG
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
    const userRole = result.rows[0].roleid;
    console.log('userRole is found to be:', userRole, typeof(userRole) );
    return (userRole===2)
}

let trueIfAdmin = async function(userCookie){
    let queryString = `select * from users where roleid = 1;`
    const userId = userCookie && userCookie.userId;
    const password = userCookie && userCookie.password;
    console.log(queryString);
    let admin = await db.query(queryString);
    // could add QC check here
    if (!admin.rows.length) { return false; }
    admin = admin.rows[0];
    console.log('found admin: ', admin);
    return (userId == admin.userid && password == admin.password);
}


const moneyString = function (a:number, b:number) {
    let s = [];
    for (let i=a; i < b; i++) { s.push(`$${i}`);}
    return s.join(', ');
}

const sanitizeReimbursement = function(obj, removeId=false) { 
    const nullReimbursement = new Reimbursement();
    console.log(Object.keys(nullReimbursement), Object.keys(obj));
    // ok it's not actually actually a new reimbursement but will have a subset of reimbursement fields
    const newReimbursement = {}; 
    for (let key of Object.keys(nullReimbursement)) {
        if (Object.keys(obj).includes(key)) { 
            if (removeId && key==='reimbursementId') {continue;}
            newReimbursement[key] = obj[key];
        }
    }
    return newReimbursement
}

export default {authenticateUser, trueIfAdmin, trueIfFinanceManger, moneyString, sanitizeReimbursement}