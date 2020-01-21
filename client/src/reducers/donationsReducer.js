import {
    FETCH_DONATIONS,
    FETCH_ALL_DONATIONS,
    CLEAR_DONATIONS_QUEUE
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case CLEAR_DONATIONS_QUEUE:
            return { };
        case FETCH_DONATIONS:
            return { ...state, ..._.mapKeys(action.payload, 'id')};
        case FETCH_ALL_DONATIONS:
            return { ..._.mapKeys(action.payload, 'id')};
        default:
            return state;
    }
};