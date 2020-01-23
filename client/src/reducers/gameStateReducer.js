import {
    FETCH_GAMESTATE
} from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_GAMESTATE:
            return { ...state, ...action.payload[0]};
        default:
            return state;
    }
};