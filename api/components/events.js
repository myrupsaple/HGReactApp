const checkForEvents = async (connection) => {
    var eventsCreated = false;
    var gameStateCreated = false;
    var gameActive = false;

    var counter = 1;
    while(1){
        if(!eventsCreated || !gameStateCreated || !gameActive){
            await connection.query(`SHOW TABLES`, (err, results, fields) => {
                if(err){
                    console.log('Failed to query for tables: ' + err);
                    return;
                }
                const res = results.map(table => {
                    return table.Tables_in_hgapp;
                });
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

        console.log(`Checked for events (${counter}) (${currentTime})`);
        counter ++;
    }
}

// CODE LIST: (1) add food required, (3) add water required, (5) add medicine required, 
// (2) enforce food requirement, (4) enforce water requirement, (6) enforce medicine requirement,
// (7) special requirement (use description), (8) message only,
// (0) do nothing
// (101) update costs to tier 1, (102) update costs to tier 2, (103) update costs to tier 3,
// (104) update costs to tier 4
// STATUS CODES: 
// 'hidden', 'active', 'completed'

const handleEvents = async (event, currentState, connection) => {
    if(currentState === 'hidden'){
        // TODO: Announce event and deadline
        const queryStringUpdateEvent = `UPDATE global_events SET status = 'active' WHERE id = ${event.id}`;
        connection.query(queryStringUpdateEvent, (err, results, fields) => {
            if (err) {
                console.log('Failed to query for events: ' + err);
                return;
            }})
    } else if (currentState === 'active'){
        // TODO: Perform any actions required for those who did not meet the requirements (if any)

        const queryStringUpdateEvent = `UPDATE global_events SET status = 'completed' WHERE id = ${event.id}`;
        connection.query(queryStringUpdateEvent, (err, results, fields) => {
            if (err) {
                console.log('Failed to query for events: ' + err);
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