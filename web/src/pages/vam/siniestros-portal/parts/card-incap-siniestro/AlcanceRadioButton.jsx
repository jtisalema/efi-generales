import {useFormikContext} from "formik";
import {TIPOS_RECLAMO} from "../../utils";
import {UqaiField} from "../../../../../components/UqaiField";
import React from "react";

export function AlcanceRadioButton() {

    const formik = useFormikContext();
    const values = formik.values;

    return (
        <div className="col-md-4">
            <label className="form-label fw-bold text-secondary fs-7">Solicitar reembolso:</label>
            <div className={"d-flex"}>
                {values.tpSiniestro !== TIPOS_RECLAMO.medicinaContinua &&
                    <div className="form-check me-2">
                        <UqaiField className="form-check-input" type="radio" component={"input"}
                                   name={"alcance"} id="alcance" value={"N"} checked={values.alcance === 'N'}
                                   onChange={e => {
                                       formik.setFieldValue('alcance', e.target.value);
                                       formik.setFieldValue('cdReclamo', null);
                                       formik.setFieldValue('cdObjSiniestro', null);
                                       formik.setFieldValue('item', 0);
                                   }}/>
                        <label className="form-check-label" htmlFor="alcance">
                            Nuevo Siniestro
                        </label>
                    </div>}

                {values.tpSiniestro !== TIPOS_RECLAMO.preAutorizacion &&
                    <div className="form-check">
                        <UqaiField className="form-check-input" type="radio" component={"input"}
                                   name={"alcance"} id="alcance2" value={"S"} checked={values.alcance === 'S'}/>
                        <label className="form-check-label" htmlFor="alcance2">
                            Alcance
                        </label>
                    </div>}
            </div>
        </div>)
}