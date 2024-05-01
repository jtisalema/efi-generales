import React, {Component} from "react";
import {Col, Container} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";

export class Deducibles extends Component {

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
                            <table className="table table-borderless table-hover">
                                <thead>
                                <tr className="text-secondary">
                                    <th className="bg-white">Item</th>
                                    <th className="bg-white">Deducible</th>
                                    <th className="bg-white">Valor Fijo</th>
                                    <th className="bg-white">Observaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.props.deducibles || []).map((item, index) => (
                                    <tr key={item.cdDeducible}>
                                        <td>
                                            <span>{index + 1}</span>
                                        </td>
                                        <td className="text-left" style={{maxWidth: 220}}>
                                            <span>{item.nmCobertura}</span>
                                        </td>
                                        <td className="text-left" style={{maxWidth: 120}}>
                                                    <span>
                                                        <ReactNumeric
                                                            valuex={item.valFijo ? item.valFijo : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                        </td>
                                        <td className="text-left" style={{maxWidth: 180}}>
                                            <span>{item.obsDeducible}</span>
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