/**
 *   reimbursementId:
 *   author: String; 
 *   amount: Number; 
 *   dateSubmitted: String; 
 *   dateResolved: String;
 *   description: String;
 *   resolver: Number; // foreign key -> User
 *   status: Number; // foreign ey -> ReimbursementStatus, not null
 *   type: Number // foreign key -> ReimbursementType
 * 
 * 
 */

export default class Reimbursement{
    reimbursementId: Number;
    author: Number; // userId number
    amount: Number;
    dateSubmitted: String;
    dateResolved: String;
    description: String;
    resolver: String;
    statusId: Number;
    typeId: Number;   
    constructor(reimbursementId=undefined, author=undefined, amount=undefined, 
        dateSubmitted=undefined, dateResolved=undefined, description=undefined, 
        resolver=undefined, statusId=undefined, typeId=undefined) {
    this.reimbursementId = reimbursementId; // primary key
    this.author = author; // foreign key -> User, not null
    this.amount = amount; // not null
    this.dateSubmitted = dateSubmitted; // not null
    this.dateResolved = dateResolved;
    this.description = description; // not null
    this.resolver = resolver; // foreign key -> User
    this.statusId = statusId; // foreign ey -> ReimbursementStatus, not null
    this.typeId = typeId; // foreign key -> ReimbursementType
    }
}