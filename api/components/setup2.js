const runSetup = async (connection) => {
    await connection.connect((err) => {
        if(err) {
            return console.log('error: ' + err.message);
        }

        connection.query(`SHOW TABLES`, async (err, results, fields) => {
            var res = {};

            if(err) {
                console.log(err.message);
            }
    
            const createUsers = `CREATE TABLE users(
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(20),
                last_name VARCHAR(20),
                email VARCHAR(40),
                permissions VARCHAR(10)
            )`;
    
            const createTributes = `CREATE TABLE tributes(
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(20),
                last_name VARCHAR(20),
                email VARCHAR(40),
                phone VARCHAR(12),
                district TINYINT,
                districtPartner_email VARCHAR(40),
                area VARCHAR(15),
                mentor_email VARCHAR(40),
                paid_registration TINYINT(1)
            )`;
    
            const createTributeStats = `CREATE TABLE tribute_stats(
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(20),
                last_name VARCHAR(20),
                email VARCHAR(40),
                mentor_email VARCHAR(40),
                funds_remaining INT DEFAULT 0,
                total_donations INT DEFAULT 0,
                total_purchases INT DEFAULT 0,
                food_used TINYINT DEFAULT 0,
                food_missed TINYINT DEFAULT 0,
                water_used TINYINT DEFAULT 0,
                water_missed TINYINT DEFAULT 0,
                medicine_used TINYINT DEFAULT 0,
                medicine_missed TINYINT DEFAULT 0,
                roulette_used TINYINT DEFAULT 0,
                golden_used TINYINT DEFAULT 0,
                lives_remaining TINYINT DEFAULT 1,
                life_resources TINYINT DEFAULT 0,
                lives_exempt TINYINT DEFAULT 1,
                lives_purchased TINYINT DEFAULT 0,
                lives_lost TINYINT DEFAULT 0,
                kill_count TINYINT DEFAULT 0,
                has_immunity BOOL DEFAULT 0
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
    
            const createResourceList = `CREATE TABLE resource_list(
                id INT PRIMARY KEY AUTO_INCREMENT,
                code VARCHAR(50),
                type VARCHAR(10),
                times_used TINYINT,
                max_uses TINYINT,
                used_by VARCHAR(300),
                notes VARCHAR(75)
            )`;
    
            const createResourceEvents = `CREATE TABLE resource_events(
                id INT PRIMARY KEY AUTO_INCREMENT,
                tribute_email VARCHAR(40),
                type VARCHAR(15),
                method VARCHAR(10),
                time INT,
                notes VARCHAR(75)
            )`;
    
            const createLifeEvents = `CREATE TABLE life_events(
                id INT PRIMARY KEY AUTO_INCREMENT,
                tribute_email VARCHAR(40),
                type VARCHAR(10),
                method VARCHAR(20),
                time INT,
                notes VARCHAR(75)
            )`;
    
            const createItemList = `CREATE TABLE item_list(
                id INT PRIMARY KEY AUTO_INCREMENT,
                item_name VARCHAR(30),
                description VARCHAR(100),
                quantity TINYINT,
                tier1_cost INT,
                tier2_cost INT,
                tier3_cost INT,
                tier4_cost INT
            )`;
    
            const createSpecialItems = `INSERT INTO item_list 
                (id, item_name, description, quantity, tier1_cost, tier2_cost, tier3_cost, tier4_cost) 
                VALUES 
                (100, 'life', 'life', 1, 45, 70, 100, 150),
                (200, 'immunity', 'immunity', 1, 300, 300, 300, 300),
                (300, 'golden_resource', 'golden resource', 1, 300, 300, 300, 300),
                (301, 'food_resource', 'food resource', 1, 80, 100, 100, 100),
                (302, 'water_resource', 'water resource', 1, 100, 100, 120, 120),
                (303, 'medicine_resource', 'medicine resource', 1, 75, 100, 125, 125),
                (1000, 'placeholder', 'none', 0, 0, 0, 0, 0)`;
    
            const createPurchases = `CREATE TABLE purchases(
                id INT PRIMARY KEY AUTO_INCREMENT,
                time INT,
                status VARCHAR(10),
                mentor_email VARCHAR(40),
                payer_email VARCHAR(40),
                receiver_email VARCHAR(40),
                category VARCHAR(10),
                item_name VARCHAR(25),
                item_id INT,
                cost INT,
                quantity TINYINT,
                notes VARCHAR(50)
            )`;
    
            const createGameState = `CREATE TABLE game_state(
                start_time DATETIME,
                tributes_remaining TINYINT,
                max_districts TINYINT,
                areas VARCHAR(100),
                food_required TINYINT,
                water_required TINYINT,
                medicine_required TINYINT,
                current_price_tier TINYINT,
                game_active BOOL DEFAULT 0
            )`;
    
            const setGameState = `INSERT INTO game_state (start_time, tributes_remaining,
                max_districts, food_required, water_required, medicine_required, current_price_tier) 
                VALUES (CURRENT_TIMESTAMP(), 24, 12, 'Hedrick,Riber,SunSprout,Dank Denykstra,Off Campus', 
                0, 0, 0, 1)`;
    
            const createGlobalEvents = `CREATE TABLE global_events(
                id INT PRIMARY KEY AUTO_INCREMENT,
                type VARCHAR(20),
                description VARCHAR(200),
                message VARCHAR(200),
                notification_time INT,
                event_end_time INT,
                action_code TINYINT,
                status VARCHAR(10)
            )`;

            // TODO: Find a way to get this from either game_state or current_timestamp
            const time = 660;

            const createSpecialEvents = `INSERT INTO global_events (type, description, message,
                notification_time, event_end_time, action_code, status) VALUES ('tier1_cost_start',
                'Time when tier 1 prices kick in', 'Tier 1 prices active', ${time}, ${time}, 
                101, 'hidden'), ('tier2_cost_start', 'Time when tier 2 prices kick in', 'Tier 2 prices active', 
                ${time}, ${time} + 60, 102, 'hidden'), ('tier3_cost_start', 'Time when tier 3 prices kick in', 
                'Tier 3 prices active', ${time} + 60, ${time} + 150, 103, 'hidden'), ('tier4_cost_start',
                'Time when tier 4 prices kick in', 'Tier 4 prices active', ${time} + 150, ${time} + 210, 
                104, 'hidden')`;

            const createSpecialEventsPlaceholder = `INSERT INTO global_events (id, type, description, message,
                notification_time, event_end_time, action_code, status) VALUES (10, 'PLACEHOLDER', 'NULL',
                'NULL', 10000, 10000, 0, 'hidden')`;

            res = results.map(table => {
                return table.Tables_in_hgapp;
            });
    
            const tableList = {
                users: false,
                tributes: false,
                tribute_stats:false,
                donations: false,
                resource_list: false,
                resource_events: false,
                life_events: false,
                item_list: false,
                purchases: false,
                game_state: false,
                global_events: false
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
                    case 'resource_list':
                        tableList.resource_list = true;
                        break;
                    case 'resource_events':
                        tableList.resource_events = true;
                        break;
                    case 'life_events':
                        tableList.life_events = true;
                        break;
                    case 'item_list':
                        tableList.item_list = true;
                        break;
                    case 'purchases':
                        tableList.purchases = true;
                        break;
                    case 'game_state':
                        tableList.game_state = true;
                        break;
                    case 'global_events':
                        tableList.global_events = true;
                        break;
                    default:
                        break;
                }
            }

            console.log(tableList);
            await Wait(1000);
            console.log(tableList);
            
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
            if(!tableList.resource_list){
                connection.query(createResourceList, (err, results, fields) => {
                    if(err){
                        console.log(err.message);
                    }
                });
            }
            if(!tableList.resource_events){
                connection.query(createResourceEvents, (err, results, fields) => {
                    if(err){
                        console.log(err.message);
                    }
                });
            }
            if(!tableList.life_events){
                connection.query(createLifeEvents, (err, results, fields) => {
                    if(err){
                        console.log(err.message);
                    }
                });
            }
            if(!tableList.item_list){
                connection.query(createItemList, (err, results, fields) => {
                    if(err){
                        console.log(err.message);
                    }
                });
                connection.query(createSpecialItems, (err, results, fields) => {
                    if(err){
                        console.log(err.message);
                    }
                });
            }
            if(!tableList.purchases){
                connection.query(createPurchases, (err, results, fields) => {
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
                connection.query(setGameState, (err, results, fields) => {
                    if(err) {
                        console.log(err.message);
                    }
                });
            }
            if(!tableList.global_events){
                connection.query(createGlobalEvents, (err, results, fields) => {
                    if(err) {
                        console.log(err.message);
                    }
                });
                connection.query(createSpecialEvents, (err, results, fields) => {
                    if(err) {
                        console.log(err.message);
                    }
                });
                connection.query(createSpecialEventsPlaceholder, (err, results, fields) => {
                    if(err) {
                        console.log(err.message);
                    }
                });
            }
    
        })
    });
}

const Wait = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

exports.runSetup = runSetup;