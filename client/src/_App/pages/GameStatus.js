import React from 'react';

import AppNavBar from '../components/AppNavBar';

class GameStatus extends React.Component {
    _isMounted = true;
    state = {
        gameStart: {
            hours: 12,
            minutes: 0,
            seconds: 0
        }
    };

    componentDidMount = () => {
        setInterval(() => {
            const today = new Date();
            var month = today.getMonth() + 1;
            month = month.toLocaleString(undefined,{minimumIntegerDigits: 2});
            const day = today.getUTCDate().toLocaleString(undefined,{minimumIntegerDigits: 2});
            const date = month + '/' + day + '/' + today.getUTCFullYear() + ' ';

            const hours = today.getHours().toLocaleString(undefined,{minimumIntegerDigits: 2});
            const minutes = today.getMinutes().toLocaleString(undefined,{minimumIntegerDigits: 2});
            const seconds = today.getSeconds().toLocaleString(undefined,{minimumIntegerDigits: 2});
            const time = hours + ':' + minutes + ':' + seconds;

            var gameHours = hours - this.state.gameStart.hours;
            gameHours = gameHours.toLocaleString(undefined,{minimumIntegerDigits: 2})
            var gameMinutes = minutes - this.state.gameStart.minutes;
            gameMinutes = gameMinutes.toLocaleString(undefined,{minimumIntegerDigits: 2})
            var gameSeconds = seconds - this.state.gameStart.seconds;
            gameSeconds = gameSeconds.toLocaleString(undefined,{minimumIntegerDigits: 2})
            this.setState({ 
                gameTime: gameHours + ':' + gameMinutes + ':' + gameSeconds,
                time: date + time
            })
        }, 1000);
    }

    getStartTime = () => {
        return(this.state.gameStart.hours.toLocaleString(undefined,{minimumIntegerDigits: 2}) +
            ':' + this.state.gameStart.minutes.toLocaleString(undefined,{minimumIntegerDigits: 2}) +
            ':' + this.state.gameStart.seconds.toLocaleString(undefined,{minimumIntegerDigits: 2}));
    }

    render = () =>{
        return(
            <>
                <AppNavBar />
                <div className="ui-container">
                    <h1>Games Started At: {this.getStartTime()} </h1>
                    <h1>Game Time: {this.state.gameTime}</h1>
                    <h1>Current Time: {this.state.time}</h1>
                    <h1>Resources Needed</h1>
                    <h1>Special Events</h1>
                    <h1>Tributes Remaining</h1>
                </div>
            </>
        )
    }
};

export default GameStatus;