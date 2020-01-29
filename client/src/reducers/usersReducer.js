import {
    FETCH_USERS, 
    FETCH_ALL_MENTORS,
    FETCH_ALL_USERS
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_USERS:
        case FETCH_ALL_MENTORS:
        case FETCH_ALL_USERS:
            return { ..._.mapKeys(action.payload, 'id') };
        default:
            return state;
    }
}