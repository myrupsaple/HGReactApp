import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
    firstSignIn: true,
    isSignedIn: false,
    userId: null,
    userFirstName: null,
    userLastName: null,
    userEmail: null,
    userPerms: null
};

export default (state = INITIAL_STATE, action) => {
    console.log('a ' + state.firstSignIn)
    switch (action.type) {
        case SIGN_IN:
            console.log(action.type);
            return {
                ...state, 
                firstSignIn: false,
                isSignedIn: true,
                userId: action.payload.id,
                userFirstName: action.payload.first_name,
                userLastName: action.payload.last_name,
                userEmail: action.payload.email,
                userPerms: action.payload.permissions
            };
        case SIGN_OUT:
            console.log(action.type);
            return {
                ...state, 
                firstSignIn: false,
                isSignedIn: false, 
                userId: null,
                userFirstName: null,
                userLastName: null,
                userEmail: null,
                userPerms: null
            };
        default:
            return state;
    }
};