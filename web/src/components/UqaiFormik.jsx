import React from 'react';
import {Formik} from "formik";
import memoize from "memoize-one";
import moment from "moment";

export const isArray = (val) => {
    return Array.isArray(val);
};

export const isObject = (val) => {
    return (typeof val === 'object' && !(val instanceof Date) && !(val instanceof File) && !(val instanceof moment)) && !Array.isArray(val) && val !== null;
};

export default class UqaiFormik extends React.Component {

    constructor(props) {
        super(props);
        this.form = React.createRef();
    }

    submitForm() {
        this.form.current.submitForm();
    }

    resetForm() {
        this.form.current.resetForm();
    }

    getValues() {
        return this.decodeValues(this.form.current.values);
    }

    saveIfChanged() {
        let changed = this.form.current.dirty;
        if (changed) {
            this.submitForm();
        }
    }

    render() {

        const formikProps = this.initializeFormikProps(this.props);

        return <Formik {...formikProps} innerRef={this.form}/>;
    }

    handleSubmitProxy = (values, formikActions) => {
        const {onSubmit} = this.props;
        const newValues = this.decodeValues(values);

        onSubmit(newValues, formikActions);
    };

    encodeNullValues = (values) => {
        const {encodeNullValues} = this;
        const newValues = Object.assign({}, values);

        // Iterate each property and check for a null value - then reset
        // to empty string if null is found - iterate recursivly for objects
        Object.keys(newValues).forEach(key => {
            const value = newValues[key];
            if (value === null) {
                newValues[key] = '';
            } else if (isObject(value)) {
                newValues[key] = encodeNullValues(value);
            } else if (isArray(value)) {
                value.forEach((element, index) => {
                    if (isObject(element)) {
                        value[index] = encodeNullValues(element);
                    }
                })
            }
        });

        return newValues;
    };

    decodeNullValues = (values, matchValues = this.initialValues) => {
        const {decodeNullValues} = this;
        const newValues = Object.assign({}, values);

        Object.keys(newValues).forEach(key => {
            const value = newValues[key];
            const matchValue = matchValues[key];

            // If we get an empty string - then check in matchValues for a null value
            // to place on key instead of the empty string
            if (typeof value === 'string' && !value && matchValue === null) {
                newValues[key] = null;
            } else {
                if (isObject(value)) {
                    newValues[key] = decodeNullValues(value, matchValue);
                }
            }
        });

        return newValues;
    };

    encodeArrayValues = (values) => {
        const {encodeArrayValues} = this;
        let newValues = Object.assign({}, values);

        // Iterate the given values and look for arrays to stringify
        Object.keys(newValues).forEach(key => {
            const value = newValues[key];

            if (isArray(value)) {
                newValues[key] = JSON.stringify(value);
            } else if (isObject(value)) {
                newValues[key] = encodeArrayValues(value);
            }
        });

        return newValues;
    };

    decodeArrayValues = (values, matchValues = this.initialValues) => {
        const {decodeArrayValues} = this;
        let newValues = Object.assign({}, values);

        Object.keys(newValues).forEach(key => {
            const value = newValues[key];
            const matchValue = matchValues[key];

            if (isArray(matchValue)) {
                newValues[key] = JSON.parse(value);
            } else if (isObject(value) && value !== null) {
                newValues[key] = decodeArrayValues(value, matchValues[key]);
            }
        });

        return newValues;
    };

    encodeValues = (values) => {
        const {encodeNullValues} = this;
        let newValues = Object.assign({}, values);

        // First encode null values
        newValues = encodeNullValues(newValues);

        // Then stringify arrays
        //newValues = encodeArrayValues(newValues);

        return newValues;
    };

    decodeValues = (values) => {
        const {decodeNullValues} = this;
        let newValues = Object.assign({}, values);

        newValues = decodeNullValues(newValues);
        //newValues = decodeArrayValues(newValues);

        return newValues;
    };

    initializeFormikProps = memoize((props) => {
        const {encodeValues, handleSubmitProxy} = this;
        const formikProps = {...props};
        const {initialValues} = props;
        this.initialValues = props.initialValues;
        formikProps.initialValues = encodeValues(initialValues);
        // this.initialValues = formikProps.initialValues;

        // Set a new handleSubmit to proxy
        formikProps.onSubmit = handleSubmitProxy;

        return formikProps;
    });
}