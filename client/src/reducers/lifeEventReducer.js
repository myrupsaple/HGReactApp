import { FETCH_LIFE_EVENT } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_LIFE_EVENT:
            const lifeEvent = action.payload.response;
            if(!lifeEvent){
                return {};
            }
            return {
                id: lifeEvent.id,
                tribute_email: lifeEvent.tribute_email,
                type: lifeEvent.type,
                method: lifeEvent.method,
                time: lifeEvent.time,
                notes: lifeEvent.notes,
            };
        default:
            return state;
    }
};