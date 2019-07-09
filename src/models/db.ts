import User from './User'
import Role from './Role'
let adminUser: User = new User(0, 'DAdams', 'password', 'Dylan', 'Adams', 'dadams10642@outlook.com', new Role(0, 'admin'))
let financeManagerUser: User = new User(1, 'DKoenig', 'moneymoney', 'Dylan', 'Koenig', 'bigDK@gmail.com', new Role(1, 'finance-manager'))
let firstEmployee: User = new User(2, 'BAdams', 'perfume', 'Becca', 'Adams',  'becca.boo@aol.com', new Role(2, 'employee'))
let users: Array<User> = [adminUser, financeManagerUser, firstEmployee];

export default users;