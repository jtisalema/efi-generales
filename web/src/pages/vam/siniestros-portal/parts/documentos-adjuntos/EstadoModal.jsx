import {CloseModalButton} from "../../../../../components/button-modal/ButtonModal";
import {Modal} from "reactstrap";
import {useSelector} from "react-redux";
import {useLoadingContext} from "./context/LoadingContextProvider";
import {useFormikContext} from "formik";
import {
    isEjecutivoOrAdminAbleToEditByEstadoSiniestro,
    isEjecutivoOrAdminAbleToEditStateOfDocument
} from "../../estados_edicion";

export const EstadoModal = ({
                                isOpen, onAccept, onClose, estadoActual, maxObservacionesLength,
                                autoUpdateEstado, observaciones, isNew, children, ...props
                            }) => {

    const {isSubmitting, initialValues} = useFormikContext();
    const user = useSelector(state => state.user);
    const isEjecutivoOrAdmin = user.hasPrivileges;
    const [isLoading] = useLoadingContext();

    const isEjecutivoOrAdminAbleToEdit = props.isSiniestroState ? isEjecutivoOrAdminAbleToEditByEstadoSiniestro(user, props?.item?.estadoPortal)
        : isEjecutivoOrAdminAbleToEditStateOfDocument(user, estadoActual?.value, initialValues?.estadoPortal);

    const isDisabled = isNew || isLoading || isSubmitting || !isEjecutivoOrAdminAbleToEdit;

    return (<>

        <Modal isOpen={isOpen} centered>
            <CloseModalButton onClose={onClose}/>
            <div className="container">
                <div className={"modal-body pb-0 pt-4"}>
                    <i className={`icon-uqai ${estadoActual?.icon} text-${estadoActual?.color} mb-1 fs-1`}/>
                    <h5 className={"text-secondary"}><b>
                        {`${estadoActual?.titulo ?? "Motivo"}${estadoActual?.commentOptional ? ":" : "*"}`}
                    </b></h5>
                    {isEjecutivoOrAdmin ?
                        <div className={"text-right"}>
                            <fieldset disabled={isDisabled}>
                                {children}
                            </fieldset>
                            <small>{observaciones?.length || 0}/{maxObservacionesLength}</small>
                        </div>
                        : <div className={"pb-4"}><span>{observaciones}</span></div>
                    }
                </div>
                {isEjecutivoOrAdmin ?
                    <div className={"modal-footer"}>
                        <div className="d-flex justify-content-end w-100 gap-2">
                            <button type={"button"} className={"btn btn-secondary mr-2"} onClick={onClose}
                                    disabled={isLoading || isSubmitting}>Cancelar
                            </button>
                            <button type={"button"} className={"btn btn-primary"} onClick={onAccept}
                                    disabled={isDisabled}>{autoUpdateEstado ? "Aceptar y Guardar" : "Aceptar"}
                            </button>
                        </div>
                    </div> : null}
            </div>
        </Modal>
    </>);
}