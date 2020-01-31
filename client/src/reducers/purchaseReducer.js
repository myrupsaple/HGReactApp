import { FETCH_PURCHASE } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_PURCHASE:
            const purchase = action.payload;
            console.log(purchase);
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
                item: purchase.item,
                category: purchase.category,
                cost: purchase.cost,
                quantity: purchase.quantity
            };
        default:
            return state;
    }
};