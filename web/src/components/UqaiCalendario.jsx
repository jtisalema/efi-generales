import Datetime from "react-datetime";
import moment from "moment";
import React, {useState} from "react";
import memoize from "memoize-one";

export const formatDate = memoize(value => {
    return value ? moment(value).locale('moment/locale/es').format('DD/MMM/YYYY') : "";
});

export const UqaiCalendario = ({field, form, showInternalMessage = true, ...props}) => {
    const dateFormat = "DD/MM/YYYY";
    const maxValueFormated = moment(props?.maxValue).format(dateFormat);
    const minValueFormated = moment(props?.minValue).format(dateFormat);
    const valueFormatted = props?.maxValue ? maxValueFormated : minValueFormated;
    const tipoError = `${props?.maxValue ? 'superior' : 'inferior'}`;
    const errorMessage = (props?.maxValue || props?.minValue) ? `Fecha inválida o ${tipoError} a ${valueFormatted} ` : "Fecha inválida";

    const [hasError, setHasError] = useState(false);

    const handleValidDate = (e) => {
        let currentHasError = false;
        if (typeof e === "string" && e.length >= 8) {
            e = e.slice(0, 2) + "/" + e.slice(2, 4) + "/" + e.slice(4, 8);
            e = moment(e, dateFormat);
        }
        if (e instanceof Object) {
            let isValidDate = e._isValid
            if (props?.maxValue) isValidDate = isValidDate && (e.isBefore(props?.maxValue) || e.isSame(new Date(), 'day'));
            if (props?.minValue) isValidDate = isValidDate && (e.isAfter(props?.minValue) || e.isSame(new Date(), 'day'));
            e = moment(e.format(dateFormat) + " " + moment().format("HH:mm:ss"), `${dateFormat} HH:mm:ss`);
            props?.onFieldSet?.(e.toDate());
            currentHasError = !isValidDate;
        } else {
            currentHasError = true;
            if (e.length === 0) {
                form.setFieldValue(field.name, "");
                props?.onFieldSet?.("");
                currentHasError = false;
            }
        }
        setHasError(() => currentHasError);
        form.setFieldValue(field.name, e instanceof Object ? e?.toDate() : e);
        props?.getValidatedDate?.(e, currentHasError);
    }
    const formatFieldValue = (value) => value?.length > 10 ? moment(value).format(dateFormat) : value;

    return (
        <>
            <Datetime className={props.className} {...props}
                      dateFormat={dateFormat}
                      timeFormat={false}
                      initialViewDate={formatFieldValue(field.value || props?.maxValue)}
                      value={formatFieldValue(field.value)}
                      onChange={handleValidDate}
                      closeOnSelect={true}
                      onOpen={() => form.setFieldTouched(field.name, true)}
                      inputProps={{
                          disabled: !!props.readOnly,
                          placeholder: dateFormat,
                      }}
                      renderInput={(props) => {
                          return <input {...props} value={(field.value) ? props.value : ''}/>
                      }}
            />
            {showInternalMessage && hasError && <small className={"text-danger text-center"}>{errorMessage}</small>}
        </>
    )
}


export const JedaiCalendarioViewText = ({value}) => {
    let date = formatDate(value);
    return <span className="text-uppercase text">{date}</span>
};