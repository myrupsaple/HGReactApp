"use strict";
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');

app.use(morgan('short'));

const _currentOrigin = 'http://localhost:3000';

const corsOptions = {
    origin: _currentOrigin,
    optionsSuccessStatus: 200
};

const _CORS_ALLOW = (res) => {
    return res.setHeader('Access-Control-Allow-Origin', _currentOrigin);
};

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#DankDenyk420@Chelsey',
    database: 'HGApp'
});

//################################ (0) SETUP #################################//

connection.connect(async (err) => {
    if(err) {
        return console.log('error: ' + err.message);
    }

    const findTables = `SHOW TABLES`;
    var res = {};

    connection.query(findTables, (err, results, fields) => {
        if(err) {
            console.log(err.message);
        }
        res = results.map(table => {
            return table.Tables_in_hgapp;
        });
    

        const tableList = {
            users: false,
            tributes: false,
            tribute_stats:false,
            donations: false,
            resources: false,
            life_events: false,
            game_state: false
        }
        
        for(let table of res){
            switch(table){
                case 'users':
                    tableList.users = true;
                    break;
                case 'tributes':
                    tableList.tributes = true;
                    break;
                case 'tribute_stats':
                    tableList.tribute_stats = true;
                    break;
                case 'donations':
                    tableList.donations = true;
                    break;
                case 'resources':
                    tableList.resources = true;
                    break;
                case 'life_events':
                    tableList.life_events = true;
                case 'game_state':
                    tableList.game_state = true;
                    break;
                default:
                    break;
            }
        }

        const createUsers = `CREATE TABLE users(
            id INT PRIMARY KEY AUTO_INCREMENT,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20) NOT NULL,
            email VARCHAR(40) NOT NULL,
            permissions VARCHAR(10) NOT NULL
        )`;

        const createTributes = `CREATE TABLE tributes(
            id INT PRIMARY KEY AUTO_INCREMENT,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20) NOT NULL,
            email VARCHAR(40) NOT NULL,
            district TINYINT NOT NULL,
            districtPartner_email VARCHAR(40),
            area VARCHAR(15) NOT NULL,
            mentor_email VARCHAR(40),
            paid_registration TINYINT(1)
        )`;

        const createTributeStats = `CREATE TABLE tribute_stats(
            id INT PRIMARY KEY AUTO_INCREMENT,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20) NOT NULL,
            email VARCHAR(40) NOT NULL,
            funds_remaining INT NOT NULL,
            lives_remaining TINYINT NOT NULL,
            food_resources TINYINT NOT NULL,
            water_resources TINYINT NOT NULL,
            medicine_resources TINYINT NOT NULL,
            roulette_resources TINYINT NOT NULL,
            life_resources TINYINT NOT NULL,
            lives_starting TINYINT NOT NULL,
            lives_purchased TINYINT NOT NULL,
            lives_lost TINYINT NOT NULL,
            kill_count TINYINT NOT NULL
        )`;

        const createDonations = `CREATE TABLE donations(
            id INT PRIMARY KEY AUTO_INCREMENT,
            tribute_email VARCHAR(40),
            donor_name VARCHAR(40),
            method VARCHAR(20),
            date DATE,
            amount INT,
            tags VARCHAR(50)
        )`;

        const createResources = `CREATE TABLE resources(
            // TODO
        )`;

        const createLifeEvents = `CREATE TABLE life_events(
            id INT PRIMARY KEY AUTO_INCREMENT,
            tribute_email VARCHAR(40),
            type VARCHAR(10),
            method VARCHAR(20),
            time INT,
            Notes VARCHAR(50)
        )`;

        const createGameState = `CREATE TABLE game_state(
            start_time DATETIME,
            tributes_remaining TINYINT
        )`;
        
        if(!tableList.users){
            connection.query(createUsers, (err, results, fields) => {
                if(err) {
                    console.log(err.message);
                }
            });
        }
        if(!tableList.tributes){
            connection.query(createTributes, (err, results, fields) => {
                if(err) {
                    console.log(err.message);
                }
            });
        }
        if(!tableList.tribute_stats){
            connection.query(createTributeStats, (err, results, fields) => {
                if(err) {
                    console.log(err.message);
                }
            });
        }
        if(!tableList.donations){
            connection.query(createDonations, (err, results, fields) => {
                if(err){
                    console.log(err.message);
                }
            });
        }
        // if(!tableList.resources){
        //     connection.query(createResources, (err, results, fields) => {
        //         if(err){
        //             console.log(err.message);
        //         }
        //     });
        // }
        if(!tableList.lifeEvents){
            connection.query(createLifeEvents, (err, results, fields) => {
                if(err){
                    console.log(err.message);
                }
            });
        }
        if(!tableList.game_state){
            connection.query(createGameState, (err, results, fields) => {
                if(err) {
                    console.log(err.message);
                }
            });
        }

    })
});

