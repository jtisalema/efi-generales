import React, {Component} from "react";
import {Col, Container, Table} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import moment from "moment";

export class Gestion extends Component {

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
                                    <th className="bg-white" scope="col">Fecha</th>
                                    <th className="bg-white" scope="col">Gestión / Observaciones</th>
                                    <th className="bg-white" scope="col">Estado</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.gestion.length === 0 ?
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={4}>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.props.gestion.map((item, index) => (
                                            <tr key={item.cdCobertura}>
                                                <td className="text-center">
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {item.fcInspeccion ? moment(item.fcInspeccion).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.observaciones}</span>
                                                </td>
                                                <td className="text-left">
                                                    <span>{item.estado}</span>
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