import {
    FETCH_LIFE_EVENTS,
    FETCH_ALL_LIFE_EVENTS,
    CLEAR_LIFE_EVENTS_QUEUE
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case CLEAR_LIFE_EVENTS_QUEUE:
            return { };
        case FETCH_LIFE_EVENTS:
            return { ...state, ..._.mapKeys(action.payload, 'id')};
        case FETCH_ALL_LIFE_EVENTS:
            return { ..._.mapKeys(action.payload, 'id')};
        default:
            return state;
    }
};