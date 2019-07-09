// class declarations - TODO: refactor to module and import for readability

class Role {
    roleId; // primary key
    role; // not null, unique
    constructor(roleId: number, role: string) {
        this.roleId = roleId;
        this.role = role;
    }
}

export default Role;