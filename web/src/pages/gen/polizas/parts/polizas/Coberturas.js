import React, {Component} from "react";
import {Col, Container, Table} from "reactstrap";
import Alerts from "../../../../../components/Alerts";

export class Coberturas extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: "",
        };
    }

    render() {
        let vida = this.props.vida;
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
                                    <th className="bg-white" scope="col">Cobertura</th>
                                    <th className="bg-white" scope="col">Valor Límite</th>
                                    <th className="bg-white" scope="col">Unidad</th>
                                    {!vida &&
                                        <>
                                            <th className="bg-white" scope="col">Tasa</th>
                                            <th className="bg-white" scope="col">Valor Prima</th>
                                            <th className="bg-white" scope="col">Cob Adc</th>
                                        </>}
                                    <th className="bg-white" scope="col">Observaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.coberturas.length === 0 ?
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={5}>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.props.coberturas.map((item, index) => (
                                            <tr key={item.cdCobNegocio}>
                                                <td>
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.nmCobertura}</span>
                                                </td>
                                                <td className="text-right">
                                                    <span>{item.valLimite}</span>
                                                </td>
                                                <td className="text-center">
                                                    <span>{item.dscRubro}</span>
                                                </td>
                                                {!vida &&
                                                    <>
                                                        <td className="text-right">
                                                            <span>{item.tasa}</span>
                                                        </td>
                                                        <td className="text-right">
                                                            <span>{item.valPrima}</span>
                                                        </td>
                                                        <td className="text-center">
                                                            <span>{item.adicionalRamo === "X" ? "SI" : "NO"}</span>
                                                        </td>
                                                    </>}
                                                <td className="text-left">
                                                    <span>{item.obsCobNegocio}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>}
                                </tbody>
                            </Table>
                        </React.Fragment>
                    </Col>
                </Container>
            </React.Fragment>
        )
    }
}