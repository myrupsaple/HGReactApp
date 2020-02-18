import { FETCH_TRIBUTE_STAT } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_TRIBUTE_STAT:
        const stats = action.payload;
            if(!stats){
                return {};
            }
            return {
                id: stats.id,
                first_name: stats.first_name,
                last_name: stats.last_name,
                email: stats.email,
                funds_remaining: stats.funds_remaining,
                total_donations: stats.total_donations,
                total_purchases: stats.total_purchases,
                food_used: stats.food_used,
                food_missed: stats.food_missed,
                water_used: stats.water_used,
                water_missed: stats.water_missed,
                medicine_used: stats.medicine_used,
                medicine_missed: stats.medicine_missed,
                roulette_used: stats.roulette_used,
                golden_used: stats.golden_used,
                lives_remaining: stats.lives_remaining,
                life_resources: stats.life_resources,
                lives_exempt: stats.lives_exempt,
                lives_purchased: stats.lives_purchased,
                lives_lost: stats.lives_lost,
                kill_count: stats.kill_count,
                has_immunity: stats.has_immunity
            };
        default:
            return state;
    }
};