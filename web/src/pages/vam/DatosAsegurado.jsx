import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import {Label} from "reactstrap";
import {routes} from "./UtilsVam";
import moment from "moment";
import UqaiTooltip from "../../components/UqaiTooltip";


export const DatosAsegurado = () => {
    const user = useSelector(state => state.user);
    const [item, setItem] = useState({us: []});

    useEffect(() => {
        user.cedula && fetchData();
    }, [user.cedula])

    function fetchData() {
        axios.get(routes.api + '/usuario', {
            params: {
                ci: user.cedula
            }
        }).then(resp => {
            let usuario = resp.data;
            usuario.fC = usuario.fC ? new Date(usuario.fC) : null;
            setItem(usuario);
        }).catch(error => {
            //alert('Error al traer el usuario' + error);
        })
    }

    const estadoCivil = (est) => {
        let ret;
        switch (est) {
            case 'V':
                ret = 'VIUDO(A)';
                break;
            case 'U':
                ret = 'UNION LIBRE';
                break;
            case 'D':
                ret = 'DIVORCIADO(A)';
                break;
            case 'C':
                ret = 'CASADO(A)';
                break;
            case 'A':
                ret = 'A';
                break;
            case 'S':
                ret = 'SOLTERO(A)';
                break;
            case 'E':
                ret = 'EN RELACIÓN';
                break;
            default :
                ret = ' ';
                break;
        }
        return ret;
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

    return (
        <div className={"col-md-8"}>
            <div className={"row"}>
                <div className="col-12 col-md-6">
                    <div className="row">
                        <div className="col-4 text-right">
                            <Label className="form-label fw-bold text-secondary fs-6">Cédula/RUC:&nbsp;</Label>
                        </div>
                        <div className="col-8"><span>{item.cedula}</span></div>
                        <div className="col-4 text-right">
                            <Label className="form-label fw-bold text-secondary fs-6">Nombre:&nbsp;</Label>
                        </div>
                        <div className="col-8"><span>{item.nmCliente}</span></div>
                        <div className="col-4 text-right">
                            <Label className="form-label fw-bold text-secondary fs-6">Apellido:&nbsp;</Label>
                        </div>
                        <div className="col-8"><span>{item.apCliente}</span></div>
                        <div className="col-4 text-right">
                            <Label className="form-label fw-bold text-secondary fs-6">Género:&nbsp;</Label>
                        </div>
                        <div className="col-8"><span>{genero(item.genero)}</span></div>
                        <div className="col-4 text-right d-flex">
                            <Label className="form-label fw-bold text-secondary fs-6">Celular:&nbsp;</Label>
                            <UqaiTooltip
                                message={"Número al que llegarán las notificaciones de reclamos y siniestros, si desea actualizar solicitar el cambio a su Ejecutivo Comercial o de Siniestros."}/>
                        </div>
                        <div className="col-8"><span>{item.celular}</span></div>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="row">
                        <div className="col-4 text-right">
                            <Label className="form-label fw-bold text-secondary fs-6">Estado
                                Civil:&nbsp;
                            </Label>
                        </div>
                        <div className="col-8"><span>{estadoCivil(item.estadoCivil)}</span></div>
                        {(item.estadoCivil === 'C') &&
                            <>
                                <div className="col-4 text-right">
                                    <Label className="form-label fw-bold text-secondary fs-6">Nombre
                                        Cónyuge:&nbsp;
                                    </Label><
                                    /div>
                                <div className="col-8"><span>{item.nmConyuge} {item.apConyuge}</span></div>
                                <div className="col-4 text-right">
                                    <Label className="form-label fw-bold text-secondary fs-6">Fc.
                                        Nacimiento:&nbsp;
                                    </Label>
                                </div>
                                <div className="col-8">
                                    <span>{moment(item.fcNacimiento).locale('moment/locale/es').format("DD/MM/YYYY")}</span>
                                </div>
                            </>
                        }
                        <div className="col-4 text-right"><Label
                            className="form-label fw-bold text-secondary fs-6">Título:&nbsp; </Label>
                        </div>
                        <div className="col-8"><span>{item.titulo}</span></div>
                        <div className="col-4 text-right"><Label
                            className="form-label fw-bold text-secondary fs-6">Correo:&nbsp; </Label>
                        </div>
                        <div className="col-8"><span>{item.correo}</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}