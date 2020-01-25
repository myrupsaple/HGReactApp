import {
    FETCH_RESOURCE_EVENTS,
    FETCH_ALL_RESOURCE_EVENTS,
    CLEAR_RESOURCE_EVENT_QUEUE
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case CLEAR_RESOURCE_EVENT_QUEUE:
            return { };
        case FETCH_RESOURCE_EVENTS:
            return { ...state, ..._.mapKeys(action.payload, 'id')};
        case FETCH_ALL_RESOURCE_EVENTS:
            return { ..._.mapKeys(action.payload, 'id')};
        default:
            return state;
    }
};