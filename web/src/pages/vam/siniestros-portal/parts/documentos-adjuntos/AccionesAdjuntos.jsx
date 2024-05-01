import {useLoadingContext} from "./context/LoadingContextProvider";
import {useSelector} from "react-redux";
import {useFormikContext} from "formik";

import {ESTADOS_DOC_VALUES, isUserAbleToEditDocument} from "../../estados_edicion";

export const AccionesAdjuntos = ({documentoDigital, onEdit, onDelete, children, ...props}) => {

    const {values, setFieldValue} = useFormikContext();
    const {isNew, estadoPortal} = values;
    const user = useSelector(state => state.user);
    const isAbleToEdit = isNew || isUserAbleToEditDocument(user, documentoDigital?.estado, estadoPortal);
    const hasPrivileges = user.hasPrivileges;
    const isWatingToDelete = documentoDigital?.estado === ESTADOS_DOC_VALUES.porEliminar;
    const isNewSiniestro = (onDelete && isNew);
    const showDeleteButton = (isNewSiniestro && props?.isSubdocumento) ? (!props?.isRequired || !documentoDigital?.cdArchivo) : isNewSiniestro;

    const isDisableEdit = !onEdit || (!isAbleToEdit && !props?.forceShowEdit);

    function onView() {
        window.open(documentoDigital?.url);
    }

    function handleDelete(e) {
        if (props?.isSubdocumento) {
            onDelete(e);
            return;
        }
        if (window.confirm("Esta operación es irreversible ¿Está seguro de eliminar?")) {
            onDelete(e);
        }
    }

    function onUndo() {
        if (props?.name) setFieldValue(`${props.name}.documentoDigital.estado`, ESTADOS_DOC_VALUES.cargado);
    }

    return (
        <>
            {documentoDigital?.url &&
                <AccionButton onClick={onView} className={"view-order"} title={"Ver"}>
                    <i className="icon-uqai uqai-ver fs-4"/>
                </AccionButton>
            }
            {!hasPrivileges && <>
                <AccionButton onClick={onEdit} className={"edit-order"} title={"Editar"}
                              disabled={isDisableEdit}
                >
                    <i className="icon-uqai uqai-editar"/>
                </AccionButton>
                <AccionButton onClick={isWatingToDelete ? onUndo : handleDelete} className={"delete-order"}
                              title={isWatingToDelete ? "Deshacer" : "Eliminar"}
                              disabled={!showDeleteButton}
                >
                    <i className={`${isWatingToDelete ? "fas fa-undo" : "icon-uqai uqai-borrar"}`}/>
                </AccionButton>
            </>}
            {children}
        </>
    )
}

export const AccionButton = ({onClick, children, disabled, className, ...props}) => {

    const [isLoading] = useLoadingContext();

    return (
        <button type={"button"} className={`btn-document-action btn m-0 p-0 ${className} border-0`} onClick={onClick}
                disabled={isLoading || disabled} {...props}>
            {children}
        </button>
    );
}
