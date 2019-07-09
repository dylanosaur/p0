
import Role from './Role'
import User from './User'

// dummy table of a few users until we implement a SQL DB - including admin, finance-manage
let adminUser: User = new User(0, 'DAdams', 'password', 'Dylan', 'Adams', 'dadams10642@outlook.com', new Role(0, 'admin'))
let financeManagerUser: User = new User(1, 'DKoenig', 'moneymoney', 'Dylan', 'Koenig', 'bigDK@gmail.com', new Role(1, 'finance-manager'))
let firstEmployee: User = new User(2, 'BAdams', 'perfume', 'Becca', 'Adams',  'becca.boo@aol.com', new Role(2, 'employee'))
let users: Array<User> = [adminUser, financeManagerUser, firstEmployee];





/*
class reimbursementParent{
    constructor() {
    reimbursementId,// primary key
    author, // foreign key -> User, not null
    amount, // not null
    dateSubmitted, // not null
    dateResolved,
    description, // not null
    resolver, // foreign key -> User
    status, // foreign ey -> ReimbursementStatus, not null
    type // foreign key -> ReimbursementType
    }
}

class reimbursementStatusParent{
    constructor() {
        statusId, // primary key
        status // not null, unique
    }
}

class reimbursementTypeParent{
    constructor() {
        typeId, // primary key
        type // not null, unique
    }
}

*/

