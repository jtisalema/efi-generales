import React from "react";
import {v_comentario} from "../utils";
import {UqaiField} from "../../../../components/UqaiField";
import {UqaiTextArea} from "../../../../components/UqaiTextArea";
import UqaiFormik from "../../../../components/UqaiFormik";
import {EstadoModal} from "./documentos-adjuntos/EstadoModal";
import {ESTADOS_PORTAL_LISTA} from "../estados_edicion";
import {useFormikContext} from "formik";

export const Comentario = ({open, setOpen, comentario, setComentario, item}) => {

    const MAX_OBSERVACIONES_LENGTH = 250;
    const {values: valuesPrincipal, setFieldValue} = useFormikContext(); // contexto del formik de afuera
    const saveComentario = (newValues) => {
        setFieldValue("estadoPortal", newValues.estado);
        setComentario(newValues);
        setOpen(false);
    }
    const onClose = () => setOpen(false);

    return (
        <UqaiFormik initialValues={comentario} onSubmit={saveComentario} enableReinitialize={true}
                    validateOnChange={false} validationSchema={v_comentario}>
            {({submitForm, setFieldValue, values}) => (
                <EstadoModal isOpen={open} estadoActual={ESTADOS_PORTAL_LISTA.find(x => x.value === comentario?.estado)}
                             observaciones={values.comentario} maxObservacionesLength={MAX_OBSERVACIONES_LENGTH}
                             autoUpdateEstado={false} onClose={onClose} onAccept={submitForm}
                             item={item} isSiniestroState isNew={valuesPrincipal.isNew}
                >
                    <UqaiField
                        className="form-control rounded"
                        component={UqaiTextArea}
                        name={"comentario"}
                        onChange={(e) => {
                            let val = e.target?.value;
                            if (val?.length > MAX_OBSERVACIONES_LENGTH) {
                                val = val.substring(0, MAX_OBSERVACIONES_LENGTH);
                            }
                            setFieldValue('comentario', val);
                        }}
                    />
                </EstadoModal>
            )}
        </UqaiFormik>
    )
}