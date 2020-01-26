import { FETCH_RESOURCE_EVENT } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_RESOURCE_EVENT:
            const event = action.payload.response;
            if(!event){
                return {};
            }
            return {
                id: event.id,
                tribute_email: event.tribute_email,
                type: event.type,
                method: event.method,
                time: event.time,
                notes: event.notes,
            };
        default:
            return state;
    }
};