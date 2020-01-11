import React from 'react';
import NavBar from '../../components/NavBar';

import gif from '../../_graphics/gifs/AboutHG.gif';

const AboutHG = () => {
    return(
        <div className="ui container">
            <NavBar />
            <h1 id="header">About the Hunger Games</h1>

            <img alt="Kevin" src={gif} />

            <h3>What Is the Hunger Games?</h3>
            <p>
                The Hunger Games is InterVarsity Bruin Christian Fellowship's annual fundraiser
                for Summer Con scholarships. It is a live-action role-playing competition
                modeled after the trilogy by Suzanne Collins. Tributes spend the weeks
                leading up to the event raising funds that they can use to 'buy' food, lives, 
                and other resources during the Games. These funds go towards Summer Con
                scholarships, which help subsidize the cost of the conference for those
                who would otherwise be unable to attend.
            </p>

            <h3>What is Summer Con?</h3>
            <p>
                Summer Con is our annual week-long conference at the end of the school year
                that takes place on Catalina Island. At Summer Con, students have the 
                opportunity to grow closer with God and one another as they study His word
                together. It has been a life-changing experience for many, and we want
                to make sure that all students have a chance to attend, regardless of
                their financial situation.
            </p>

            <h3>How Can You Help?</h3>
            <p>
                Whether you are a student, parent, alumni, or friend, we would greatly
                appreciate any financial support you can provide. All funds
                will go towards Summer Con scholarships. More information can be found on
                the <a href="../donate">donations</a> page.
            </p>
        </div>
    );
};

export default AboutHG;