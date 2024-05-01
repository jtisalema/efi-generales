import {Modal} from "reactstrap";
import PropTypes from "prop-types";
import styles from "./ButtonModal.module.scss"
import {
    useLoadingContext
} from "../../pages/vam/siniestros-portal/parts/documentos-adjuntos/context/LoadingContextProvider";
import {useSelector} from "react-redux";
import {UqaiModalHeader} from "../UqaiModal";

export const ButtonModal = ({isOpen, toggle, icon, hoverIcon, label, modalProps, ...props}) => {

    const user = useSelector(state => state.user)

    return (<>
        <div className={"d-flex"}>
            <div className={"my-auto"}>
                {user.hasPrivileges ?
                    <></>
                    :
                    <button type={"button"} className={["btn", "border-primary", styles.btnModal].join(" ")}
                            onClick={props?.onOpen ?? toggle}>
                        <div className={styles.btnModalContenido}>
                            {icon ? <i className={`icon-uqai ${icon}`}/> : "+"}
                            <span>{label}</span>
                        </div>
                        <div className={styles.btnModalHoverIcon}>
                            {hoverIcon && <i className={`btn-modal-icon icon-uqai ${hoverIcon}`}/>}
                        </div>
                    </button>
                }
            </div>
        </div>
        <Modal isOpen={isOpen} centered {...modalProps}>
            <CloseModalButton onClose={props?.onClose} toggle={toggle} title={props?.title}/>
            {props.children}
        </Modal>
    </>)


}
export const CloseModalButton = ({onClose, toggle, title}) => {

    const [isLoading] = useLoadingContext();

    return (<>
        <UqaiModalHeader toggle={isLoading ? null : (onClose ?? toggle)} title={title}/>
    </>)
}
ButtonModal.propTypes = {
    /**
     * Estado que define si el modal se muestra
     */
    isOpen: PropTypes.bool.isRequired,
    /**
     * Función que cambia el estado isOpen
     */
    toogle: PropTypes.func,
    /**
     * Función a ejecutar al abrir el modal
     */
    onOpen: PropTypes.func,
    /**
     * Función a ejecutar al cerrar el modal
     */
    onClose: PropTypes.func,
    /**
     * Etiqueta que se mostrará en el botón
     */
    label: PropTypes.string.isRequired,
    /**
     * Ícono que se muestra encima del label
     */
    icon: PropTypes.string,
    /**
     * Ícono que se muestra en el hover del botón
     */
    hoverIcon: PropTypes.string,
    /**
     * ModalProps de reactstrap
     */
    modalProps: PropTypes.object,
}

ButtonModal.defaultProps = {
    isOpen: false,
    label: "Agregar documentos",
    modalProps: {
        size: "lg",
    }
}