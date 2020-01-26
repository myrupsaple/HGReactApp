import { FETCH_USER } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_USER:
            const user = action.payload.response;
            if(!user){
                return {};
            }
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                permissions: user.permissions
            };
        default:
            return state;
    }
};