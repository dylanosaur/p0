import User from 'models/User'
import users from '../models/db'
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

export default {authenticateUser, trueIfAdmin, trueIfFinanceManger}
