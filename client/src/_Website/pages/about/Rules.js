import React from 'react';
import NavBar from '../../components/NavBar';

import gif from '../../_graphics/gifs/Rules.gif';
import doc from '../../_graphics/assets/doc.png';
import ellipses from '../../_graphics/assets/ellipses.png';
import mapPin from '../../_graphics/assets/map-pin.png';
import pdf from '../../_graphics/assets/pdf.png';

const Rules = () => {
    const divLimiter = {
        display: 'inline-block'
    };


    return (
        <div className="container">
            <NavBar />
            <h1 id="header">Rules</h1>

            <img id="filler" src={gif} alt="Dwight" />
            <div className="clear"></div>

            <h3>Basic Rules</h3>
            <ul>
                <li>Tributes begin with three lives. Additional lives may be purchased with funds.</li>
                <ul>
                    <li>These can be lost to hunger, thirst, or other tributes.</li>
                </ul>
                <li>Tributes must remain within the arena boundaries, which will shrink periodically.</li>
                <li>There will be food, water, and medicine resources scattered throughout the arena.</li>
                <ul>
                    <li>Tributes must 'consume' food and water within the specified time limits to avoid losing lives.</li>
                    <li>Medicine may be required as disasters occur during the Games.</li>
                </ul>
                <li>Each area will appoint one Mentor.</li>
                <ul>
                    <li>Mentors will manage their area's funds and purchase items for the tributes during the Games.</li>
                </ul>
                <li>Any donations a tribute has received can be spent towards extra lives, food, weapons, etc.</li>
            </ul>

            <h3>Further Resources</h3>
            <div style={divLimiter}>
                <a href="/links/arena-map.jpg">
                    <div>
                        <img src={mapPin} height="50" width="50" alt="map pin" />
                        Arena Map
                    </div>
                </a>
            </div>

            <div style={divLimiter}>
                <a href="/links/map-notes.pdf">
                    <div>
                        <img src={pdf} height="50" width="40" alt="pdf icon" />
                        Map Notes
                    </div>
                </a>
            </div>

            <div>
            {/* Keep the top and bottom two icons separated */}

            </div>

            <div style={divLimiter}>
                <a href="/links/rules-list.extern">
                    <div>
                        <img src={doc} height="50" width="50" alt="doc" />
                        Detailed Rules
                    </div>
                </a>
            </div>

            <div style={divLimiter}>
                <a href="/links/additional-info.extern">
                    <div>
                        <img src={ellipses} height="50" width="60" alt="..." />
                        Additional Info
                    </div>
                </a>
            </div>

        </div>
    );
};

export default Rules;