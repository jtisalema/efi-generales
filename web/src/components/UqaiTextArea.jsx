import React, {useEffect, useRef} from "react";

export const JedaiRenglon = ({field, form, label, placeholder = '', disabled, autofocus, ...props}) => {

    const refTxt = useRef(null);

    useEffect(() => {
        let el = refTxt.current;
        if (form.dirty) {
            el.focus();
        }
    }, []);

    useEffect(() => {
        let el = refTxt.current;
        if (field.value) {
            if (el.scrollTop !== 0) {
                el.style.height = el.scrollHeight + "px";
            } else {
                el.rows = field.value.split("\n").length;
            }
        } else {
            el.rows = 1;
            el.style.height = 'unset';
        }

    }, [field.value]);

    return (<div className="d-flex"><span>{label}</span><textarea className="col" ref={refTxt} rows={1} {...field}
                                                                  placeholder={placeholder} disabled={disabled}/>
    </div>);
};

export const UqaiTextArea = ({field, form, ...props}) => (
    <div>
        <textarea {...field} {...props}/>
    </div>
);

export const JedaiRenglonUncontrolled = (props) => {

    const refTxt = useRef(null);

    const onChange = () => {
        let el = refTxt.current;
        if (el.value) {
            if (el.scrollTop !== 0) {
                el.style.height = el.scrollHeight + "px";
            } else {
                el.rows = el.value.split("\n").length;
            }
        } else {
            el.rows = 1;
            el.style.height = 'unset';
        }
    };

    return (<textarea className="col" ref={refTxt} rows={1} {...props} onChange={onChange}/>);
};