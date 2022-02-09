const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
app.use(express.json())
const port = process.env.PORT || 5000

let db = sqlite3.Database('./db/mainDatabase.db', (err) => {
    if (err) return console.log(err.message)
    console.log('database created')
})

db.run('CREATE TABLE records(id INTEGER PRIMARY KEY ,username TEXT,grade INTEGER,sura INTEGER,start INTEGER, end INTEGER,date INTEGER)', (err) => {
    if (err)
        return console.log(err.message)
    console.log('records table created successfully')
})

db.run('CREATE TABLE users(username TEXT PRIMARY KEY,name TEXT,admin BOOL)', (err) => {
    if (err)
        return console.log(err.message)
    console.log('users table created successfully')
})
//called when try to register
app.post('/abualmun/register', function (req, res) {
db.run(`INSERT INTO users (username,name,admin) VALUES (${data.username},${data.name},${data.admin})`, (err)=>{
    if(err) return res.send(err)
    res.send(success)
})
})

//called when user tries to login.
//received object keys:   [username]
//returned object keys:   [name,admin bool,studentlist]
app.post('/login', (req, res) => {
    const username = req.body.username

    db.get(`SELECT * FROM users WHERE username = ${username}`, (row) => {
        if (err) console.log(err)
        if (!row) return res.status(201).send("can't find user with that username.")
        if (!row.admin) return res.send({ 'name': row.name, 'admin': 0, 'studentlist': [{ 'name': row.name, 'username': row.username }] })
        else {

            db.all('SELECT (name,username) FROM users WHERE admin=0', (rows) => {
                if (err) console.log(err)
                return res.send({ 'name': row.name, 'admin': 1, 'studentlist': rows })
            })
        }


    })


})
//called when requesting records
app.post('/records', (req, res) => {

    data = req.body
    db.all(`SELECT * FROM records WHERE username = ${data.username} AND date > ${data.start} AND date < ${data.end} ORDER BY date ASC`, (rows) => {
        if (err) console.log(err)
        res.send(rows)
    })

})
//called when adding a new record
app.post('/records/add', function (req, res) {
    data = req.body
    
    db.run(`INSERT INTO records(username,grade,sura,start, end,date) VALUES (${data.username},${data.grade},${data.sura},${data.start},${data.end},${data.date})`,(err)=>{
        if(err) return res.status(201).send(err)
        else {
            db.get(`SELECT * FROM records WHERE id = ${this.lastid}`,(row)=>{
               res.send(row) 
            })
        }
    } )

})

//called when editing record
app.post('/records/edit', function (req, res) {
    data = req.body
    db.run(`UPDATE records SET username = ${data.username},grade = ${data.grade},sura = ${data.sura},start = ${data.start},end = ${data.end},date = ${data.date} WHERE id = ${data.id}`,(row)=>{
        res.send(row)
    })
})


//called when deleting record
app.post('/records/delete', function (req, res) {
    data = req.body
    db.run(`DELETE FFROM records WHERE id = ${data.id}`, (err) => {
        res.send('success')
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

