import React from "react";
import {ESTADOS_CLASS_IMAGEN, ESTADOS_CLASS_LABEL} from "../utils";

export const Estados = ({estado}) => {

    const classIamge = ESTADOS_CLASS_IMAGEN.find(x => x.value === estado)?.label;


    return (<span>
            <i className={"icon-uqai " + classIamge + " me-1"}/>
        {ESTADOS_CLASS_LABEL.find(x => x.value === estado)?.label}
        </span>);
}