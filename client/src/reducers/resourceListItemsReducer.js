import {
    FETCH_RESOURCE_LIST_ITEMS,
    FETCH_ALL_RESOURCE_LIST_ITEMS,
    CLEAR_RESOURCE_LIST_QUEUE
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case CLEAR_RESOURCE_LIST_QUEUE:
            return { };
        case FETCH_RESOURCE_LIST_ITEMS:
            return { ...state, ..._.mapKeys(action.payload, 'id')};
        case FETCH_ALL_RESOURCE_LIST_ITEMS:
            return { ..._.mapKeys(action.payload, 'id')};
        default:
            return state;
    }
};