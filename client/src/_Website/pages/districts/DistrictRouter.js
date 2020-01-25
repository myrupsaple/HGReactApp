import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../../actions';
import District1 from './District1';
import District2 from './District2';
import District3 from './District3';
import NotFound from '../../../components/NotFound';

class DistrictRouter extends React.Component {
    state = { page: <div>Hello</div> };

    componentDidMount() {
        this.props.setNavBar('web');
        switch(this.props.match.params.id) {
            case '1':
                return(this.setState({ page: District1() }));
            case '2':
                return(this.setState({ page: District2() }));
            case '3':
                return(this.setState({ page: District3() }));
            default:
                return(this.setState({ page: NotFound() }));
        }
    }
    render() {
        return (
            <>
                {this.state.page}
            </>
        );
    }
}

export default connect(null, { setNavBar })(DistrictRouter);