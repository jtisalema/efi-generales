import React, {Component} from "react";
import {Col, Container, Table} from "reactstrap";
import Alerts from "../../../../components/Alerts";

export class Exclusiones extends Component {

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
                            <Table className="adjusttd text-center">
                                <thead className="text-primary">
                                <tr>
                                    <th>Item</th>
                                    <th>Exclusion</th>
                                    <th>Observaciones</th>
                                    <th>Aceptada</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.exclusiones.length === 0 ?
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={4}>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.props.exclusiones.map((item, index) => (
                                            <tr key={item.cdExcNegocio}>
                                                <td>
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.dscExclusion}</span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.obsExcNegocio}</span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.aceptada}</span>
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