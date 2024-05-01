import React from "react";
import {UqaiField} from "./UqaiField";
import PropTypes from "prop-types";

export const FieldIncapSiniestro = ({children, disabled, ...props}) => {

    return (
        <UqaiField type={"text"} className="form-select" disabled={disabled}
                   component={"select"}  {...props}>
            <option key={''} value={''}>{"--- Seleccione ---"}</option>
            {children}
        </UqaiField>
    )
}

FieldIncapSiniestro.propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    option: PropTypes.array,
    children: PropTypes.any
}