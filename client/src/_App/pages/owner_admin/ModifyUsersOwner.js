import React from 'react';
import { connect } from 'react-redux';

import { fetchUsers } from '../../../actions';
import AppNavBar from '../../components/AppNavBar';

class ModifyUsersOwner extends React.Component {
    componentDidMount () {
        this.props.fetchUsers();
    }

    renderUsers(){
        if(Object.keys(this.props.users).length === 0){
            console.log('Length of users is zero');
            return null;
        }
        return this.props.users.map(user => {
            return(
                <div className="item" key={user.id}>
                    <div className="content">
                        {user.first_name} ||
                        {user.last_name} ||
                        {user.email} ||
                        {user.permissions} 
                    </div>
                </div>
            );
        });
    }

    render() {
        return(
            <div>
                <AppNavBar />

                <div className="ui header">
                    Current List of Users:
                </div>
                {this.renderUsers()}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return{
        users: Object.values(state.users)
    }
};

export default connect(mapStateToProps, { fetchUsers })(ModifyUsersOwner);