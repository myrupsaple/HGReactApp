import React from 'react';
import AppNavBar from '../components/AppNavBar';
import { connect } from 'react-redux';

class Messaging extends React.Component {
    render(){
        return(
            <div>
                <AppNavBar />
                <div className="ui-container">
                    Messaging for {this.props.perms}
                </div>
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