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
    status: Number;
    type: Number;   
    constructor(reimbursementId, author, amount, dateSubmitted, dateResolved, description, 
                resolver, status, type) {
    this.reimbursementId = reimbursementId; // primary key
    this.author = author; // foreign key -> User, not null
    this.amount = amount; // not null
    this.dateSubmitted = dateSubmitted; // not null
    this.dateResolved = dateResolved;
    this.description = description; // not null
    this.resolver = resolver; // foreign key -> User
    this.status = status; // foreign ey -> ReimbursementStatus, not null
    this.type = type; // foreign key -> ReimbursementType
    }
}