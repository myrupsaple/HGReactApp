import { FETCH_DONATION } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_DONATION:
            const donationObject = {..._.mapKeys(action.payload.response, 'id')};
            const donation = donationObject[action.payload.id];
            if(!donation){
                return {};
            }
            return {
                id: donation.id,
                tribute_email: donation.tribute_email,
                donor_name: donation.donor_name,
                method: donation.method,
                date: donation.date,
                amount: donation.amount
            };
        default:
            return state;
    }
};