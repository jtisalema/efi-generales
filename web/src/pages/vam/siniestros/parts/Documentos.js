import React, {Component} from "react";
import {Col, Container} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import moment from "moment";

export class Documentos extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: ""
        };
    }

    componentDidUpdate(prevProps) {

    }

    render() {
        return (
            <React.Fragment>
                <Alerts ref={this.alert}/>
                <Container className="text-center">
                    <Col className={"table-responsive"}>
                        <React.Fragment>
                            <table className="table table-borderless table-hover">
                                <thead>
                                <tr className="text-secondary">
                                    <th className="bg-white">Item</th>
                                    <th className="bg-white">Requerido</th>
                                    <th className="bg-white" title={"Enviado a la Aseguradora"}>Enviado Aseg.</th>
                                    <th className="bg-white">No. Doc.</th>
                                    <th className="bg-white">Fecha Emi.</th>
                                    <th className="bg-white">Documento</th>
                                    <th className="bg-white">Observaciones</th>
                                    <th className="bg-white">Enviado Cliente</th>
                                    <th className="bg-white">Adicional</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.props.documentos || []).map((item, index) => (
                                    <tr key={item.cdGastosVam}>
                                        <td>
                                            <span>{index + 1}</span>
                                        </td>
                                        <td className="text-center">
                                            <span>{item.seleccion ? 'SI' : 'NO'}</span>
                                        </td>
                                        <td className="text-center">
                                            <span>{item.envio ? 'SI' : 'NO'}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.numRecibo}</span>
                                        </td>
                                        <td className="text-left">
                                                    <span>
                                                        {item.fcGasto ? moment(item.fcGasto).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                        </td>
                                        <td className="text-justify">
                                            <span>{item.detalle}</span>
                                        </td>
                                        <td className="text-justify">
                                            <span>{item.obsGastoVam}</span>
                                        </td>
                                        <td className="text-center">
                                            <span>{item.preDefinido ? 'SI' : 'NO'}</span>
                                        </td>

                                        <td className="text-center">
                                            <span>{item.docAdic ? 'SI' : 'NO'}</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </React.Fragment>

                    </Col>

                </Container>
            </React.Fragment>
        )
    }
}