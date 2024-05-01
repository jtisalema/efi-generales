import React, {Component} from "react";
import {Col, Container} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";

export class FormaPrima extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: "",
            editing: false
        };
    }

    componentDidUpdate(prevProps) {

    }

    periodo = (id) => {
        let ret;
        id = (id || 7).toString();
        switch (id) {
            case '1':
                ret = 'MENSUAL';
                break;
            case '2':
                ret = 'BIMENSUAL';
                break;
            case '3':
                ret = 'TRIMESTRAL';
                break;
            case '4':
                ret = 'CORRIENTE';
                break;
            case '5':
                ret = 'DIFERIDO';
                break;
            case '6':
                ret = 'INMEDIATO';
                break;
            case '0':
                ret = 'INMEDIATO';
                break;
            default :
                ret = '';
                break;
        }
        return ret;
    };

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
                                    <th className="bg-white">Forma</th>
                                    <th className="bg-white">Valor</th>
                                    <th className="bg-white">Período Prima</th>
                                    <th className="bg-white">Costo Tarjeta</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.props.primas || []).map((item, index) => (
                                    <tr key={item.cdFormaPrima}>
                                        <td>
                                            <span>{index + 1}</span>
                                        </td>
                                        <td className="text-left" style={{maxWidth: 180}}>
                                            <span>{item.dscRubro}</span>
                                        </td>
                                        <td className="text-left" style={{maxWidth: 150}}>
                                                    <span>
                                                        <ReactNumeric
                                                            valuex={item.valFormaPrima ? item.valFormaPrima : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
                                        </td>
                                        <td className="text-center" style={{maxWidth: 180}}>
                                            <span>{this.periodo(item.periodo)}</span>
                                        </td>
                                        <td className="text-right" style={{maxWidth: 180}}>
                                                    <span>
                                                        <ReactNumeric
                                                            valuex={item.valTarjeta ? item.valTarjeta : 0}
                                                            readOnly
                                                            className="form-control-plaintext text-right"/>
                                                    </span>
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