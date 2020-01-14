import { FETCH_USER } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_USER:
            const userObject = {..._.mapKeys(action.payload.response, 'id')};
            const user = userObject[action.payload.id];
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