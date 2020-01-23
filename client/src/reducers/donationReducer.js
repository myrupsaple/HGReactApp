import { FETCH_DONATION } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_DONATION:
            const donation = action.payload[0];
            if(!donation){
                return {};
            }
            return {
                id: donation.id,
                tribute_email: donation.tribute_email,
                donor_name: donation.donor_name,
                method: donation.method,
                date: donation.date,
                amount: donation.amount,
                tags: donation.tags
            };
        default:
            return state;
    }
};