import Select from "react-select";
import {estadoSelectStyle} from "./styles/estadoSelectStyle";
import React from "react";

export const EstadosSelect = ({value, options, onChange, isDisabled, ...props}) => {

    const optionsMapped = options.map(e => ({
            ...e, label: <GetLabel fsIcon={"fs-4"} value={e}/>
        })
    );
    const valueSelected = {...value, label: <GetLabel fsIcon={"fs-2"} value={value}/>};

    return (<>
        <Select options={optionsMapped} onChange={onChange} className={"react-select"}
                isDisabled={isDisabled} classNamePrefix={"react-select"}
                hideSelectedOptions isSearchable={false}
                noOptionsMessage={() => "Sin transiciones posibles"}
                value={valueSelected}
                styles={estadoSelectStyle(value)}
                {...props}
        />
    </>);
}

const GetLabel = ({fsIcon, value}) => {
    return (
        <span className={"d-flex align-items-center"}>
            <i className={`${fsIcon} icon-uqai ${value.icon} text-${value.color} me-2`}/>{value.label}
        </span>
    );
}