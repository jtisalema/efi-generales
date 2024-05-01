import React, {Component} from "react";
import {Col, Container, Table} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";
import moment from "moment";
import "moment/locale/es"

export class Facturas extends Component {

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
                                    <th className="bg-white" scope="col">Item</th>
                                    <th className="bg-white" scope="col">No. Factura</th>
                                    <th className="bg-white" scope="col">Fc Emisión</th>
                                    <th className="bg-white" scope="col">Proveedor</th>
                                    <th className="bg-white" scope="col">Valor</th>
                                    {!this.props.vam && <>
                                        <th className="bg-white" scope="col">Val No Cubierto</th>
                                        <th className="bg-white" scope="col">Val Cubierto</th>
                                        <th className="bg-white" scope="col">Val Pagado</th>
                                        <th className="bg-white" scope="col">Aprobado</th>
                                    </>}
                                    <th className="bg-white" scope="col">Observaciones</th>
                                    {!this.props.vam && <>
                                        <th className="bg-white" scope="col">Cobertura</th>
                                    </>}
                                    {this.props.vam && <>
                                        <th className="bg-white" scope="col">Beneficios</th>
                                    </>}
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.facturas.length === 0 ?
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={4}>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.props.facturas.map((item, index) => (
                                            <tr key={item.cdGastosVam}>
                                                <td>
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.numRecibo}</span>
                                                </td>
                                                <td className="text-left">
                                        <span>
                                    {item.fcGasto ? moment(item.fcGasto).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                        </span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.detalle}</span>
                                                </td>
                                                <td className="text-left">
                                                    <ReactNumeric valuex={item.valor ? item.valor : 0}
                                                                  readOnly
                                                                  className="form-control-plaintext text-right"/>
                                                </td>
                                                {!this.props.vam && <>
                                                    <td className="text-right">
                                                        <ReactNumeric
                                                            valuex={item.valNoCubierto ? item.valNoCubierto : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </td>
                                                    <td className="text-right">
                                                        <ReactNumeric valuex={item.valorAPagar ? item.valorAPagar : 0}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </td>
                                                    <td className="text-right">
                                                        <ReactNumeric valuex={item.valorPagado ? item.valorPagado : 0}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </td>
                                                    <td className="text-center">
                                                        <span>{item.aprobado ? 'SI' : 'NO'}</span>
                                                    </td>
                                                </>}
                                                <td className="text-left">
                                                    <span>{item.obsGastoVam}</span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.nmCobertura}</span>
                                                </td>

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