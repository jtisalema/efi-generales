import React, {Component} from "react";
import {Col, Container, Table} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";

export class Clausulas extends Component {

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
                    <Col className={"table-responsive "}>
                        <React.Fragment>
                            <Table className="adjusttd text-center">
                                <thead className="text-primary">
                                <tr>
                                    <th>Item</th>
                                    <th>Clausula</th>
                                    <th className="text-right">Valor Limite</th>
                                    <th>Observaciones</th>
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