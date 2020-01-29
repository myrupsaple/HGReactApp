import {
    FETCH_ITEMS,
    FETCH_ALL_ITEMS
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_ITEMS:
            return { ..._.mapKeys(action.payload, 'id')};
        case FETCH_ALL_ITEMS:
            return { ..._.mapKeys(action.payload, 'id')};
        default:
            return state;
    }
};