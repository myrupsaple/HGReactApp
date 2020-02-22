const checkForEvents = async (connection) => {
    var eventsCreated = false;
    var gameStateCreated = false;
    var gameActive = false;

    var counter = 1;
    while(1){
        if(!eventsCreated || !gameStateCreated || !gameActive){
            await connection.query(`SHOW TABLES`, async (err, results, fields) => {
                if(err){
                    console.log('Failed to query for tables: ' + err);
                    return;
                }
                const res = results.map(table => {
                    return Object.values(table)[0];
                });
                
                await Wait (5000);

                if(res.includes('global_events')){
                    eventsCreated = true;
                } else {
                    eventsCreated = false;
                    console.log('Global Events not yet created...');
                }
                if(res.includes('game_state')){
                    gameStateCreated = true;
                    connection.query(`SELECT game_active FROM game_state`, (err, results, fields) => {
                        if(err){
                            console.log('Failed to query for tables: ' + err);
                            return;
                        }
                        if(results[0].game_active){
                            gameActive = true;
                            console.log('Game is active. Event searching will begin in 15 seconds...');
                        } else {
                            console.log('Game is not active.');
                        }
                    })
                } else {
                    gameStateCreated = true;
                    console.log('Game State is not yet created...')
                }
            });
        }

        if(gameActive){
            await connection.query(`SELECT game_active FROM game_state`, (err, results, fields) => {
                if(err){
                    console.log('Failed to query for tables: ' + err);
                    return;
                }
                if(results[0].game_active === 0){
                    gameActive = false;
                    console.log('Game is no longer active. Events will be processed once game is made active again.');
                }
            })
        }

        await Wait(15000);

        if(!eventsCreated || !gameStateCreated || !gameActive){
            continue;
        }

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Processes the announcement of events that have just been activated
        const queryStringGetHidden = `SELECT * FROM global_events WHERE notification_time <= ${currentTime} AND status = 'hidden'`;
        connection.query(queryStringGetHidden, (err, results, fields) => {
            if (err){
                console.log('Failed to query for events: ' + err);
                return;
            }
            for (let event of results){
                handleEvents(event, 'hidden', connection);
            }
        });

        // Processes the closure of events that have expired
        const queryStringGetVisible = `SELECT * FROM global_events WHERE event_end_time <= ${currentTime} AND status = 'active'`;
        connection.query(queryStringGetVisible, (err, results, fields) => {
            if (err){
                console.log('Failed to query for events: ' + err);
                return;
            }
            for (let event of results){
                handleEvents(event, 'active', connection);
            }
        });

        // Zeroes out any negative life values
        const queryStringZeroNegativeLives = `UPDATE tribute_stats SET lives_remaining = 0 WHERE lives_remaining < 0`;
        connection.query(queryStringZeroNegativeLives, (err, results, fields) => {
            if (err){
                console.log('Failed to query tribute stats: ' + err);
                return;
            }
        });

        console.log(`Checked for events (${counter}) (${currentTime})`);
        counter ++;
    }
}

// CODE LIST: (1) add food required & enforce, (2) add water required & enforce, (3) add medicine required & enforce, 
// (4) special requirement (use description), (5) message only,
// (0) do nothing
// (101) update costs to tier 1, (102) update costs to tier 2, (103) update costs to tier 3,
// (104) update costs to tier 4
// STATUS CODES: 
// 'hidden', 'active', 'completed'

const handleEvents = async (event, currentState, connection) => {
    if(currentState === 'hidden'){
        const queryStringUpdateEvent = `UPDATE global_events SET status = 'active' WHERE id = ${event.id}`;
        connection.query(queryStringUpdateEvent, (err, results, fields) => {
            if (err) {
                console.log('Failed to query for events: ' + err);
                return;
            }})
    } else if (currentState === 'active'){
        const queryStringUpdateEvent = `UPDATE global_events SET status = 'completed' WHERE id = ${event.id}`;
        connection.query(queryStringUpdateEvent, (err, results, fields) => {
            if (err) {
                console.log('Failed to query for events: ' + err);
                return;
            }})
        
        const actionCode = event.action_code;
        var queryString = '';
        var queryString2 = '';
        switch(actionCode){
            case 1:
                queryString = `UPDATE game_state SET food_required = food_required + 1`;
                queryString2 = `UPDATE tribute_stats SET food_missed = food_missed + 1, 
                lives_remaining = lives_remaining - 1 WHERE food_used + food_missed < (SELECT food_required FROM game_state) + 1`;
                break;
            case 2:
                queryString = `UPDATE game_state SET water_required = water_required + 1`;
                queryString2 = `UPDATE tribute_stats SET water_missed = water_missed + 1, 
                lives_remaining = lives_remaining - 1 WHERE water_used + water_missed < (SELECT water_required FROM game_state) + 1`;
                break;
            case 3:
                queryString = `UPDATE game_state SET medicine_required = medicine_required + 1`;
                queryString2 = `UPDATE tribute_stats SET medicine_missed = medicine_missed + 1, 
                lives_remaining = lives_remaining - 1 WHERE medicine_used + medicine_missed < (SELECT medicine_required FROM game_state) + 1`;
                break;
            case 101:
                queryString = `UPDATE game_state SET current_price_tier = 1`;
                break;
            case 102:
                queryString = `UPDATE game_state SET current_price_tier = 2`;
                break;
            case 103:
                queryString = `UPDATE game_state SET current_price_tier = 3`;
                break;
            case 104:
                queryString = `UPDATE game_state SET current_price_tier = 4`;
                break;
        }

        // Do this first because the async await isn't reliable
        // queryString2 is configured with a +1 to account for the fact that the
        // queryString1 query hasn't been sent yet.
        if(queryString2 !== ''){
            console.log(queryString2);
            await connection.query(queryString2, (err, results, fields) => {
                if (err) {
                    console.log('Failed to query (2): ' + err);
                    return;
                }})
        }

        console.log(queryString);
        await connection.query(queryString, (err, results, fields) => {
            if (err) {
                console.log('Failed to query: ' + err);
                return;
            }})
    }
}

const Wait = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

exports.checkForEvents = checkForEvents;