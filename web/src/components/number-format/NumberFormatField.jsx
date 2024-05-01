import {CustomNumberFormat} from "../CustomNumberFormat";
import {Field} from "formik";

export const NumberFormatField = ({name, className, validate, ...props}) => {

    return (
        <Field name={name} validate={validate}>
            {({form, field}) => (
                <>
                    <CustomNumberFormat
                        className={className}
                        value={field.value || 0}
                        displayType={"input"}
                        onValueChange={(values) => {
                            const value = Number(values.value);
                            form.setFieldValue(field.name, value);
                            form.setFieldTouched(field.name, true);
                        }}
                        {...props}
                    />
                </>
            )}
        </Field>
    )
}