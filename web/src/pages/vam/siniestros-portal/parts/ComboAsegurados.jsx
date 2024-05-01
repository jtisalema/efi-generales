import React, {useEffect, useState} from 'react';
import {Col, Row} from "reactstrap";
import axios from "axios";
import {routes as routesVam} from "../../UtilsVam";
import AsyncSelect from 'react-select/async';
import {UqaiField} from "../../../../components/UqaiField";

export const ComboAsegurados = ({
                                    setFieldValue,
                                    name,
                                    alert,
                                    values,
                                    defaultOptions,
                                    cedula,
                                }) => {
    const [valor, setValor] = useState(defaultOptions[0]);

    useEffect(() => {
        if (!values || (values?.cedula === '' || values?.cedula === 0)) {
            setValor(defaultOptions[0]);
        }
    }, [values.cedula, cedula]);

    const getClientes = (value, callback) => {
        if (value?.trim()?.length > 1) {
            getDataAdmin(value).then(resp => callback(resp)).catch(error => alert.current.show_error('Error al consultar ' + error));
        } else {
            callback([]);
        }
    };

    const getDataAdmin = async (value) => {
        let body = {
            cedula: value?.trim()?.toUpperCase()
        }
        let list = await axios.post(routesVam.api + '/siniestros-portal/asegurados', body);
        let data = list.data;
        data.forEach(p => {
            p.label = p.cedula + " - " + p.nmCliente + " " + (p.apCliente ? p.apCliente : "");
            p.value = p.cedula;
        });
        data.sort((p1, p2) => p1.cedula.localeCompare(p2.cedula));
        data.unshift(defaultOptions[0]);
        return data;
    }
    return (
        <Row>
            <Col>
                <div>
                    <UqaiField type={"text"} name={name} component={AsyncSelect}
                               loadOptions={getClientes}
                               value={valor}
                               defaultOptions={defaultOptions}
                               placeholder="Buscar..."
                               noOptionsMessage={() => 'Sin resultados'}
                               loadingMessage={() => 'Cargando...'}
                               onChange={(e) => {
                                  setFieldValue(name, e.value);
                                  setValor(e);
                              }}
                               classNamePrefix="react-select"
                               className="react-select">
                    </UqaiField>
                </div>
            </Col>
        </Row>
    );
}