import React, {Component} from "react";
import {routes} from "../UtilsVam";
import axios from "axios";
import moment from "moment";
import "moment/locale/es"
import ReactNumeric from "../../../components/ReactNumeric/ReactNumeric";

export class Asegurados extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            wizardOpen: true,
            value: "",
            editing: false,
            list: []
        };
    }

    componentDidMount() {
        let {open} = this.props;
        if (open) {
            this.fetchData();
        }
    }

    componentDidUpdate(prevProps) {
        let {open} = this.props;
        let openOld = prevProps.open;

        if (open !== openOld) {
            if (open) {
                this.fetchData();
            } else {
                this.setState({item: {}});
            }
        }
    }

    fetchData() {
        let {cdObjCotizacion} = this.props;
        axios.get(routes.api + '/subObjeto', {
            params: {
                cdObjCotizacion: cdObjCotizacion,
                cdCompania: this.props.item.cdCompania,
            }
        }).then(resp => {
            let list = resp.data;
            this.setState({list: list});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    closeModal = () => {
        this.props.toggleModal(false);
        this.setState({list: []});
    };

    calcularEdad = (fecha) => {

        //dar formato a las fecha
        fecha = moment(fecha).locale('moment/locale/es').local().format("DD-MM-YYYY");

        let values = fecha.split("-");
        let dia = parseInt(values[0]);
        let mes = parseInt(values[1]);
        let ano = parseInt(values[2]);

        // cogemos los valores actuales
        let fecha_hoy = new Date();
        let ahora_ano = fecha_hoy.getYear();
        let ahora_mes = fecha_hoy.getMonth() + 1;
        let ahora_dia = fecha_hoy.getDate();

        // realizamos el calculo
        let edad = (ahora_ano + 1900) - ano;
        if (ahora_mes < mes) {
            edad--;
        }
        if ((mes === ahora_mes) && (ahora_dia < dia)) {
            edad--;
        }
        if (edad > 1900) {
            edad -= 1900;
        }

        // calculamos los meses
        let meses = 0;

        if (ahora_mes > mes && dia > ahora_dia)
            meses = ahora_mes - mes - 1;
        else if (ahora_mes > mes)
            meses = ahora_mes - mes;
        if (ahora_mes < mes && dia < ahora_dia)
            meses = 12 - (mes - ahora_mes);
        else if (ahora_mes < mes)
            meses = 12 - (mes - ahora_mes + 1);
        if (ahora_mes === mes && dia > ahora_dia)
            meses = 11;

        // calculamos los dias
        let dias = 0;
        if (ahora_dia > dia)
            dias = ahora_dia - dia;
        if (ahora_dia < dia) {
            let ultimoDiaMes = new Date(ahora_ano, ahora_mes - 1, 0);
            dias = ultimoDiaMes.getDate() - (dia - ahora_dia);
        }

        return edad + " años, " + meses + " meses y " + dias + " días";
    };

    render() {

        return (
            <div className="table-responsive">
                <table className="table table-borderless table-hover">
                    <thead>
                    <tr className="text-secondary">
                        <th className="bg-white">Item</th>
                        <th className="bg-white">Cédula</th>
                        <th className="bg-white">Dependiente/Beneficiario</th>
                        <th className="bg-white">Fc Nacimiento</th>
                        <th className="bg-white">Edad</th>
                        <th className="bg-white">Parentesco/Relación</th>
                        <th className="bg-white">% Ben (Vida)</th>
                        <th className="bg-white">Activo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(this.state.list || []).map((item, index) => (
                        <tr key={item.cdSubObjeto}>
                            <td>
                                <span>{index + 1}</span>
                            </td>
                            <td>
                                <span>{item.cedulaS}</span>
                            </td>
                            <td>
                                <span>{item.dscSubobjeto}</span>
                            </td>
                            <td>
                                <span>{moment(item.fcNacimiento).local().format("DD/MMM/YYYY")}</span>
                            </td>
                            <td>
                                <span>{this.calcularEdad(item.fcNacimiento)}</span>
                            </td>
                            <td>
                                <span>{item.obsSubobjeto}</span>
                            </td>
                            <td>
                                                <span>
                                                    <ReactNumeric
                                                        valuex={item.beneficio ? item.beneficio : 0}
                                                        readOnly
                                                        className="form-control-plaintext text-right"/>
                                                </span>
                            </td>
                            <td>
                                <div>{item.activo ? <span>SI</span> : <span>NO</span>}</div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
}