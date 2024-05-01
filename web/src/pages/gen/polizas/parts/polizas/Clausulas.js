import React, {Component} from "react";
import {Col, Container, Table} from "reactstrap";
import Alerts from "../../../../../components/Alerts";
import ReactNumeric from "../../../../../components/ReactNumeric/ReactNumeric";


export class Clausulas extends Component {

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
                                    <th className="bg-white" scope="col">Cláusula</th>
                                    <th className="bg-white" scope="col">Valor Límite</th>
                                    <th className="bg-white" scope="col">Observaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.clausulas.length === 0 ?
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={4}>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.props.clausulas.map((item, index) => (
                                            <tr key={item.cdClausulaNegocio}>
                                                <td>
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.nmClausula}</span>
                                                </td>
                                                <td className="text-right">
                                                    <span>
                                                        <ReactNumeric
                                                            valuex={item.valLimite ? item.valLimite : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.obsClausulasNegocio}</span>
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