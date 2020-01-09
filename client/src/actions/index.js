import users from '../api/users';

import {
    SIGN_IN,
    SIGN_OUT,
    FETCH_USER
} from './types';

export const signIn = (userEmail) => async (dispatch) => {
    const response = await users.get(`/user/${userEmail}`);
    const data = response.data[0];
    const { id, first_name, last_name, email, permissions } = data;
    
    console.log(data);

    dispatch ({
        type: SIGN_IN,
        payload: {
            id,
            first_name,
            last_name,
            email,
            permissions
        }
    });
};

export const signOut = () => (dispatch) => {
    dispatch ({
        type: SIGN_OUT
    });
};

export const fetchUser = () => (dispatch) => {
    dispatch ({
        type: FETCH_USER
    });
}