import React from 'react';
import { connect } from 'react-redux';

import { setNavBar } from '../../actions';

const Donate = (props) => {
    props.setNavBar('web');
    return(
        <>
            <h1 id="header">How Do I Donate?</h1>

            <p>
                    A note to students: Please do not donate with the intent of later
                    asking for the money back as a scholarship. This defeats the purpose of
                    donating.
            </p>

            <img src="https://i.imgur.com/6YkESOc.gif" alt="Bankruptcy." />

            <p>
                Thank you for your interest in supporting the IV Hunger Games! To sponsor
                a tribute, please use one of the following methods:
            </p>

            <h3>Method 1: Directly to the Tribute</h3>
            <ol>
                <li>Send your donation to @ivhg2019</li>
                <li>We will credit the tribute once they send us the funds</li>
            </ol>

            <h3>Method 2: Venmo</h3>
            <ol>
                <li>Send your donation directly to the tribute using any payment method</li>
                <li>Make sure to include the name(s) of the tribute(s)/area(s) you would like to sponsor</li>
            </ol>

            <h3>Method 3: Google Wallet</h3>
            <ol>
                <li>Go to <a href="wallet.google.com">Google Wallet</a> and sign in with your account</li>
                <li>Enter ivhg2019@gmail.com as the recipient</li>
                <li>In the comment field, make sure to include the names(s) of the tribute(s)/area(s) 
                    you would like to sponsor</li>
            </ol>

            <h3>How Much Money Has Everyone Raised?</h3>
            <p>
                <a href="https://drive.google.com/open?id=111y1fs7KzBzO1myw3FS5mGo5qL33WXA3h4NGJ-yiBRI">
                    This spreadsheet</a> 
                shows how much money each tribute has raised!
            </p>

            <p>
                Please note: Funds donated towards specific tribute(s) will receive a 10% bonus.
                Funds donated towards areas will not receive this bonus. This is to
                discourage the accumulation of donations in the area funds.
            </p>
        </>
    );
};

export default connect(null, { setNavBar })(Donate);