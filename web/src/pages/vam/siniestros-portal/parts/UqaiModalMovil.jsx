import {Modal, ModalBody} from "reactstrap";
import React, {useEffect, useState} from "react";
import {UqaiModalHeader} from "../../../../components/UqaiModal";
import {useFormikContext} from "formik";
import {isUserAbleToEditByEstadoSiniestro} from "../estados_edicion";
import {useSelector} from "react-redux";

const WAS_SHOWED = "alert-showed";

export const UqaiModalMovil = ({showButton}) => {
    const [openModal, setOpenModal] = useState(false);

    const {isNew, estadoPortal} = useFormikContext().values;
    const user = useSelector(state => state.user);
    const userCanEdit = isNew || isUserAbleToEditByEstadoSiniestro(user, estadoPortal);

    useEffect(() => {
        const wasShowed = window.sessionStorage.getItem(WAS_SHOWED);
        if (!wasShowed) setOpenModal(userCanEdit);
    }, [user.isUser, userCanEdit]);

    const closeModal = () => {
        setOpenModal(false);
        window.sessionStorage.setItem(WAS_SHOWED, true);
    }

    return (<>
        {showButton &&
            <span role="button" aria-label="Ayuda">
                <i className="btn-document-action m-0 p-0 icon-uqai align-middle uqai-ayuda ms-2 fs-4"
                   title="Ayuda"
                   onClick={() => setOpenModal(true)}></i>
            </span>
        }

        {openModal && <Modal isOpen={openModal} centered>
            <UqaiModalHeader toggle={closeModal} title="Carga de archivos"/>
            <ModalBody>
                <div className="row">
                    <div className="col">
                        <p>Se debe cargar un <b>archivo unificado</b> por cada tipo de gasto y formularios.</p>
                        <p>Si va a tomar una foto se debe enfocar bien, tomando en cuenta que se vean las esquinas del
                            documento.</p>
                        <p>Los archivos soportados son: pdf, jpg, png.</p>
                    </div>
                </div>
            </ModalBody>
        </Modal>}
    </>);
};