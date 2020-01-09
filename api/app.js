const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');

app.use(morgan('short'));

app.get('/user/:email', (req, res) => {
    console.log("Fetching user with id: " + req.params.id);

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'HGApp'
    })

    const userEmail = req.params.email;
    const queryStringGetUsers = "SELECT * FROM users WHERE email = ?"
    connection.query(queryStringGetUsers, [userEmail], (err, rows, fields) => {
        if (err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
            // throw err;
        }
        console.log(rows);

        // const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        // });

        // res.json(users);
        res.json(rows);
    });

    // res.end();
})

app.get('/', (req, res) => {
    console.log('Responding to root route');
    res.send('Responding from root!');
})

app.get("/users", (req, res) => {
    var user1 = {firstName: "Stephen", lastName: "Curry"};
    const user2 = {firstName: "Kevin", lastName: "Durant"};
    res.json([user1, user2]);
})

app.listen(3001, () => {
    console.log("Server is up and listening on port 3001...")
})