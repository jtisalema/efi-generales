import React from "react";
import {Header} from "./Header";
import background2 from "../assets/images/plataforma_fondo2.png";


export const Pages = ({children, title}) => {

    return (
        <>
            <div className="bg-fullscreen bg-img-center" style={{backgroundImage: `url(${background2})`}}/>
            <div className="vh-100 d-flex flex-column">
                <Header title={title}/>
                {children}
            </div>
        </>
    );
}

export default Pages;