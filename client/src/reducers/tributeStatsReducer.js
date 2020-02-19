import { 
    FETCH_TRIBUTE_STATS, 
    FETCH_ALL_TRIBUTE_STATS,
    FETCH_ALL_TRIBUTE_STATS_LIMITED
 } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_TRIBUTE_STATS:
        case FETCH_ALL_TRIBUTE_STATS:
        case FETCH_ALL_TRIBUTE_STATS_LIMITED:
            return { ..._.mapKeys(action.payload, 'id') };
        default:
            return state;
    }
};