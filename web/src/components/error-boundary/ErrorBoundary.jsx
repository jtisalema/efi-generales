import React from "react";
import {DefaultErrorMessage} from "./DefaultErrorMessage";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, info) {
        console.log("Error catched by boundary")
        console.log(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback ?? <DefaultErrorMessage/>;
        }

        return this.props.children;
    }
}