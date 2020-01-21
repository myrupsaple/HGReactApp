import {
    FETCH_GAMESTATE
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_GAMESTATE:
            return { ...state, ...action.payload[0]};
        default:
            return state;
    }
};