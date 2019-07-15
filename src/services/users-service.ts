import User from '../models/User'
import utilities from './utilities'
import db from '../sql-service/pg-connect'

export async function matchUserWithUserId(userId): Promise<User> {
    const queryString = `select * from users where userid = $1`;
    const userResults = await db.query(queryString, [userId]);
    const userData = userResults.rows[0];
    const matchedUser = new User();
    // read in all of the properties on a single user to User typed objected
    for (let key of Object.keys(matchedUser)) { matchedUser[key] = userData[key.toLowerCase()]; }
    return matchedUser
}

export async function updateUser(userId, body): Promise<User> {
    const nullUser = new User();
    const updateUser = {}
    // loop over keys in User object for possible update-able keys
    for (let key of Object.keys(body)) {
        // if one of those keys is present in the body of the request, read it into updateUser
        // this is sanitization / QC on the information present in the request body
        if (Object.keys(nullUser).includes(key)) { 
            updateUser[key] = body[key]; 
        }
    }
    const nKeys = Object.keys(updateUser).length;
    console.log('updateUser inputs', nKeys, Object.keys(updateUser), userId);
    const formatString = utilities.moneyString(1,nKeys+1);
    const updateString = `update users set (${Object.keys(updateUser).join(', ')}) 
                        = (${formatString}) where userid = $${nKeys+1} returning *;`;
    console.log(updateString)
    const userResults = await db.query(updateString, [...Object.values(updateUser), userId]);
    const userData = userResults.rows[0];
    const updatedUser = new User();
    // read in all of the properties on a single user to User typed objected
    for (let key of Object.keys(updatedUser)) { updatedUser[key] = userData[key.toLowerCase()]; }
    return updatedUser
}

export async function getAllUsers(): Promise<Array<User>> {
    const queryString = `select * from users`;
    const usersResults = await db.query(queryString);
    const usersData = usersResults.rows;
    // read data into users object, user by user
    const users = [];
    for (let user of usersData){
        users.push(new User());
        let currentUser = users[users.length-1]
        // read in all of the properties on a single user to User typed objected
        delete currentUser.password;
        for (let key of Object.keys(currentUser)) { currentUser[key] = user[key.toLowerCase()]; }
    }
    return users;
}