app.options('*', cors(corsOptions), (req, res) => {
    return;
})

//########################### (1) USER MANAGEMENT ############################//

// FETCH_USER
app.get('/user/get/:email', (req, res) => {
    const email = req.params.email;
    const queryStringGetUser = `SELECT * FROM users WHERE email = '${email}'`;
    console.log(queryStringGetUser);
    connection.query(queryStringGetUser, (err, rows, fields) => {
        if (err){
            console.log('Failed to query for user: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }
        _CORS_ALLOW(res);
        
        res.json(rows);
    });
})

// FETCH_USERS
app.get('/users/get/:type/:query', (req, res) => {
    const type = req.params.type;
    const query = req.params.query;
    const queryStringGetUsers = `SELECT * FROM users WHERE ${type} LIKE '%${query}%'`;
    console.log(queryStringGetUsers);
    connection.query(queryStringGetUsers, (err, rows, fields) => {
        if (err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_ALL_USERS
app.get('/users/get', (req, res) => {
    const queryStringGetUsers = 'SELECT * FROM users';
    console.log(queryStringGetUsers);
    connection.query(queryStringGetUsers, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_USER
app.put('/user/put/:id/:firstname/:lastname/:email/:permissions', (req, res) => {
    const { id, firstname, lastname, email, permissions } = req.params;
    const queryStringUpdateUser = `UPDATE users SET first_name = "${firstname}", last_name = "${lastname}", email = "${email}", permissions = "${permissions}" WHERE id = ${id}`
    console.log(queryStringUpdateUser);
    connection.query(queryStringUpdateUser, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// CREATE_USER
app.post('/user/post/:firstname/:lastname/:email/:permissions', (req, res) => {
    const { firstname, lastname, email, permissions } = req.params;
    const queryStringUpdateUser = `INSERT INTO users (first_name, last_name, email, permissions) VALUES ('${firstname}', '${lastname}', '${email}', '${permissions}')`
    console.log(queryStringUpdateUser);
    connection.query(queryStringUpdateUser, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// DELETE_USER
app.delete('/user/delete/:id', (req, res) => {
    const id = req.params.id;
    const queryStringDeleteUser = `DELETE FROM users WHERE id = ${id}`;
    console.log(queryStringDeleteUser);
    connection.query(queryStringDeleteUser, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

//####################### (2) TRIBUTE INFO MANAGEMENT #######################//

// FETCH_TRIBUTES (ALL)
app.get('/tributes/info/get', (req, res) =>{
    const queryStringGetTributes = `SELECT * FROM tributes`;
    console.log(queryStringGetTributes);
    connection.query(queryStringGetTributes, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// FETCH_TRIBUTE
app.get('/tribute/info/get/:email', (req, res) =>{
    const email = req.params.email;
    const queryStringGetTributes = `SELECT * FROM tributes WHERE email = '${email}'`;
    console.log(queryStringGetTributes);
    connection.query(queryStringGetTributes, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// CREATE_TRIBUTE
app.post('/tribute/info/post/:firstname/:lastname/:email/:district/:partneremail/:area/:mentoremail/:paidreg', (req, res) => {
    const { firstname, lastname, email, district, partneremail, area, mentoremail, paidreg } = req.params;
    const queryStringCreateTribute = `INSERT INTO tributes (first_name, last_name, email, district,
        districtPartner_email, area, mentor_email, paid_registration) VALUES ("${firstname}", 
        "${lastname}", "${email}", "${district}", "${partneremail}", "${area}", 
        "${mentoremail}", "${paidreg}")`;
    console.log(queryStringCreateTribute);
    connection.query(queryStringCreateTribute, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_TRIBUTE
app.put('/tribute/info/put/:id/:firstname/:lastname/:email/:district/:partneremail/:area/:mentoremail/:paidreg', (req, res) => {
    const { id, firstname, lastname, email, district, partneremail, area, mentoremail, paidreg } = req.params;
    const queryStringUpdateTribute = `UPDATE tributes SET first_name = "${firstname}",
        last_name = "${lastname}", email = "${email}", district = "${district}",
        districtPartner_email = "${partneremail}", area = "${area}", mentor_email ="${mentoremail}", 
        paid_registration = "${paidreg}" WHERE id = ${id}`;
    console.log(queryStringUpdateTribute);
    connection.query(queryStringUpdateTribute, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// DELETE_TRIBUTE
app.delete('/tribute/info/delete/:id', (req, res) => {
    const id = req.params.id;
    const queryStringDeleteTribute = `DELETE FROM tributes WHERE id = ${id}`;
    console.log(queryStringDeleteTribute);
    connection.query(queryStringDeleteTribute, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

//########################### (3) FUNDS MANAGEMENT ###########################//

// FETCH_DONATION
app.get(`/donation/get/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringGetDonation = `SELECT id, tribute_email, donor_name, method, 
    DATE_FORMAT(date, '%m-%d-%Y') date, amount, tags FROM donations WHERE id = ${id}`;
    console.log(queryStringGetDonation);
    connection.query(queryStringGetDonation, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for donations: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_DONATIONS
app.get(`/donations/get/:type/:query`, (req, res) => {
    const { type, query } = req.params;
    const queryStringGetDonations = `SELECT id, tribute_email, donor_name, method, 
    DATE_FORMAT(date, '%m-%d-%Y') date, amount, tags FROM donations WHERE ${type} LIKE '%${query}%'`;
    console.log(queryStringGetDonations);
    connection.query(queryStringGetDonations, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for donations: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_DONATIONS_RANGE
app.get(`/donations/get/range/:type/:query1/:query2`, (req, res) => {
    const { type, query1, query2 } = req.params;
    const queryStringGetDonationsRange = `SELECT id, tribute_email, donor_name, method, 
    DATE_FORMAT(date, '%m-%d-%Y') date, amount, tags FROM donations WHERE
    ${type} >= '${query1}' AND ${type} <= '${query2}'`;
    console.log(queryStringGetDonationsRange);
    connection.query(queryStringGetDonationsRange, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for donations: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);
        
        res.json(rows);
    })
})

// FETCH_ALL_DONATIONS
app.get(`/donations/get/all`, (req, res) => {
    const queryStringGetAllDonations = `SELECT id, tribute_email, donor_name, method, 
    DATE_FORMAT(date, '%m-%d-%Y') date, amount, tags FROM donations`;
    console.log(queryStringGetAllDonations);
    connection.query(queryStringGetAllDonations, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for donations: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// CREATE_DONATION
app.post('/donations/post/:email/:donor/:method/:date/:amount/:tags', (req, res) => {
    const { email, donor, method, date, amount, tags } = req.params;
    const queryStringCreateDonation = `INSERT INTO donations (tribute_email, donor_name,
        method, date, amount, tags) VALUES 
        ('${email}', '${donor}', '${method}', '${date}', '${amount}', '${tags}')`
    console.log(queryStringCreateDonation);
    connection.query(queryStringCreateDonation, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for donations: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_DONATION
app.put(`/donations/put/:id/:email/:donor/:method/:date/:amount/:tags`, (req, res) => {
    const { id, email, donor, method, date, amount, tags } = req.params;
    const queryStringUpdateDonation = `UPDATE donations SET tribute_email = '${email}', 
    donor_name = '${donor}', method = '${method}', date = '${date}', 
    amount = '${amount}', tags ='${tags}' WHERE id = ${id}`;
    console.log(queryStringUpdateDonation);
    connection.query(queryStringUpdateDonation, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for donations: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// DELETE_DONATION
app.delete(`/donations/delete/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringUpdateDonation = `DELETE FROM donations WHERE id = ${id}`
    console.log(queryStringUpdateDonation);
    connection.query(queryStringUpdateDonation, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for donations: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

//######################### (4) Resource Management ##########################//

//########################### (5) Life Management ############################//

// FETCH_LIFE_EVENT
app.get(`/life-events/get/single/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringGetLifeEvent = `SELECT * FROM life_events WHERE id = ${id}`;
    console.log(queryStringGetLifeEvent);
    connection.query(queryStringGetLifeEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for life events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_LIFE_EVENTS
app.get(`/life-events/get/list/:type/:query`, (req, res) => {
    const { type, query } = req.params;
    const queryStringGetLifeEvents = `SELECT * FROM life_events WHERE ${type} = '${query}'`;
    console.log(queryStringGetLifeEvents);
    connection.query(queryStringGetLifeEvents, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for life events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_LIFE_EVENTS_RANGE
app.get(`/life-events/get/range/:type/:query_lower/:query_upper`, (req, res) => {
    const { type, query_lower, query_upper } = req.params;
    const queryStringGetLifeEventsRange = `SELECT * FROM life_events WHERE 
    ${type} >= ${query_lower} AND ${type} <= ${query_upper}`;
    console.log(queryStringGetLifeEventsRange);
    connection.query(queryStringGetLifeEventsRange, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for life events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_ALL_LIFE_EVENTS
app.get(`/life-events/get/all`, (req, res) => {
    const queryStringGetAllLifeEvents = `SELECT * FROM life_events`
    console.log(queryStringGetAllLifeEvents);
    connection.query(queryStringGetAllLifeEvents, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for life events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// CREATE_LIFE_EVENT
app.post(`/life-events/post/:email/:type/:method/:time/:notes`, (req, res) => {
    const { email, type, method, time, notes } = req.params;
    const queryStringCreateLifeEvent = `INSERT INTO life_events (tribute_email,
        type, method, time, notes) VALUES ('${email}', '${type}', '${method}',
        ${time}, '${notes}')`;
    console.log(queryStringCreateLifeEvent);
    connection.query(queryStringCreateLifeEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for life events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_LIFE_EVENT
app.put(`/life-events/post/:id/:email/:type/:method/:time/:notes`, (req, res) => {
    const { id, email, type, method, time, notes } = req.params;
    const queryStringUpdateLifeEvent = `UPDATE life_events SET email = '${email}',
    type = '${type}', method = '${method}', time = ${time}, notes = '${notes}'
    WHERE id = ${id}`;
    console.log(queryStringUpdateLifeEvent);
    connection.query(queryStringUpdateLifeEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for life events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// DELETE_LIFE_EVENT
app.delete(`/life-events/delete/:id/`, (req, res) => {
    const id = req.params.id;
    const queryStringDeleteLifeEvent = `DELETE FROM life_events WHERE id = ${id}`;
    console.log(queryStringDeleteLifeEvent);
    connection.query(queryStringDeleteLifeEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for life events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

//######################## (6) Game State Management #########################//

// FETCH_GAMESTATE
app.get(`/game-state/get`, (req, res) => {
    const queryStringGetGameState = `SELECT * FROM game_state`
    console.log(queryStringGetGameState);
    connection.query(queryStringGetGameState, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for game state: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_GAMETIME
app.put(`/game-state/put/game-time/:time`, (req, res) => {
    const time = req.params.time;
    const queryStringSetGameTime = `UPDATE game_state SET start_time = '${time}'`;
    connection.query(queryStringSetGameTime, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for game state: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})


//########################### RUNS THE API SERVER ############################//
app.listen(3001, () => {
    console.log('Server is up and listening on port 3001...');
})