import React, {Component} from "react";
import {Col, Container, Table} from "reactstrap";
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
    render() {
        return (
            <React.Fragment>
                <Alerts ref={this.alert}/>
                <Container className="text-center">
                    <Col className={"table-responsive"}>
                        <React.Fragment>
                            <Table className="table table-borderless table-hover">
                                <thead>
                                <tr className="text-secondary">
                                    {!this.props.vam && <>
                                        <th className="bg-white" scope="col">Item</th>
                                        <th className="bg-white" scope="col">Documento</th>
                                        <th className="bg-white" scope="col">Recibe Broker</th>
                                        <th className="bg-white" scope="col" title={"Enviado a la Aseguradora"}>Enviado
                                            Aseg.
                                        </th>
                                        <th className="bg-white" scope="col">Observaciones</th>
                                        <th className="bg-white" scope="col">Fecha Recordatorio</th>
                                    </>}
                                    {this.props.vam && <>
                                        <th className="bg-white" scope="col">Item</th>
                                        <th className="bg-white" scope="col" title={"Enviado a la Aseguradora"}>Enviado
                                            Aseg.
                                        </th>
                                        <th className="bg-white" scope="col">Fecha Emi.</th>
                                        <th className="bg-white" scope="col">Documento</th>
                                        <th className="bg-white" scope="col">Observaciones</th>
                                        <th className="bg-white" scope="col">Solicitado a Cliente</th>
                                        <th className="bg-white" scope="col">Adicional</th>
                                    </>}

                                </tr>
                                </thead>
                                <tbody>
                                {this.props.documentos.length === 0 ?
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={4}>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.props.documentos.map((item, index) => (

                                            <tr key={item.cdGastosVam}>
                                                {!this.props.vam && <>
                                                    <td className="text-left">
                                                        <span>{index + 1}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span>{item.nmDocumento}</span>
                                                    </td>
                                                    <td className="text-center">
                                                    <span>  {item.fcReciboBrk ? moment(item.fcReciboBrk).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                                    </td>
                                                    <td className="text-center">
                                                    <span>
                                                        {item.fcEnvioAseg ? moment(item.fcEnvioAseg).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span>{item.obsDocSiniestro}</span>
                                                    </td>
                                                    <td className="text-center">
                                                    <span>
                                                        {item.fcRecuerdaCli ? moment(item.fcRecuerdaCli).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                                    </td>
                                                </>}
                                                {this.props.vam && <>
                                                    <td className="text-left">
                                                        <span>{index + 1}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span>{item.impreso ? 'SI' : 'NO'}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span>{item.fcGasto ? moment(item.fcGasto).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span>{item.detalle}</span>
                                                    </td>
                                                    <td className="text-justify">
                                                        <span>{item.obsGastoVam}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span>{item.adicional ? 'SI' : 'NO'}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span>{item.docAdic ? 'SI' : 'NO'}</span>
                                                    </td>
                                                </>}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                }
                                </tbody>
                            </Table>
                        </React.Fragment>
                    </Col>
                </Container>
            </React.Fragment>
        )
    }

}