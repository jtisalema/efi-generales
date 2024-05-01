import React, {Component} from "react";
import {Col, Container, Row, Table} from "reactstrap";
import Alerts from "../../../../../components/Alerts";
import ReactNumeric from "../../../../../components/ReactNumeric/ReactNumeric";

export class Deducibles extends Component {

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
                                    <th className="bg-white" scope="col">Deducible</th>
                                    <th className="bg-white" scope="col">Valor Fijo</th>
                                    <th className="bg-white" scope="col">Observaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.deducibles.length === 0 ?
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={4}>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.props.deducibles.map((item, index) => (
                                            <tr key={item.cdDeducible}>
                                                <td>
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td style={{maxWidth: 220}}>
                                                    <span>{item.nmCobertura}</span>
                                                </td>
                                                <td style={{maxWidth: 120}}>
                                                    <span>
                                                        <ReactNumeric
                                                            valuex={item.valFijo ? item.valFijo : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                                </td>
                                                <td style={{maxWidth: 180}}>
                                                    <span>{item.obsDeducible}</span>
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

export const DeduciblesVehi = ({otros, coberturas}) => {

    return (
        <Container className="text-center">
            <Row>

                <Col className={"table-responsive col-lg-12"}>
                    <React.Fragment>
                        <br/>
                        <h4 className="font-weight-lighter text-left">{"Deducibles por Cobertura"}</h4>
                        <Table className="table table-borderless table-hover">
                            <thead>
                            <tr className="text-secondary">
                                <th className="bg-white" scope="col">Item</th>
                                <th className="bg-white" scope="col">Cobertura</th>
                                <th className="bg-white" scope="col">%Val Sinies</th>
                                <th className="bg-white" scope="col">%Val Asegur</th>
                                <th className="bg-white" scope="col">Val Mínimo</th>
                                <th className="bg-white" scope="col">Val Fijo</th>
                                <th className="bg-white" scope="col">Observaciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {coberturas.length === 0 ?
                                <React.Fragment>
                                    <tr>
                                        <td colSpan={4}>
                                        </td>
                                    </tr>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {coberturas.map((item, index) => (
                                        <tr key={item.cdDeducible}>
                                            <td>
                                                <span>{index + 1}</span>
                                            </td>
                                            <td style={{maxWidth: 220}}>
                                                <span>{item.nmCobertura}</span>
                                            </td>
                                            <td style={{maxWidth: 120}}>
                                                    <span>
                                                        <ReactNumeric
                                                            valuex={item.pctReclamo ? item.pctReclamo : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                            </td>
                                            <td style={{maxWidth: 120}}>
                                                    <span>
                                                        <ReactNumeric
                                                            valuex={item.pctVAseg ? item.pctVAseg : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                            </td>
                                            <td style={{maxWidth: 180}}>
                                                <span>
                                                        <ReactNumeric
                                                            valuex={item.valMinimo ? item.valMinimo : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                            </td>
                                            <td style={{maxWidth: 180}}>
                                                <span>
                                                        <ReactNumeric
                                                            valuex={item.valFijo ? item.valFijo : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                            </td>
                                            <td style={{maxWidth: 180}}>
                                                <span>{item.obsDeducible}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            }
                            </tbody>
                        </Table>
                    </React.Fragment>
                </Col>
            </Row>

            <Row>
                <Col className={"table-responsive col-lg-12"}>
                    <React.Fragment>
                        <br/>
                        <h4 className="font-weight-lighter text-left">{"Otros Deducibles"}</h4>
                        <Table className="table table-borderless table-hover">
                            <thead>
                            <tr className="text-secondary">
                                <th className="bg-white" scope="col">Item</th>
                                <th className="bg-white" scope="col">%Val Sinies</th>
                                <th className="bg-white" scope="col">%Val Asegur</th>
                                <th className="bg-white" scope="col">Val Mínimo</th>
                                <th className="bg-white" scope="col">Val Fijo</th>
                                <th className="bg-white" scope="col">Observaciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {otros.length === 0 ?
                                <React.Fragment>
                                    <tr>
                                        <td colSpan={4}>
                                        </td>
                                    </tr>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {otros.map((item, index) => (
                                        <tr key={item.cdDeducible}>
                                            <td>
                                                <span>{index + 1}</span>
                                            </td>
                                            <td style={{maxWidth: 120}}>
                                                    <span>
                                                        <ReactNumeric
                                                            valuex={item.pctReclamo ? item.pctReclamo : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                            </td>
                                            <td style={{maxWidth: 120}}>
                                                    <span>
                                                        <ReactNumeric
                                                            valuex={item.pctVAseg ? item.pctVAseg : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                            </td>
                                            <td style={{maxWidth: 180}}>
                                                <span>
                                                        <ReactNumeric
                                                            valuex={item.valMinimo ? item.valMinimo : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                            </td>
                                            <td style={{maxWidth: 180}}>
                                                <span>
                                                        <ReactNumeric
                                                            valuex={item.valFijo ? item.valFijo : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                            </td>
                                            <td style={{maxWidth: 180}}>
                                                <span>{item.obsDeducible}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            }
                            </tbody>
                        </Table>
                    </React.Fragment>
                </Col>
            </Row>
        </Container>

    );
}