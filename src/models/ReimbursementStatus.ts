
export default class ReimbursementStatus{
    statusId: Number;
    status: String;
    constructor(statusId, status) {
        this.statusId = statusId; // primary key
        this.status = status // not null, unique
    }
}