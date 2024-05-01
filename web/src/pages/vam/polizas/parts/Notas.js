import React, {Component} from "react";
import {Col, Container} from "reactstrap";
import Alerts from "../../../../components/Alerts";

export class Notas extends Component {

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
                <Container className="text-center" isOpen={this.props.open} size="xl">
                    <Col className={"table-responsive"}>
                        <React.Fragment>
                            <table className="table table-borderless table-hover">
                                <thead>
                                <tr className="text-secondary">
                                    <th className="bg-white">Item</th>
                                    <th className="bg-white">Num</th>
                                    <th className="bg-white">Texto</th>
                                    <th className="bg-white">Activo</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.props.notas || []).map((item, index) => (
                                    <tr key={item.cdAclaratorio}>
                                        <td>
                                            <span>{index + 1}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.numAclaratorio}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.txtAclaratorio}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.activo ? 'SI' : 'NO'}</span>
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