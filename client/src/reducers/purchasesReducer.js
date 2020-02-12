import {
    FETCH_PURCHASES,
    FETCH_ALL_PURCHASES,
    CLEAR_PURCHASES_QUEUE
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case CLEAR_PURCHASES_QUEUE:
            return {}
        case FETCH_PURCHASES:
            return { ...state, ..._.mapKeys(action.payload, 'id')};
        case FETCH_ALL_PURCHASES:
            return { ..._.mapKeys(action.payload, 'id')};
        default:
            return state;
    }
};