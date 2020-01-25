import { SET_NAVBAR } from '../actions/types';

const DEFAULT_STATE = {
    navType: 'none',
}

export default (state = DEFAULT_STATE, action) => {
    switch(action.type){
        case SET_NAVBAR:
            return {...state, [action.payload.id]: action.payload.value}
        default:
            return state;
    }
}