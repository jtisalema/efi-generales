import React, {useState} from 'react';
import {Tooltip} from "reactstrap";
import useToggle from "../hooks/useToggle";

export const UqaiTooltip = ({message, size = 'fs-5', ...props}) => {

    const [isOpen, toggle] = useToggle(false);
    const [id] = useState('a' + Math.random().toString(36).substring(2, 10));


    return (<>
        <i className={`icon-uqai uqai-ayuda ms-1 text-light fs-5 hover-color-primary ${size}`} id={id}/>

        {/*{target.current && dummy &&*/}
        <Tooltip isOpen={isOpen} toggle={toggle} target={id} {...props}
                 style={{textAlign: "start"}}>
            {message}
        </Tooltip>
        {/*}*/}
    </>);
}

export default UqaiTooltip;