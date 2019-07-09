import User from '../models/User'
import db from '../models/db'
let users = db.users;

// similiar filter operation to matchUserAndPassword but with userId
export function matchUserWithUserId(userId): User {
    let matchUserWithId = (user) => (userId === String(user.userId))
    let matchedUser: User = users.filter(matchUserWithId)[0];
    return matchedUser
}

export function updateUser(user, body): User {
    for (let key of Object.keys(body)) { 
        user[key] = body[key]
    }
    return user
}

export function getAllUsers(): Array<User> {
    return users;
}

