import { FETCH_PURCHASE } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_PURCHASE:
            const purchase = action.payload;
            if(!purchase){
                return {};
            }
            return {
                id: purchase.id,
                time: purchase.time,
                status: purchase.status,
                mentor_email: purchase.mentor_email,
                payer_email: purchase.payer_email,
                receiver_email: purchase.receiver_email,
                type: purchase.type,
                secondary_description: purchase.secondary_description,
                cost: purchase.cost
            };
        default:
            return state;
    }
};