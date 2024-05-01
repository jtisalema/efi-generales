import React, {Component} from "react";
import {Col, Container} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import moment from "moment";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";

export class Facturas extends Component {

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
                                    <th className="bg-white">No. Factura</th>
                                    <th className="bg-white">Fc Emisión</th>
                                    <th className="bg-white">Detalle</th>
                                    <th className="bg-white">Valor</th>
                                    <th className="bg-white">Observaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.props.facturas || []).map((item, index) => (
                                    <tr key={item.cdGastosVam}>
                                        <td>
                                            <span>{index + 1}</span>
                                        </td>
                                        <td className="text-right">
                                            <span>{item.numRecibo}</span>
                                        </td>
                                        <td className="text-center">
                                                    <span>
                                                        {item.fcGasto ? moment(item.fcGasto).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                        </td>
                                        <td>
                                            <span>{item.detalle}</span>
                                        </td>
                                        <td className="text-right">
                                            <ReactNumeric valuex={item.valor ? item.valor : 0}
                                                          readOnly
                                                          className="form-control-plaintext text-right"/>
                                        </td>
                                        <td>
                                            <span>{item.obsGastoVam}</span>
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