import React, {useMemo} from 'react'
import bgModal from "../assets/images/plataforma_taxtura_modal.png";
import {ModalHeader} from "reactstrap";

export const UqaiModalHeader = ({toggle, title}) => {
    const headerProps = useMemo(() => {
        const props = {
            className: 'p-0 border-0'
        }

        if (title) {
            props.tag = 'h2';
            props.style = {backgroundImage: `url(${bgModal})`};
            props.className = 'bg-img-end fw-bold text-white py-4';
        }

        return props;
    }, [title]);

    return (
        <ModalHeader toggle={toggle} {...headerProps}>
            {title}
        </ModalHeader>
    );
}