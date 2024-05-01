import React from "react";

export const CardGeneral = ({iconClass, title, className, children}) => {

    return (
        <div className={`card shadow ${className}`}>
            <div className="d-flex align-items-center border-bottom border-primary card-header">
                <h5 className={"my-0 fw-bold"}>
                    <i className={`icon-uqai align-middle text-primary me-2 ${iconClass}`}/>
                    {title}
                </h5>
            </div>
            <div className="container">
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    );
}