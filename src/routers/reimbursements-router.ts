
// just a skeleton below, not implemented
app.get('/reimbursements/author/userId:userId', (req, res) => res.send('stuff')) 
app.get('/reimbursements/status/:statusId', (req, res) => console.log('should return all reim of a given status'))
app.post('/reimbursements', (req, res) => res.send(req.body.params) ); //users submit reimb requests here
app.patch('/reimbursements', (req, res) => console.log('upating existing reimbursement')) //finance manager app/deny reimb requests here



