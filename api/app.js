const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');

app.use(morgan('short'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'HGApp'
})

app.get('/', (req, res) => {
    console.log('Responding to root route');
    res.send('Responding from root!');
})

app.get('/users', (req, res) => {
    const queryStringGetUsers = 'SELECT * FROM users';
    connection.query(queryStringGetUsers, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        res.json(rows);

    });
})

app.get('/user/:email', (req, res) => {
    console.log("Fetching user with id: " + req.params.id);

    const userEmail = req.params.email;
    const queryStringGetUser = 'SELECT * FROM users WHERE email = ?'
    connection.query(queryStringGetUser, [userEmail], (err, rows, fields) => {
        if (err){
            console.log('Failed to query for user: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        res.json(rows);
    });
})

app.listen(3001, () => {
    console.log('Server is up and listening on port 3001...');
})