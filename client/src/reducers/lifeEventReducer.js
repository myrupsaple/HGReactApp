import { FETCH_LIFE_EVENT } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_LIFE_EVENT:
            const lifeEventObject = {..._.mapKeys(action.payload.response, 'id')};
            const lifeEvent = lifeEventObject[action.payload.id];
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