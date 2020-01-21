import React from 'react';
import { connect } from 'react-redux';
import NavBar from '../_Website/components/NavBar';
import AppNavBar from '../_App/components/AppNavBar';

class RenderNav extends React.Component {
    setNavBar(){
        if(this.props.navType === 'app'){
            return <AppNavBar />
        } else if(this.props.navType === 'web'){
            return <NavBar />
        } else {
            return null;
        }
    }

    render(){
        return(
            <>
                {this.setNavBar()}
            </>
        );
    }
}

const mapStateToProps = state => {
    return{
        navType: state.config.navType
    }
};

export default connect(mapStateToProps)(RenderNav);