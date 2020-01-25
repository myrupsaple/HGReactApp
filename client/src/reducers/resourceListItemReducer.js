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
                tribute_email: item.tribute_email,
                type: item.type,
                method: item.method,
                time: item.time,
                notes: item.notes,
            };
        default:
            return state;
    }
};