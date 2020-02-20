"use strict";
const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
const mysql = require('mysql');

const setup = require('./components/setup');
const events = require('./components/events');

const app = express();
// app.use(morgan('short'));

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

setup.runSetup(connection)

events.checkForEvents(connection);

app.options('*', cors(corsOptions), (req, res) => {
    return;
})

//events.checkForEvents(connection);

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
app.post('/tribute/info/post/:firstname/:lastname/:email/:phone/:district/:partneremail/:area/:mentoremail/:paidreg', (req, res) => {
    const { firstname, lastname, email, phone, district, partneremail, area, mentoremail, paidreg } = req.params;
    const queryStringCreateTribute = `INSERT INTO tributes (first_name, last_name, email, phone, district,
        districtPartner_email, area, mentor_email, paid_registration) VALUES ("${firstname}", 
        "${lastname}", "${email}", "${phone}", "${district}", "${partneremail}", "${area}", 
        "${mentoremail}", "${paidreg}")`;
    console.log(queryStringCreateTribute);
    connection.query(queryStringCreateTribute, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }
    });

    const queryStringInsertTributeStats = `INSERT INTO tribute_stats (first_name, last_name,
        email) VALUES ('${firstname}', '${lastname}', '${email}')`;
    console.log(queryStringInsertTributeStats);
    connection.query(queryStringInsertTributeStats, (err, rows, fields) => {
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
app.put('/tribute/info/put/:id/:firstname/:lastname/:email/:phone/:district/:partneremail/:area/:mentoremail/:paidreg', (req, res) => {
    const { id, firstname, lastname, email, phone, district, partneremail, area, mentoremail, paidreg } = req.params;
    const queryStringUpdateTribute = `UPDATE tributes SET first_name = "${firstname}",
        last_name = "${lastname}", email = "${email}", phone = "${phone}", district = "${district}",
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
    });


    const queryStringUpdateTributeStats = `UPDATE tribute_stats SET first_name = "${firstname}",
    last_name = "${lastname}", email = "${email}" WHERE id = ${id}`;
    console.log(queryStringUpdateTributeStats);
    connection.query(queryStringUpdateTributeStats, (err, rows, fields) => {
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

// DELETE_TRIBUTE_DELETE_STATS
app.delete('/tribute/info/tribute-stats/delete/:email', (req, res) => {
    const email = req.params.email;
    const queryStringDeleteTribute = `DELETE FROM tribute_stats WHERE email = '${email}'`;
    console.log(queryStringDeleteTribute);
    connection.query(queryStringDeleteTribute, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
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
    const queryStringGetDonation = `SELECT * FROM donations WHERE id = ${id}`;
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
    const queryStringGetDonations = `SELECT * FROM donations WHERE ${type} LIKE '%${query}%'`;
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
    const queryStringGetDonationsRange = `SELECT * FROM donations WHERE
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
    const queryStringGetAllDonations = `SELECT * FROM donations`;
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

// UPDATE_TRIBUTE_STATS_DONATION
app.put(`/tribute-stats/donations/put/:email/:amount`, (req, res) => {
    const { email, amount } = req.params;
    const queryStringUpdateDonation = `UPDATE tribute_stats SET funds_remaining = funds_remaining + ${amount},
    total_donations = total_donations + ${amount} WHERE email = '${email}'`;
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

//########################### (4a) Resource List #############################//

// FETCH_RESOURCE_LIST_ITEM
app.get(`/resource/list/get/single/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringGetResListItem = `SELECT * FROM resource_list WHERE id = ${id}`;
    console.log(queryStringGetResListItem);
    connection.query(queryStringGetResListItem, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource list: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_RESOURCE_LIST_ITEM_BY_CODE
app.get(`/resource/list/get/singleByCode/:code`, (req, res) => {
    const code = req.params.code;
    const queryStringGetResListItem = `SELECT * FROM resource_list WHERE code = '${code}'`;
    console.log(queryStringGetResListItem);
    connection.query(queryStringGetResListItem, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource list: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_RESOURCE_LIST_ITEMS
app.get(`/resource/list/get/list/:type/:query`, (req, res) => {
    const { type, query } = req.params;
    const queryStringGetResListItems = `SELECT * FROM resource_list WHERE ${type} LIKE '%${query}%'`;
    console.log(queryStringGetResListItems);
    connection.query(queryStringGetResListItems, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource list: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_ALL_RESOURCE_LIST_ITEMS
app.get(`/resource/list/get/all`, (req, res) => {
    const queryStringGetAllResListItems = `SELECT * FROM resource_list`;
    console.log(queryStringGetAllResListItems);
    connection.query(queryStringGetAllResListItems, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource list: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// CREATE_RESOURCE_LIST_ITEM
app.post('/resource/list/post/:code/:type/:timesUsed/:maxUses/:usedBy/:notes', (req, res) => {
    const { code, type, timesUsed, maxUses, usedBy, notes } = req.params;
    const queryStringCreateResListItem = `INSERT INTO resource_list (code, type, times_used,
        max_uses, used_by, notes) VALUES 
        ('${code}', '${type}', '${timesUsed}', '${maxUses}', '${usedBy}', '${notes}')`
    console.log(queryStringCreateResListItem);
    connection.query(queryStringCreateResListItem, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource list: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_RESOURCE_LIST_ITEM
app.put(`/resource/list/put/:id/:code/:type/:timesUsed/:maxUses/:usedBy/:notes`, (req, res) => {
    const { id, code, type, timesUsed, maxUses, usedBy, notes } = req.params;
    const queryStringUpdateResListItem = `UPDATE resource_list SET code = '${code}', 
    type = '${type}', times_used = '${timesUsed}', max_uses = '${maxUses}', used_by = '${usedBy}', 
    notes = '${notes}' WHERE id = ${id}`;
    console.log(queryStringUpdateResListItem);
    connection.query(queryStringUpdateResListItem, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource list: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// DELETE_RESOURCE_LIST_ITEM
app.delete(`/resource/list/delete/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringDeleteResListItem = `DELETE FROM resource_list WHERE id = ${id}`
    console.log(queryStringDeleteResListItem);
    connection.query(queryStringDeleteResListItem, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource list: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

//########################## (4b) Resource Events ############################//

// FETCH_RESOURCE_EVENT
app.get(`/resource/events/get/single/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringGetResEventItem = `SELECT * FROM resource_events WHERE id = ${id}`;
    console.log(queryStringGetResEventItem);
    connection.query(queryStringGetResEventItem, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_RESOURCE_EVENTS
app.get(`/resource/events/get/list/:type/:query`, (req, res) => {
    const { type, query } = req.params;
    const queryStringGetResEventItems = `SELECT * FROM resource_events WHERE ${type} LIKE '%${query}%'`;
    console.log(queryStringGetResEventItems);
    connection.query(queryStringGetResEventItems, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource event: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_RESOURCE_EVENT_RANGE
app.get(`/resource/events/get/range/:type/:query1/:query2`, (req, res) => {
    const { type, query1, query2 } = req.params;
    const queryStringGetResEventItemRange = `SELECT * FROM resource_events WHERE
    ${type} >= '${query1}' AND ${type} <= '${query2}'`;
    console.log(queryStringGetResEventItemRange);
    connection.query(queryStringGetResEventItemRange, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);
        
        res.json(rows);
    })
})

// FETCH_ALL_RESOURCE_EVENTS
app.get(`/resource/events/get/all`, (req, res) => {
    const queryStringGetAllResEventItems = `SELECT * FROM resource_events`;
    console.log(queryStringGetAllResEventItems);
    connection.query(queryStringGetAllResEventItems, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// CREATE_RESOURCE_EVENT
app.post('/resource/events/post/:email/:type/:method/:time/:notes', (req, res) => {
    const { email, type, method, time, notes } = req.params;
    const queryStringCreateResEventItem = `INSERT INTO resource_events (tribute_email, type,
        method, time, notes) VALUES 
        ('${email}', '${type}', '${method}', '${time}', '${notes}')`
    console.log(queryStringCreateResEventItem);
    connection.query(queryStringCreateResEventItem, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_RESOURCE_EVENT
app.put(`/resource/events/put/:id/:email/:type/:method/:time/:notes`, (req, res) => {
    const { id, email, type, method, time, notes } = req.params;
    const queryStringUpdateResEventItem = `UPDATE resource_events SET tribute_email = '${email}', 
    type = '${type}', method = '${method}', time = '${time}', 
    notes = '${notes}' WHERE id = ${id}`;
    console.log(queryStringUpdateResEventItem);
    connection.query(queryStringUpdateResEventItem, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// DELETE_RESOURCE_EVENT
app.delete(`/resource/events/delete/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringDeleteResEventItem = `DELETE FROM resource_events WHERE id = ${id}`
    console.log(queryStringDeleteResEventItem);
    connection.query(queryStringDeleteResEventItem, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_TRIBUTE_STATS_RESOURCE_EVENT
app.put(`/tribute-stats/resource-events/put/:email/:type/:mode`, (req, res) => {
    const { email, type, mode } = req.params;
    var queryStringUpdateTributeStatsResources = ``;
    if(['food', 'water', 'medicine', 'roulette'].includes(type)){
        if(mode === 'create'){
            queryStringUpdateTributeStatsResources = `UPDATE tribute_stats SET
            ${type}_used = ${type}_used + 1 WHERE email = '${email}'`;
        } else if(mode === 'delete'){
            queryStringUpdateTributeStatsResources = `UPDATE tribute_stats SET
            ${type}_used = ${type}_used - 1 WHERE email = '${email}'`;
        }
    } else if(type === 'life'){
        if(mode === 'create'){
            queryStringUpdateTributeStatsResources = `UPDATE tribute_stats SET
            life_resources = life_resources + 1, lives_exempt = lives_exempt + 1,
            lives_remaining = lives_remaining + 1 WHERE email = '${email}'`;
        } else if(mode === 'delete'){
            queryStringUpdateTributeStatsResources = `UPDATE tribute_stats SET
            life_resources = life_resources - 1, lives_exempt = lives_exempt - 1,
            lives_remaining = lives_remaining - 1 WHERE email = '${email}'`;
        }
        
    } else if(type.split('-')[0] === 'golden'){
        const trueType = type.split('-')[1];
        if(mode === 'create'){
            queryStringUpdateTributeStatsResources = `UPDATE tribute_stats SET
            ${trueType}_used = ${trueType}_used + 1, golden_used = golden_used + 1 WHERE email = '${email}'`;
        } else if(mode === 'delete'){
            queryStringUpdateTributeStatsResources = `UPDATE tribute_stats SET
            ${trueType}_used = ${trueType}_used - 1, golden_used = golden_used - 1 WHERE email = '${email}'`;
        }
    }

    console.log(queryStringUpdateTributeStatsResources);
    connection.query(queryStringUpdateTributeStatsResources, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// CREATE_LIFE_EVENT_RESOURCE_EVENTS
app.post(`/resource-events/life-events/post/:email/:time/:notes`, (req, res) => {
    const { email, time, notes } = req.params;
    const queryStringCreateLifeEventsResources = `INSERT INTO life_events (tribute_email,
    type, method, time, notes) VALUES ('${email}', 'gained', 'resource', ${time}, '${notes}')`;
    console.log(queryStringCreateLifeEventsResources);
    connection.query(queryStringCreateLifeEventsResources, (err, rows, fields) => {
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

// UPDATE_LIFE_EVENT_RESOURCE_EVENTS
app.put(`/resource-events/life-events/put/:email1/:email2/:time/:notes`, (req, res) => {
    const { email1, email2, time, notes } = req.params;
    const queryStringUpdateLifeEventsResources = `UPDATE life_events SET tribute_email = '${email2}',
    time = ${time}, notes = '${notes}' WHERE tribute_email = '${email1}' AND time = ${time} AND notes = '${notes}'`;
    console.log(queryStringUpdateLifeEventsResources);
    connection.query(queryStringUpdateLifeEventsResources, (err, rows, fields) => {
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

// DELETE_LIFE_EVENT_RESOURCE_EVENTS
app.put(`/resource-events/life-events/put/:email/:time/:notes`, (req, res) => {
    const { email, time, notes } = req.params;
    const queryStringUpdateLifeEventsResources = `DELETE FROM life_events WHERE tribute_email = '${email}' 
    AND time = ${time} AND notes = '${notes}'`;
    console.log(queryStringUpdateLifeEventsResources);
    connection.query(queryStringUpdateLifeEventsResources, (err, rows, fields) => {
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

// UPDATE_RESOURCE_LIST_RESOURCE_EVENTS
app.put(`/resource-events/resource-list/put/:name/:code/:mode`, (req, res) => {
    const { name, code, mode }= req.params;
    var queryStringUpdateResourcesListResources = '';
    if(mode === 'create'){
        queryStringUpdateResourcesListResources = `UPDATE resource_list SET times_used = 
        times_used + 1, used_by = CONCAT(used_by, ' ${name}', ',') WHERE code = '${code}'`;
    } else if(mode === 'edit'){
        queryStringUpdateResourcesListResources = `UPDATE resource_list SET times_used = 
        times_used - 1, used_by = CONCAT(used_by, ' PREVIOUS EDITED TO', ' ') WHERE code = '${code}'`;
    } else if(mode === 'delete'){
        queryStringUpdateResourcesListResources = `UPDATE resource_list SET times_used = 
        times_used - 1, used_by = CONCAT(used_by, ' DELETED: ${name}', ',') WHERE code = '${code}'`;
    }
    console.log(queryStringUpdateResourcesListResources);
    connection.query(queryStringUpdateResourcesListResources, (err, rows, fields) => {
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

// FETCH_LIFE_EVENT_BY_TERMS
app.get(`/life-events/get/single/terms/:email/:time/:notes`, (req, res) => {
    const { email, time, notes } = req.params;
    const queryStringGetLifeEventByTerms = `SELECT * FROM life_events WHERE tribute_email = '${email}' AND
    time = '${time}' AND notes = '${notes}'`;
    console.log(queryStringGetLifeEventByTerms);
    connection.query(queryStringGetLifeEventByTerms, (err, rows, fields) => {
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
app.get(`/life-eents/get/range/:type/:query_lower/:query_upper`, (req, res) => {
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
app.put(`/life-events/put/:id/:email/:type/:method/:time/:notes`, (req, res) => {
    const { id, email, type, method, time, notes } = req.params;
    const queryStringUpdateLifeEvent = `UPDATE life_events SET tribute_email = '${email}',
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

// UPDATE_TRIBUTE_STATS_LIFE_EVENT
app.put(`/tribute-stats/life-events/lives/put/:email/:type/:method/:mode`, (req, res) => {
    const { email, type, method, mode } = req.params;
    var queryStringUpdateTributeStatsLives = '';
    if(mode === 'create'){
        if(type === 'gained'){
            if(method === 'purchased'){
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_purchased =
                lives_purchased + 1, lives_remaining = lives_remaining + 1 WHERE email = '${email}'`;
    
            } else if (method === 'life resource') {
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET life_resources =
                life_resources + 1, lives_exempt = lives_exempt + 1, 
                lives_remaining = lives_remaining + 1 WHERE email = '${email}'`;
            } else {
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_exempt =
                lives_exempt + 1, lives_remaining = lives_remaining + 1 WHERE email = '${email}'`;
            }
        } else if(type === 'lost'){
            queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_remaining =
            lives_remaining - 1, lives_lost = lives_lost + 1 WHERE email = '${email}'`;
        }
    } else if(mode === 'delete'){
        // These basically all do the opposite of the above.
        if(type === 'gained'){
            if(method === 'purchased'){
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_purchased =
                lives_purchased - 1, lives_remaining = lives_remaining - 1 WHERE email = '${email}'`;
    
            } else if (method === 'life resource') {
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET life_resources =
                life_resources - 1, lives_exempt = lives_exempt - 1, 
                lives_remaining = lives_remaining - 1 WHERE email = '${email}'`;
            } else {
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_exempt =
                lives_exempt - 1, lives_remaining = lives_remaining - 1 WHERE email = '${email}'`;
            }
        } else if(type === 'lost'){
            queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_remaining =
            lives_remaining + 1, lives_lost = lives_lost - 1 WHERE email = '${email}'`;
        }
    }
    console.log(queryStringUpdateTributeStatsLives);
    connection.query(queryStringUpdateTributeStatsLives, (err, rows, fields) => {
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

// UPDATE_TRIBUTE_STATS_KILL_COUNT
app.put(`/tribute-stats/life-events/kills/put/:email/:mode`, (req, res) => {
    const { email, mode } = req.params;
    var queryStringUpdateTributeStatsKills = '';

    if(mode === 'create'){
        queryStringUpdateTributeStatsKills = `UPDATE tribute_stats SET kill_count = 
        kill_count + 1 WHERE email = '${email}'`;
    } else if(mode === 'delete'){
        queryStringUpdateTributeStatsKills = `UPDATE tribute_stats SET kill_count = 
        kill_count - 1 WHERE email = '${email}'`;
    }

    console.log(queryStringUpdateTributeStatsKills);
    connection.query(queryStringUpdateTributeStatsKills, (err, rows, fields) => {
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

// UPDATE_TRIBUTE_STATS_LIFE_EVENT
app.put(`/tribute-stats/life-events/lives/put/:email/:type/:method/:mode`, (req, res) => {
    const { email, type, method, mode } = req.params;
    var queryStringUpdateTributeStatsLives = '';
    if(mode === 'create'){
        if(type === 'gained'){
            if(method === 'purchased'){
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_purchased =
                lives_purchased + 1, lives_remaining = lives_remaining + 1 WHERE email = '${email}'`;
    
            } else if (method === 'life resource') {
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET life_resources =
                life_resources + 1, lives_exempt = lives_exempt + 1, 
                lives_remaining = lives_remaining + 1 WHERE email = '${email}'`;
            } else {
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_exempt =
                lives_exempt + 1, lives_remaining = lives_remaining + 1 WHERE email = '${email}'`;
            }
        } else if(type === 'lost'){
            queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_remaining =
            lives_remaining - 1, lives_lost = lives_lost + 1 WHERE email = '${email}'`;
        }
    } else if(mode === 'delete'){
        // These basically all do the opposite of the above.
        if(type === 'gained'){
            if(method === 'purchased'){
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_purchased =
                lives_purchased - 1, lives_remaining = lives_remaining - 1 WHERE email = '${email}'`;
    
            } else if (method === 'life resource') {
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET life_resources =
                life_resources - 1, lives_exempt = lives_exempt - 1, 
                lives_remaining = lives_remaining - 1 WHERE email = '${email}'`;
            } else {
                queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_exempt =
                lives_exempt - 1, lives_remaining = lives_remaining - 1 WHERE email = '${email}'`;
            }
        } else if(type === 'lost'){
            queryStringUpdateTributeStatsLives = `UPDATE tribute_stats SET lives_remaining =
            lives_remaining + 1, lives_lost = lives_lost - 1 WHERE email = '${email}'`;
        }
    }
    console.log(queryStringUpdateTributeStatsLives);
    connection.query(queryStringUpdateTributeStatsLives, (err, rows, fields) => {
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

// UPDATE_RESOURCE_EVENTS_LIFE_EVENT
app.put(`/resource-events/life-events/put/:email/:mode`, (req, res) => {
    const { email, mode } = req.params;
    var queryStringUpdateTributeStatsKills = '';

    if(mode === 'create'){
        queryStringUpdateTributeStatsKills = `UPDATE tribute_stats SET kill_count = 
        kill_count + 1 WHERE email = '${email}'`;
    } else if(mode === 'delete'){
        queryStringUpdateTributeStatsKills = `UPDATE tribute_stats SET kill_count = 
        kill_count - 1 WHERE email = '${email}'`;
    }

    console.log(queryStringUpdateTributeStatsKills);
    connection.query(queryStringUpdateTributeStatsKills, (err, rows, fields) => {
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

//############################## (6) Item List ###############################//

// FETCH_ITEM
app.get(`/item-list/get/single/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringGetItem = `SELECT * FROM item_list WHERE id = ${id}`;
    console.log(queryStringGetItem);
    connection.query(queryStringGetItem, (err, rows, fields) => {
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

// FETCH_ITEMS
app.get(`/item-list/get/list/:query`, (req, res) => {
    const query = req.params.query;
    const queryStringGetItems = `SELECT * FROM item_list WHERE item_name LIKE '%${query}%'`;
    console.log(queryStringGetItems);
    connection.query(queryStringGetItems, (err, rows, fields) => {
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

// FETCH_ALL_ITEMS
app.get(`/item-list/get/all`, (req, res) => {
    const queryStringGetAllItems = `SELECT * FROM item_list`
    console.log(queryStringGetAllItems);
    connection.query(queryStringGetAllItems, (err, rows, fields) => {
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

// CREATE_ITEM
app.post(`/item-list/post/:name/:description/:quantity/:t1cost/:t2cost/:t3cost/:t4cost`, (req, res) => {
    const { name, description, quantity, t1cost, t2cost, t3cost, t4cost } = req.params;
    const queryStringCreateItem = `INSERT INTO item_list (item_name,
        description, quantity, tier1_cost, tier2_cost, tier3_cost, tier4_cost) VALUES 
        ('${name}', '${description}', '${quantity}', ${t1cost}, '${t2cost}', '${t3cost}', '${t4cost}')`;
    console.log(queryStringCreateItem);
    connection.query(queryStringCreateItem, (err, rows, fields) => {
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

// UPDATE_ITEM
app.put(`/item-list/put/:id/:name/:description/:quantity/:t1cost/:t2cost/:t3cost/:t4cost`, (req, res) => {
    const { id, name, description, quantity, t1cost, t2cost, t3cost, t4cost } = req.params;
    const queryStringUpdateItem = `UPDATE item_list SET item_name = '${name}',
    description = '${description}', quantity = '${quantity}', tier1_cost = ${t1cost}, 
    tier2_cost = '${t2cost}', tier3_cost = '${t3cost}', tier4_cost = '${t4cost}' WHERE id = ${id}`;
    console.log(queryStringUpdateItem);
    connection.query(queryStringUpdateItem, (err, rows, fields) => {
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

// DELETE_ITEM
app.delete(`/item-list/delete/:id/`, (req, res) => {
    const id = req.params.id;
    const queryStringDeleteItem = `DELETE FROM item_list WHERE id = ${id}`;
    console.log(queryStringDeleteItem);
    connection.query(queryStringDeleteItem, (err, rows, fields) => {
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

//############################## (7) Purchases ###############################//

// FETCH_MENTORS
app.get(`/purchases/get/mentors`, (req, res) => {
    const queryStringGetPurchase = `SELECT * FROM users WHERE permissions = 'mentor'`;
    console.log(queryStringGetPurchase);
    connection.query(queryStringGetPurchase, (err, rows, fields) => {
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

// FETCH_PURCHASE
app.get(`/purchases/get/single/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringGetPurchase = `SELECT * FROM purchases WHERE id = ${id}`;
    console.log(queryStringGetPurchase);
    connection.query(queryStringGetPurchase, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for purchases: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_PURCHASES
app.get(`/purchases/get/list/:email`, (req, res) => {
    const email = req.params.email;
    const queryStringGetPurchases = `SELECT * FROM purchases WHERE receiver_email = '${email}'`;
    console.log(queryStringGetPurchases);
    connection.query(queryStringGetPurchases, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for purchases: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_ALL_PURCHASES
app.get(`/purchases/get/all`, (req, res) => {
    const queryStringAllGetPurchases = `SELECT * FROM purchases`;
    console.log(queryStringAllGetPurchases);
    connection.query(queryStringAllGetPurchases, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for purchases: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// CREATE_PURCHASE_REQUEST
app.post(`/purchases/post/:time/:status/:mentorEmail/:payerEmail/:receiverEmail/:category/:item_name/:item_id/:cost/:quantity`, (req, res) => {
    const { time, status, mentorEmail, payerEmail, receiverEmail, category, item_name, item_id, cost, quantity } = req.params;
    const queryStringCreatePurchaseRequest = `INSERT INTO purchases (time, status,
        mentor_email, payer_email, receiver_email, category, item_name, item_id,
        cost, quantity) VALUES (${time}, '${status}', '${mentorEmail}', '${payerEmail}',
        '${receiverEmail}', '${category}', '${item_name}', ${item_id}, ${cost}, ${quantity})`;
    console.log(queryStringCreatePurchaseRequest);
    connection.query(queryStringCreatePurchaseRequest, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for purchases: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_PURCHASE_REQUEST
app.put(`/purchases/put/:id/:time/:status/:mentorEmail/:payerEmail/:receiverEmail/:category/:item_name/:item_id/:cost/:quantity/:notes`, (req, res) => {
    const { id, time, status, mentorEmail, payerEmail, receiverEmail, category, item_name, item_id, cost, quantity, notes } = req.params;
    const queryStringUpdatePurchaseRequest = `UPDATE purchases SET time = ${time}, status = '${status}',
    mentor_email = '${mentorEmail}', payer_email = '${payerEmail}', receiver_email = '${receiverEmail}',
    category = '${category}', item_name = '${item_name}', item_id = ${item_id}, cost = ${cost}, 
    notes = '${notes}', quantity = ${quantity} WHERE id = ${id}`;
    console.log(queryStringUpdatePurchaseRequest);
    connection.query(queryStringUpdatePurchaseRequest, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for purchases: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_PURCHASE_STATUS
app.put(`/purchases/status/put/:id/:status/:notes`, (req, res) => {
    const { id, status, notes } = req.params;
    const queryStringUpdatePurchaseStatus = `UPDATE purchases SET status = '${status}',
    notes = '${notes}' WHERE id = ${id}`;
    console.log(queryStringUpdatePurchaseStatus);
    connection.query(queryStringUpdatePurchaseStatus, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for purchases: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// DELETE_PURCHASE_REQUEST
app.delete(`/purchases/delete/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringDeletePurchaseRequest = `DELETE FROM purchases WHERE id = ${id}`
    console.log(queryStringDeletePurchaseRequest);
    connection.query(queryStringDeletePurchaseRequest, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for purchases: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// CHECK_FUNDS
app.get(`/purchases/tribute-stats/check-funds/get/:email`, (req, res) => {
    const email = req.params.email;
    const queryStringCheckFunds = `SELECT funds_remaining FROM tribute_stats WHERE email = '${email}'`;
    console.log(queryStringCheckFunds);
    connection.query(queryStringCheckFunds, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_FUNDS
app.put(`/purchases/tribute-stats/update-funds/put/:email/:amount`, (req, res) => {
    const { email, amount } = req.params;
    console.log(amount + ' ' + typeof(amount));
    const queryStringCheckFunds = `UPDATE tribute_stats SET funds_remaining = 
    funds_remaining + ${amount} WHERE email = '${email}'`;
    console.log(queryStringCheckFunds);
    connection.query(queryStringCheckFunds, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_ITEM_QUANTITY
app.put(`/purchases/items/put/:id/:quantity`, (req, res) => {
    const { id, quantity } = req.params;
    const queryStringUpdateItemQuantity = `UPDATE item_list SET quantity = quantity + ${quantity} WHERE id = ${id}`;
    console.log(queryStringUpdateItemQuantity);
    connection.query(queryStringUpdateItemQuantity, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for purchases: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// INSERT_LIFE_EVENT
app.post(`/purchases/life-events/post/:email/:time`, (req, res) => {
    const { email, time } = req.params;
    const queryStringInsertLifeEvent = `INSERT INTO life_events (tribute_email, type,
        method, time, notes) VALUES ('${email}', 'gained', 'purchased', 
        ${time}, 'Purchased life')`;
    console.log(queryStringInsertLifeEvent);
    connection.query(queryStringInsertLifeEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for purchases: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// ADD_PURCHASED_LIFE
app.put(`/purchases/tribute-stats/lives/put/:email`, (req, res) => {
    const email = req.params.email;
    const queryStringAddPurchasedLife = `UPDATE tribute_stats SET lives_purchased = 
    lives_purchased + 1, lives_remaining = lives_remaining + 1 WHERE email = '${email}'`;
    console.log(queryStringAddPurchasedLife);
    connection.query(queryStringAddPurchasedLife, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// INSERT_RESOURCE_EVENT
app.post(`/purchases/resources/post/:email/:type/:time`, (req, res) => {
    const { email, type, time } = req.params;
    const queryStringInsertResourceEvent = `INSERT INTO resource_events (tribute_email, type,
        method, time, notes) VALUES ('${email}', '${type}', 'purchased', 
        ${time}, 'Purchased ${type} resource')`;
    console.log(queryStringInsertResourceEvent);
    connection.query(queryStringInsertResourceEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for resource events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// ADD_PURCHASED_RESOURCE
app.put(`/purchases/tribute-stats/resources/put/:email/:formattedType`, (req, res) => {
    const { email, formattedType } = req.params;
    const queryStringAddPurchasedResource = `UPDATE tribute_stats SET ${formattedType}_used = 
    ${formattedType}_used + 1 WHERE email = '${email}'`;
    console.log(queryStringAddPurchasedResource);
    connection.query(queryStringAddPurchasedResource, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// ADD_IMMUNITY
app.put(`/purchases/tribute-stats/immunity/put/:email`, (req, res) => {
    const email = req.params.email;
    const queryStringGiveImmunity = `UPDATE tribute_stats SET has_immunity = 
    1 WHERE email = '${email}'`;
    console.log(queryStringGiveImmunity);
    connection.query(queryStringGiveImmunity, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

//######################## (8) Game State Management #########################//

// FETCH_SERVER_TIME
app.get(`/game-state/get/server-time`, (req, res) => {
    const queryStringGetGameState = `SELECT CURRENT_TIMESTAMP`;
    console.log(queryStringGetGameState);
    connection.query(queryStringGetGameState, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for timestamp: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_GAMESTATE
app.get(`/game-state/get`, (req, res) => {
    const queryStringGetGameState = `SELECT * FROM game_state`;
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

// FETCH_PRICE_TIER
app.get(`/game-state/get/price-tier`, (req, res) => {
    const queryStringGetGameState = `SELECT current_price_tier FROM game_state`;
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

// UPDATE_GAME_STATE
app.put(`/game-state/put/:maxDistricts/:areas/:food_required/:water_required/:medicine_required/:current_price_tier/:game_active`, (req, res) => {
    const { 
        maxDistricts, 
        areas, 
        food_required,
        water_required,
        medicine_required,
        current_price_tier,
        game_active
    } = req.params;
    const queryStringUpdateGameState = `UPDATE game_state SET max_districts = '${maxDistricts}', areas = '${areas}',
    food_required = ${food_required}, water_required = ${water_required}, medicine_required = ${medicine_required},
    current_price_tier = ${current_price_tier}, game_active = ${game_active}`;
    console.log(queryStringUpdateGameState);
    connection.query(queryStringUpdateGameState, (err, rows, fields) => {
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

//##################### (9) Tribute Stats and Dashboard ######################//

// FETCH_TRIBUTE_STAT
app.get(`/tribute-stats/get/single/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringGetTributeStat = `SELECT * FROM tribute_stats WHERE id = '${id}'`;
    console.log(queryStringGetTributeStat);
    connection.query(queryStringGetTributeStat, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// FETCH_TRIBUTE_STAT_BY_EMAIL
app.get(`/tribute-stats/get/single/email/:email`, (req, res) => {
    const email = req.params.email;
    const queryStringGetTributeStat = `SELECT * FROM tribute_stats WHERE email = '${email}'`;
    console.log(queryStringGetTributeStat);
    connection.query(queryStringGetTributeStat, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// FETCH_TRIBUTE_STATS
app.get(`/tribute-stats/get/list/:email`, (req, res) => {
    const email = req.params.email;
    const queryStringGetTributeStats = `SELECT * FROM tribute_stats WHERE mentor_email = '${email}'`;
    console.log(queryStringGetTributeStats);
    connection.query(queryStringGetTributeStats, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// FETCH_ALL_TRIBUTE_STATS
app.get(`/tribute-stats/get/all`, (req, res) => {
    const queryStringGetAllTributeStats = `SELECT * FROM tribute_stats`;
    console.log(queryStringGetAllTributeStats);
    connection.query(queryStringGetAllTributeStats, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// FETCH_ALL_TRIBUTE_STATS_LIMITED
app.get(`/tribute-stats/get/limited`, (req, res) => {
    const queryStringGetAllTributeStatsLimited = `SELECT id, first_name, last_name, funds_remaining,
    lives_remaining, lives_lost, kill_count FROM tribute_stats`;
    console.log(queryStringGetAllTributeStatsLimited);
    connection.query(queryStringGetAllTributeStatsLimited, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// UPDATE_TRIBUTE_STATS
app.put(`/tribute-stats/put/:id/:fUsed/:fMissed/:wUsed/:wMissed/:mUsed/:mMissed/:rUsed/:gUsed/:lRemaining/:lResources/:lExempt/:lPurchased/:lLost/:killCount/:immunity`, (req, res) => {
    const {
        id,
        fUsed,
        fMissed,
        wUsed,
        wMissed,
        mUsed,
        mMissed,
        rUsed,
        gUsed,
        lRemaining,
        lResources,
        lExempt,
        lPurchased,
        lLost,
        killCount,
        immunity
    } = req.params;
    const queryStringUpdateTributeStats = `UPDATE tribute_stats SET food_used = ${fUsed},
    food_missed = ${fMissed}, water_used = ${wUsed}, water_missed = ${wMissed}, 
    medicine_used = ${mUsed}, medicine_missed = ${mMissed}, roulette_used = ${rUsed},
    golden_used = ${gUsed}, lives_remaining = ${lRemaining}, life_resources = ${lResources},
    lives_exempt = ${lExempt}, lives_purchased = ${lPurchased}, lives_lost = ${lLost},
    kill_count = ${killCount}, has_immunity = ${immunity} WHERE id = ${id}`;
    console.log(queryStringUpdateTributeStats);
    connection.query(queryStringUpdateTributeStats, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tribute stats: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

//############################ (10) Global Events ############################//

// FETCH_GLOBAL_EVENT
app.get(`/global-events/get/single/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringGetGlobalEvent = `SELECT * FROM global_events WHERE id = ${id}`;
    console.log(queryStringGetGlobalEvent);
    connection.query(queryStringGetGlobalEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for global events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// FETCH_ALL_GLOBAL_EVENTS
app.get(`/global-events/get/all`, (req, res) => {
    const queryStringGetAllGlobalEvent = `SELECT * FROM global_events`;
    console.log(queryStringGetAllGlobalEvent);
    connection.query(queryStringGetAllGlobalEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for global events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// FETCH_GLOBAL_EVENTS_BY_STATUS
app.get(`/global-events/get/list`, (req, res) => {
    const queryStringGetGlobalEvents = `SELECT * FROM global_events WHERE status = 'active' OR status = 'completed'`;
    console.log(queryStringGetGlobalEvents);
    connection.query(queryStringGetGlobalEvents, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for global events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// CREATE_GLOBAL_EVENT
app.post(`/global-events/post/:type/:description/:message/:notificationTime/:endTime/:actionCode`, (req, res) => {
    const { type, description, message, notificationTime, endTime, actionCode } = req.params;
    const queryStringCreateGlobalEvent = `INSERT INTO global_events (type, description, message,
        notification_time, event_end_time, action_code, status) VALUES
        ('${type}', '${description}', '${message}', ${notificationTime}, ${endTime},
        ${actionCode}, 'hidden')`;
    console.log(queryStringCreateGlobalEvent);
    connection.query(queryStringCreateGlobalEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for global events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// UPDATE_GLOBAL_EVENT
app.put(`/global-events/put/:id/:type/:description/:message/:notificationTime/:endTime/:actionCode`, (req, res) => {
    const { id, type, description, message, notificationTime, endTime, actionCode } = req.params;
    const queryStringUpdateGlobalEvent = `UPDATE global_events SET type = '${type}', 
    description = '${description}', message = '${message}', notification_time = ${notificationTime},
    event_end_time = ${endTime}, action_code = ${actionCode} WHERE id = ${id}`;
    console.log(queryStringUpdateGlobalEvent);
    connection.query(queryStringUpdateGlobalEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for global events: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// DELETE_GLOBAL_EVENT
app.delete(`/global-events/delete/:id`, (req, res) => {
    const id = req.params.id;
    const queryStringDeleteGlobalEvent = `DELETE FROM global_events WHERE id = ${id}`;
    console.log(queryStringDeleteGlobalEvent);
    connection.query(queryStringDeleteGlobalEvent, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for global events: ' + err);
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