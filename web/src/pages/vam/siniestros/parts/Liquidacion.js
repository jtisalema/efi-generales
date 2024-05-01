import React, {Component} from "react";
import {Col, Container} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import moment from "moment";
import "moment/locale/es"

export class Liquidacion extends Component {

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
        id = id.toString();
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
                ret = '7';
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
                                    <th className="bg-white">Forma Pago</th>
                                    <th className="bg-white">Fc Liquida</th>
                                    <th className="bg-white">Valor</th>
                                    <th className="bg-white">Fc Docum</th>
                                    <th className="bg-white">Banco</th>
                                    <th className="bg-white">Cheque</th>
                                    <th className="bg-white">Cta Cte</th>
                                    <th className="bg-white">Tipo Pago</th>
                                    <th className="bg-white">Observaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.props.liquidaciones || []).map((item, index) => (
                                    <tr key={item.cdPago}>
                                        <td>
                                            <span>{index + 1}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.formaPago}</span>
                                        </td>
                                        <td className="text-left">
                                                    <span>
                                                        {item.fcPago ? moment(item.fcPago).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.valPago}</span>
                                        </td>
                                        <td className="text-left">
                                                    <span>
                                                        {item.fcDocPago ? moment(item.fcDocPago).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.banco}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.cheque}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.ctaCte}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.dscRubro}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.obsPago}</span>
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