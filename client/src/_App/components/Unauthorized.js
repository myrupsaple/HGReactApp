import React from 'react';
import history from '../../history';


class Unauthorized extends React.Component {
    content = ( <h3>You are either not signed in or are not authorized to view this content. Returning to App home...</h3> );
    
    componentDidMount(){
        setTimeout(() => { history.push('/App') }, 1500);
    }
    
    render(){
        return(
            <div className="ui-container">
                {this.content}
            </div>
        );
    }
};

export default Unauthorized;