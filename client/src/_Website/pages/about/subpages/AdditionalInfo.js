import React from 'react';
import Back from '../../../../components/Back';

const AdditionalInfo = () => {
    const link = "https://docs.google.com/document/d/e/2PACX-1vShOGEe26xvUrNbffh0hyweZ3mJvln7RCQwRDEc7UYWWZfOlzBsPwq1UVbmSwZlV6V-KFagn3RUZvl1/pub?embedded=true"
    return(
        <div>
            <Back />
            <iframe src={link} title="Additional Info" width="1000" height="1500"></iframe>
        </div>
    );
}

export default AdditionalInfo;