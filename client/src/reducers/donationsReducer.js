import {
    FETCH_DONATIONS,
    FETCH_ALL_DONATIONS
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_DONATIONS:
        case FETCH_ALL_DONATIONS:
            return { ..._.mapKeys(action.payload, 'id')};
        default:
            return state;
    }
};