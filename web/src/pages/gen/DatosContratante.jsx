import {Label} from "reactstrap";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import {routes} from "./UtilsGeneral";
import moment from "moment";
import {useParams} from "react-router-dom";

export const DatosContratante = ({setCliente, item}) => {
    const user = useSelector(state => state.user);
    let {id} = useParams();

    useEffect(() => {
        user.cdCliente && fetchData();
    }, [user.cdCliente])

    const fetchData = () => {
        axios.get(routes.api + '/cliente', {
            params: {
                cdCliente: id || user.cdCliente
            }
        }).then(resp => {
            let cliente = resp.data;
            cliente.fC = cliente.fC ? new Date(cliente.fC) : null;
            setCliente(cliente);
        }).catch(error => {
            //alert(error);
        })
    };
    const genero = (gen) => {
        let ret;
        switch (gen) {
            case 'M':
                ret = 'MASCULINO';
                break;
            case 'F':
                ret = 'FEMENINO';
                break;
            case 'S':
                ret = 'SIN DEFINIR';
                break;
            default :
                ret = ' ';
                break;
        }
        return ret;
    };


    return <>
        <div className={"col-md-8"}>
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="row">
                        <div className="col-4 text-right"><Label
                            className="form-label fw-bold text-secondary fs-6">Cédula/RUC:&nbsp;</Label>
                        </div>
                        <div className="col-8"><span>{item.rucCed}</span></div>
                        <div className="col-4 text-right"><Label
                            className="form-label fw-bold text-secondary fs-6">Nombres:&nbsp;</Label>
                        </div>
                        <div className="col-8"><span>{item.nmCliente}</span></div>
                        <div className="col-4 text-right"><Label
                            className="form-label fw-bold text-secondary fs-6">Apellido:&nbsp;</Label>
                        </div>
                        <div className="col-8"><span>{item.apCliente}</span></div>
                        <div className="col-4 text-right"><Label
                            className="form-label fw-bold text-secondary fs-6">Género:&nbsp;</Label>
                        </div>
                        <div className="col-8"><span>{genero(item.genero)}</span></div>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="row">
                        <div className="col-4 text-right"><Label className="form-label fw-bold text-secondary fs-6">Estado
                            Civil:&nbsp;</Label></div>
                        <div className="col-8"><span>{item.estadoCivil}</span></div>
                        {('CASADO' === item.estadoCivil || 'CASADO/A' === item.estadoCivil) &&
                            <>
                                <div className="col-4 text-right"><Label
                                    className="form-label fw-bold text-secondary fs-6">Nombre
                                    Cónyuge:&nbsp;</Label></div>
                                <div className="col-8"><span>{item.nmConyuge} {item.apConyuge}</span></div>
                                <div className="col-4 text-right"><Label
                                    className="form-label fw-bold text-secondary fs-6">Fc.
                                    Nacimiento:&nbsp;</Label></div>
                                <div className="col-8">
                                    <span>{item.fcNacimiento ? moment(item.fcNacimiento).locale('moment/locale/es').format("DD/MM/YYYY") : "-"}</span>
                                </div>
                            </>
                        }
                        <div className="col-4 text-right"><Label
                            className="form-label fw-bold text-secondary fs-6">Título:&nbsp; </Label>
                        </div>
                        <div className="col-8"><span>{item.titulo}</span></div>
                    </div>
                </div>
            </div>
        </div>
    </>
}