import React, {Component} from "react";
import {Col, Container, Row, Table} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import moment from "moment";
import "moment/locale/es"
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";

export class Liquidacion extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: "",
            editing: false
        };
    }

    periodo = (id) => {
        let ret;
        id = id.toString();
        switch (id) {
            case '1':
                ret = 'MENSUAL';
                break;
            case '2':
                ret = 'BIMENSUAL';
                break;
            case '3':
                ret = 'TRIMESTRAL';
                break;
            case '4':
                ret = 'CORRIENTE';
                break;
            case '5':
                ret = 'DIFERIDO';
                break;
            case '6':
                ret = 'INMEDIATO';
                break;
            case '0':
                ret = 'INMEDIATO';
                break;
            default :
                ret = '7';
                break;
        }
        return ret;
    };

    render() {
        return (
            <Container className="text-center">
                <Row>
                    <Col className="table-responsive col-lg-12">
                        <React.Fragment>
                            <h4 className="font-weight-lighter text-left">{"Resumen Total de Gastos"}</h4>
                            <Table className="table table-borderless table-hover">
                                <thead>
                                <tr className="text-secondary">
                                    <th className="bg-white" scope="col">Item</th>
                                    <th className="bg-white" scope="col">Valor Perdida</th>
                                    <th className="bg-white" scope="col">Depreciación</th>
                                    <th className="bg-white" scope="col">Deducible</th>
                                    <th className="bg-white" scope="col">Indemnización</th>
                                    <th className="bg-white" scope="col">Valor R.A.SA.</th>
                                    <th className="bg-white" scope="col">Subtotal</th>
                                    <th className="bg-white" scope="col">Pagos Parciales</th>
                                    <th className="bg-white" scope="col">Pagos Prov/Otros Cargos</th>
                                    <th className="bg-white" scope="col">Valor de Pagos</th>
                                </tr>
                                </thead>
                                <tbody>
                                <React.Fragment>
                                    {(this.props.gastoliquidacion || []).map((item, index) => (
                                        <tr key={item.cdPreliqSiniestro}>
                                            <td>
                                                <span>{index + 1}</span>
                                            </td>
                                            <td>
                                                <ReactNumeric valuex={item.valPerdida ? item.valPerdida : 0}
                                                              readOnly
                                                              className="form-control-plaintext text-right"/>
                                            </td>
                                            <td>
                                                <ReactNumeric valuex={item.valDepreciacion ? item.valDepreciacion : 0}
                                                              readOnly
                                                              className="form-control-plaintext text-right"/>
                                            </td>
                                            <td>
                                                <ReactNumeric valuex={item.valDeducible ? item.valDeducible : 0}
                                                              readOnly
                                                              className="form-control-plaintext text-right"/>
                                            </td>
                                            <td>
                                                <ReactNumeric valuex={item.indemnizacion ? item.indemnizacion : 0}
                                                              readOnly
                                                              className="form-control-plaintext text-right"/>
                                            </td>
                                            <td>
                                                <ReactNumeric valuex={item.valRasa ? item.valRasa : 0}
                                                              readOnly
                                                              className="form-control-plaintext text-right"/>

                                            </td>
                                            <td>
                                                <ReactNumeric valuex={item.valIndemnizacion ? item.valIndemnizacion : 0}
                                                              readOnly
                                                              className="form-control-plaintext text-right"/>
                                            </td>
                                            <td>
                                                <ReactNumeric valuex={item.valPagoParcial ? item.valPagoParcial : 0}
                                                              readOnly
                                                              className="form-control-plaintext text-right"/>
                                            </td>
                                            <td>
                                                <ReactNumeric valuex={item.valPagoProvOtros ? item.valPagoProvOtros : 0}
                                                              readOnly
                                                              className="form-control-plaintext text-right"/>
                                            </td>
                                            <td>
                                                <ReactNumeric valuex={item.valRecibir ? item.valRecibir : 0}
                                                              readOnly
                                                              className="form-control-plaintext text-right"/>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>

                                </tbody>
                            </Table>
                        </React.Fragment>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <React.Fragment>
                        <Alerts ref={this.alert}/>
                        <Container className="text-center">
                            <Col className={"table-responsive"}>
                                <React.Fragment>
                                    <h4 className="font-weight-lighter text-left">{"Liquidación"}</h4>
                                    <Table className="table table-borderless table-hover">
                                        <thead>
                                        <tr className="text-secondary">
                                            <th className="bg-white" scope="col">Item</th>
                                            <th className="bg-white" scope="col">Forma Pago</th>
                                            <th className="bg-white" scope="col">Fc Liquida</th>
                                            <th className="bg-white" scope="col">Valor</th>
                                            <th className="bg-white" scope="col">Fc Docum</th>
                                            <th className="bg-white" scope="col">Banco</th>
                                            <th className="bg-white" scope="col">Cheque</th>
                                            <th className="bg-white" scope="col">Cta Cte</th>
                                            <th className="bg-white" scope="col">Tipo Pago</th>
                                            <th className="bg-white" scope="col">Observaciones</th>
                                            <th className="bg-white" scope="col">Finiquito</th>
                                            <th className="bg-white" scope="col">Fecha Anticipo</th>
                                            <th className="bg-white" scope="col">Valor Anticipo</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.props.liquidaciones.length === 0 ?
                                            <React.Fragment>
                                                <tr>
                                                    <td colSpan={5}>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                {this.props.liquidaciones.map((item, index) => (
                                                    <tr key={item.cdPago}>
                                                        <td>
                                                            <span>{index + 1}</span>
                                                        </td>
                                                        <td className="text-left">
                                                            <span>{item.formaPago}</span>
                                                        </td>
                                                        <td className="text-left">
                                                    <span>
                                                        {item.fcPago ? moment(item.fcPago).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                                        </td>
                                                        <td className="text-left">
                                                            <span>{item.valPago}</span>
                                                        </td>
                                                        <td className="text-left">
                                                    <span>
                                                        {item.fcDocPago ? moment(item.fcDocPago).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                                        </td>
                                                        <td className="text-left">
                                                            <span>{item.banco}</span>
                                                        </td>
                                                        <td className="text-left">
                                                            <span>{item.cheque}</span>
                                                        </td>
                                                        <td className="text-left">
                                                            <span>{item.ctaCte}</span>
                                                        </td>
                                                        <td className="text-left">
                                                            <span>{item.dscRubro}</span>
                                                        </td>
                                                        <td className="text-left">
                                                            <span>{item.obsPago}</span>
                                                        </td>
                                                        <td className="text-center">
                                                            <span>{item.finiquito ? 'NO' : 'SI'}</span>
                                                        </td>
                                                        <td className="text-left">
                                                    <span>
                                                        {item.fcPagoSol ? moment(item.fcPagoSol).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                                        </td>
                                                        <ReactNumeric valuex={item.valorSol ? item.valorSol : 0}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
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
                </Row>
            </Container>
        )
    }
}