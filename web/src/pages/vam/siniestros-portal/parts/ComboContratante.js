import React, {useEffect, useState} from 'react';
import {Col, Row} from "reactstrap";
import axios from "axios";
import {routes} from "../../../../util/General";
import AsyncSelect from 'react-select/async';
import {UqaiField} from "../../../../components/UqaiField";

export const ComboContratante = ({setFieldValue, name, alert, values, defaultOptions, reset, setReset}) => {
    const [valor, setValor] = useState(defaultOptions[0]);

    useEffect(() => {
        if (!values.cdCliente || reset) {
            setValor(defaultOptions[0]);
            setReset(false);
        }
    }, [values.cdCliente, reset]);

    const getClientes = (value, callback) => {
        if (value?.trim()?.length > 1) {
            let body = {
                cliente: value?.trim()
            }
            axios.post(routes.api + '/siniestros-portal/contratantes', body).then(resp => {
                let data = resp.data;
                data.forEach(p => {
                    p.label = p.rucCed + " - " + p.nmCliente + " " + (p.apCliente ? p.apCliente : "");
                    p.value = p.cdCliente;
                });
                data.sort((p1, p2) => p1.rucCed.localeCompare(p2.rucCed));
                data.unshift(defaultOptions[0]);
                callback(data);
            }).catch(error => {
                alert.current.show_error('Error al consultar ' + error);
            });
        } else {
            callback([]);
        }
    };
    return (
        <Row>
            <Col>
                <div>
                    <UqaiField type={"text"} name={name} component={AsyncSelect}
                               loadOptions={getClientes}
                               value={valor}
                               defaultOptions={defaultOptions}
                               placeholder="Buscar..."
                               onChange={(e) => {
                                  setFieldValue(name, e.value)
                                  setValor(e)
                              }}
                               noOptionsMessage={() => 'Sin resultados'}
                               loadingMessage={() => 'Cargando...'}
                               classNamePrefix="react-select"
                               className="react-select">
                    </UqaiField>
                </div>
            </Col>
        </Row>
    );
}