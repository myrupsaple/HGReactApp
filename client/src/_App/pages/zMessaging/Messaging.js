import React from 'react';
import AppNavBar from '../../components/AppNavBar';
import { connect } from 'react-redux';

class Messaging extends React.Component {
    render(){
        return(
            <div>
                <AppNavBar />
                Messaging for {this.props.perms}
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        perms: state.auth.userPerms
    };
};

export default connect(mapStateToProps)(Messaging);