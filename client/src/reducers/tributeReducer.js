import { FETCH_TRIBUTE } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_TRIBUTE:
        const tribute = action.payload.response;
            if(!tribute){
                return {};
            }
            return {
                id: tribute.id,
                first_name: tribute.first_name,
                last_name: tribute.last_name,
                email: tribute.email,
                phone: tribute.phone,
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