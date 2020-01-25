import { FETCH_RESOURCE_LIST_ITEM } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_RESOURCE_LIST_ITEM:
            const item = action.payload[0];
            if(!item){
                return {};
            }
            return {
                id: item.id,
                code: item.code,
                type: item.type,
                times_used: item.times_used,
                max_uses: item.max_uses,
                used_by: item.used_by,
                notes: item.notes,
            };
        default:
            return state;
    }
};