import { FETCH_ALL_TRIBUTES } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_ALL_TRIBUTES:
            return { ..._.mapKeys(action.payload, 'id') };
        default:
            return state;
    }
};