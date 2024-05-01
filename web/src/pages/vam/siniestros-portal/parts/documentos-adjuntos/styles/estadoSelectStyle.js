const estadoSelectColors = {
    primary: "#00BCEA",
    success: "#FFEC0F",
    info: "#005E75",
    secondary: "#707070",
    danger: "#FF1C1C",
    warning: "#FF6600",
    light: "#B8B8B8",
    alternative: "#56C218",
    lighter: "#DEDEDE",
}
export const estadoSelectStyle = (value) => {
    const fontSize = "0.85rem";
    const height = "1.45rem";

    return ({
        control: (baseStyles, state) => {
            return ({
                ...baseStyles,
                borderColor: `${estadoSelectColors[value.color]} !important`,
                overflow: "hidden",
                fontSize,
                width: "185px",
                minHeight: "unset",
                height,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
            })
        },
        option: (provided, {isFocused}) => ({
            ...provided,
            backgroundColor: isFocused ? estadoSelectColors.lighter : undefined,
            fontSize,
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: "0 !important",
            height,
        }),
        indicatorSeparator: () => ({
            // para que no aparezca
        }),
    });
}
