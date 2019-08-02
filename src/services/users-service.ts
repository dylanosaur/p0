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
    // loop over keys in User object for possible update-able keys
    const currentUser = await db.query('select * from users where userid = $1', [userId]);
    if (body['password']) { body['password'] = sha256(body['password']) }
    const updates = utilities.sanitizeObject(body, false, 'User')
    console.log(currentUser.rows[0], utilities.keysToLowerCase(updates))
    const updatedUserSQL = {...currentUser.rows[0], ...utilities.keysToLowerCase(updates) }
    delete updatedUserSQL.userid;
    const updateString = `update users set 
                        (username, password, firstName, 
                        lastName, email, roleId) =
                        ($1, $2, $3, $4, $5, $6) where userid = $7 returning *`
    const userResults = await db.query(updateString, [...Object.values(updatedUserSQL), userId]);
    const userData = userResults.rows[0];
    // read in all of the properties on a single user to User typed objected
    const updatedUser = new User;
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

