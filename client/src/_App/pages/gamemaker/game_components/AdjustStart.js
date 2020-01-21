import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import { getGameState, setGameStartTime } from '../../../../actions';

class AdjustStart extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = { 
            show: false,
            startTime: this.props.startTime,
            formattedTime: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.handleChange(this.state.startTime)
    }

    handleChange(date) {
        console.log(date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        this.setState({ 
            startTime: date,
            formattedTime: `${month}/${day}/${year} ${hours}:${minutes}:00`
        })
    }

    async handleSubmit() {
        const date = this.state.startTime;
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        await this.props.setGameStartTime(`${year}-${month}-${day} ${hours}:${minutes}:00`);
        if(this._isMounted){
            this.setState({ show: false });
        }
        this.props.onSubmitCallback();
    }

    renderContent = () => {
        console.log(this.state.startTime);
        if(!this.state.show){
            return(
                <Button onClick={() => this.setState({ show: true })}>
                    Adjust Start
                </Button>
            );
        } else {
            return(
                <>
                    <DatePicker 
                        value={this.state.formattedTime} 
                        onChange={this.handleChange} 
                        showTimeSelect
                        timeIntervals={5}
                    />
                    <Button onClick={this.handleSubmit}>Submit Changes</Button>
                </>
            )
        }
    }
    
    render(){
        return(
            <>
                {this.renderContent()}                
            </>
        );
    }
}

export default connect(null, { getGameState, setGameStartTime })(AdjustStart);