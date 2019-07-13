import Role from './Role'

class User {
    userId; // primary key
    username;  // not null, unique
    password; // not null
    firstName; // not null
    lastName;  // not null
    email; // not null
    role;  // not null
    constructor(userId: number=null, username: string=null, password: string=null, firstName: string=null, 
                lastName:string=null, email: string=null, role: Role=null) {
        this.userId = userId; // primary key
        this.username = username;  // not null, unique
        this.password = password; // not null
        this.firstName = firstName; // not null
        this.lastName = lastName;  // not null
        this.email = email; // not null
        this.role = role;  // not null
    }
}

export default User;
