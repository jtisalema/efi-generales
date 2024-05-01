import React, {Component} from "react";
import {Col, Container, Table} from "reactstrap";
import Alerts from "../../../../../components/Alerts";

export class Notas extends Component {

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
                <Container className="text-center" isOpen={this.props.open} size="xl">
                    <Col className={"table-responsive"}>
                        <React.Fragment>
                            <Table className="table table-borderless table-hover">
                                <thead>
                                <tr className="text-secondary">
                                    <th className="bg-white" scope="col">Item</th>
                                    <th className="bg-white" scope="col">Num</th>
                                    <th className="bg-white" scope="col">Texto</th>
                                    <th className="bg-white" scope="col">Activo</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.notas.length === 0 ?
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={5}>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.props.notas.map((item, index) => (
                                            <tr key={item.cdAclaratorio}>
                                                <td className="text-left">
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td>
                                                    <span>{item.numAclaratorio}</span>
                                                </td>
                                                <td className="text-left">
                                                    <pre>{item.txtAclaratorio}</pre>
                                                </td>
                                                <td className="text_align-center" width={50}>
                                                    <span>{item.activo ? 'SI' : 'NO'}</span>
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