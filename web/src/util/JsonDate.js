import {isArray, isObject} from "../components/UqaiFormik";

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|([+\-])([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

export const dateParser = (object) => {

    const newValues = Object.assign({}, object);

    Object.keys(newValues).forEach(key => {

        const value = object[key];

        if (typeof value === 'string') {
            let a = reISO.exec(value);
            if (a) {
                object[key] = new Date(value);
            } else if (isObject(value)) {
                newValues[key] = dateParser(value);
            } else if (isArray(value)) {
                value.forEach((element, index) => {
                    if (isObject(element)) {
                        value[index] = dateParser(element);
                    }
                })
            }
        }

    });

    return newValues;

};

export const merge_datos = (schema, values) => {

    values.forEach(val => {
        let item = schema.find(s => s.k === val.k);
        if (item) {
            item.v = val.v;
        } else {
            schema.push(val);
        }
    });

    return schema;
};

export const isNull = txt => {
    return isNaN(txt) || txt === '';
};

