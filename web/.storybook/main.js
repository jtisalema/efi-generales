module.exports = {
    "stories": [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/preset-create-react-app",
        // {
        //     name: '@storybook/addon-styling',
        //     options: {
        //         sass: {
        //             // Require your Sass preprocessor here
        //             implementation: require('sass'),
        //         },
        //     },
        // },
    ],
    "framework": "@storybook/react"
}