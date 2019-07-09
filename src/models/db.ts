import User from './User'
import Role from './Role'
let adminUser: User = new User(0, 'DAdams', 'password', 'Dylan', 'Adams', 'dadams10642@outlook.com', new Role(0, 'admin'))
let financeManagerUser: User = new User(1, 'DKoenig', 'moneymoney', 'Dylan', 'Koenig', 'bigDK@gmail.com', new Role(1, 'finance-manager'))
let firstEmployee: User = new User(2, 'BAdams', 'perfume', 'Becca', 'Adams',  'becca.boo@aol.com', new Role(2, 'employee'))
let users: Array<User> = [adminUser, financeManagerUser, firstEmployee];


import Reimbursement from './Reimbursement'
import ReimbursementStatus from './ReimbursementStatus'
import ReimbursementType from './ReimbursementType'

let Status = ReimbursementStatus;
let rType = ReimbursementType;
let rStatuses = [new Status(1, 'Pending'), new Status(2, 'Approved'), new Status(3, 'Denied')]
let rTypes = [new rType(1, 'Loding'), new rType(2, 'Travel'), new rType(3, 'Food'), new rType(4, 'Other')]

let r1: Reimbursement = new Reimbursement(1, 'Becca', 300, '04-10-19', '05-01-19', 'airplane and luggage', 'DKoenig', '', 2);
let r2: Reimbursement = new Reimbursement(1, 'Dylan', 25, '04-16-19', '', 'business lunch', '', '', 1);
let r3: Reimbursement = new Reimbursement(1, 'Becca', 25, '04-15-19', '', 'business lunch', '', '', 1);
let r4: Reimbursement = new Reimbursement(1, 'Dylan', 5000, '04-12-19', '05-01-19', 'spy equipment', 'DKoenig', '', 3);

let refunds = [r1, r2, r3, r4]
let db = {users: users, refunds: refunds, rStatuses: rStatuses, rTypes: rTypes};
export default db;