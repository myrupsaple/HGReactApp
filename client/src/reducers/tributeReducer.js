import { FETCH_TRIBUTE } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_TRIBUTE:
            const tributeObject = {..._.mapKeys(action.payload.response, 'id')};
            const tribute = tributeObject[action.payload.id];
            if(!tribute){
                return {};
            }
            return {
                id: tribute.id,
                first_name: tribute.first_name,
                last_name: tribute.last_name,
                email: tribute.email,
                district: tribute.district,
                districtPartner: tribute.districtPartner_email,
                area: tribute.area,
                mentor: tribute.mentor_email,
                paidRegistration: tribute.paid_registration,
            };
        default:
            return state;
    }
};