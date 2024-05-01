import React, {Component} from "react";
import {Col, Container} from "reactstrap";
import Alerts from "../../../../components/Alerts";

export class Coberturas extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: "",
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
                                    <th className="bg-white">Cobertura</th>
                                    <th className="bg-white">Valor Límite</th>
                                    <th className="bg-white">Unidad</th>
                                    <th className="bg-white">Observaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.props.coberturas || []).map((item, index) => (
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
                                        <td className="text-center">
                                            <span>{item.obsCobNegocio}</span>
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