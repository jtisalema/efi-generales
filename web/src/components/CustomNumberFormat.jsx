import NumberFormat from "react-number-format";
import React from "react";

export const CustomNumberFormat = ({value, decimalScale, displayType = "text", prefix = "$ ", ...props}) => {
    value = value || 0;
    const withMinAndMaxValue = ({floatValue}) => (floatValue >= 0.0 && floatValue <= 999999.99);

    return (
        <NumberFormat value={value}
                      displayType={displayType}
                      thousandSeparator={true}
                      decimalScale={decimalScale ?? 2}
                      fixedDecimalScale={true}
                      prefix={prefix}
                      isAllowed={withMinAndMaxValue}
                      {...props}
        />
    )
}