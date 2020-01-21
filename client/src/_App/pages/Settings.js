import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../actions';

class Settings extends React.Component {
    componentDidMount(){
        this.props.setNavBar('app');
    }

    render(){
        return(
            <>
                Settings
            </>
        );
    }
}

export default connect(null, { setNavBar })(Settings);