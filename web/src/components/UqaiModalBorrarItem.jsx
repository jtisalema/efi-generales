import {Modal, ModalBody, ModalFooter} from "reactstrap";
import React from "react";
import {UqaiModalHeader} from "./UqaiModal";

export const UqaiModalBorrarItem = ({
                                         isOpen,
                                         toggle,
                                         remove,
                                         title,
                                         text,
                                         ocultarSi,
                                         mantenerAbierto,
                                     }) => {
    let botonNo = ocultarSi ? 'Cerrar' : 'No';
    let botonSi = !ocultarSi;
    let autoCerrarDo = !mantenerAbierto;// si no le paso este parametro, debe cerrarse automatico

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <UqaiModalHeader toggle={toggle}/>
            <ModalBody>
                <div className="d-flex flex-column">
                    <div className="text-center mb-2"><i className="icon-uqai uqai-pregunta fs-1 text-primary"></i>
                    </div>
                    <h4 className="text-secondary text-center mb-3 fw-bold">{title}</h4>
                    <p className="m-0 text-center">{text}</p>
                </div>
            </ModalBody>
            <ModalFooter className="d-flex justify-content-center gap-2">
                <button className="btn btn-secondary"
                        onClick={toggle}>
                    {botonNo}
                </button>

                {botonSi && <button
                    className="btn btn-primary"
                    onClick={() => {
                        remove();
                        if (autoCerrarDo) {
                            toggle();
                        }
                    }}>
                    Si
                </button>}
            </ModalFooter>
        </Modal>
    );
};