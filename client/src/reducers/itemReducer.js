import { FETCH_ITEM } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_ITEM:
            const item = action.payload;
            if(!item){
                return {};
            }
            return {
                id: item.id,
                item_name: item.item_name,
                description: item.description,
                quantity: item.quantity,
                tier1_cost: item.tier1_cost,
                tier2_cost: item.tier2_cost,
                tier3_cost: item.tier3_cost,
                tier4_cost: item.tier4_cost
            };
        default:
            return state;
    }
};