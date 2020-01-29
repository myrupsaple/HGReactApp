import {
    FETCH_ALL_PURCHASES,
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_ALL_PURCHASES:
            return { ..._.mapKeys(action.payload, 'id')};
        default:
            return state;
    }
};