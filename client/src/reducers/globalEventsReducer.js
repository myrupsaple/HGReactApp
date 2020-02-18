import {
    FETCH_GLOBAL_EVENTS,
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_GLOBAL_EVENTS:
            return { ..._.mapKeys(action.payload, 'id')};
        default:
            return state;
    }
};