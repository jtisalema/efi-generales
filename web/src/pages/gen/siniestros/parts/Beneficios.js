import React, {Component} from "react";
import {Col, Container, Table} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";
import moment from "moment";

export class Beneficios extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: "",
            editing: false,
        };
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
        let totales = this.props.totales;
        return (
            <React.Fragment>
                <Alerts ref={this.alert}/>
                <Container className="text-center">
                    <Col className={"table-responsive"}>
                        <React.Fragment>
                            <Table className="table table-borderless table-hover">
                                <thead>
                                <tr className="text-secondary">
                                    {this.props.vam && <>
                                        <th className="bg-white" scope="col">Item</th>
                                        <th className="bg-white" scope="col">Beneficio</th>
                                        <th className="bg-white" scope="col">+Valor Incurrido</th>
                                        <th className="bg-white" scope="col">-Valor Excesos</th>
                                        <th className="bg-white" scope="col">-Val No Elegible</th>
                                        <th className="bg-white" scope="col"
                                            title="Valor a pagar sin descontar deducible ni Coaseguro">=Valor Cubierto
                                        </th>
                                        <th className="bg-white" scope="col">-Valor Deducible</th>
                                        <th className="bg-white" scope="col" title={"Porcentaje Coaseguro"}>% Coa</th>
                                        <th className="bg-white" scope="col" title={"Valor Coaseguro"}>-Valor Coa</th>
                                        <th className="bg-white" scope="col" title={"Total a pagar sin Coaseguro"}>Total
                                            a pagar
                                        </th>
                                        <th className="bg-white" scope="col">Notas</th>
                                    </>}

                                    {!this.props.vam && <>
                                        <th className="bg-white" scope="col">Item</th>
                                        <th className="bg-white" scope="col">Cobertura</th>
                                        <th className="bg-white" scope="col">Valor Límite</th>
                                        <th className="bg-white" scope="col">% Sinies</th>
                                        <th className="bg-white" scope="col">% Aseg</th>
                                        <th className="bg-white" scope="col">Mínimo</th>
                                        <th className="bg-white" scope="col">Val Fijo</th>
                                        <th className="bg-white" scope="col">Observaciones</th>
                                    </>}
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.beneficios.length === 0 ?
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={5}>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.props.beneficios.map((item, index) => (
                                            <tr key={item.cdCobDedSiniestro}>
                                                {this.props.vam && <>
                                                    <td>
                                                        <span>{index + 1}</span>
                                                    </td>
                                                    <td className="text-left">
                                                        <span>{item.nmCobertura}</span>
                                                    </td>
                                                    <td className="text-right">
                                                    <span>
                                                        <ReactNumeric valuex={item.valSiniestro} readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                                    </td>
                                                    <td className="text-right">
                                                    <span>
                                                        <ReactNumeric valuex={item.valExceso} readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                                    </td>
                                                    <td className="text-right">
                                                    <span>
                                                        <ReactNumeric valuex={item.valNoelegible} readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                                    </td>
                                                    <td className="text-right">
                                                    <span>
                                                        <ReactNumeric valuex={item.valCubierto}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                                    </td>

                                                    <td className="text-left">
                                                    <span>
                                                        <ReactNumeric valuex={item.valDeducible ? item.valDeducible : 0}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                                    </td>
                                                    <td className="text-left">
                                                    <span>
                                                        <ReactNumeric valuex={item.pctVAseg ? item.pctVAseg : 0}
                                                                      readOnly currencySymbol="%"
                                                                      currencySymbolPlacement={"s"}
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                                    </td>
                                                    <td className="text-left">
                                                    <span>
                                                        <ReactNumeric valuex={item.valMontoCoa ? item.valMontoCoa : 0}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                                    </td>
                                                    <td className="text-left">
                                                    <span>
                                                        <ReactNumeric valuex={item.valFijo ? item.valFijo : 0}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                                    </td>

                                                    <td className="text-left">
                                                        <span>{item.observaciones}</span>
                                                    </td>
                                                </>}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                }
                                <React.Fragment>
                                    {this.props.beneficios.map((item, index) => (
                                        <tr key={item.cdCobertura}>
                                            {!this.props.vam && <>
                                                <td>
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td className="text-right">
                                                    <span>{item.nmCobertura}</span>
                                                </td>
                                                <td className="text-right">
                                                    <ReactNumeric valuex={item.valLimite ? item.valLimite : 0}
                                                                  readOnly
                                                                  className="form-control-plaintext text-right"/>
                                                </td>
                                                <td className="text-right">
                                                    <ReactNumeric valuex={item.pctReclamo ? item.pctReclamo : 0}
                                                                  readOnly
                                                                  className="form-control-plaintext text-right"/>
                                                </td>
                                                <td className="text-right">
                                                    <ReactNumeric valuex={item.pctVAseg ? item.pctVAseg : 0}
                                                                  readOnly
                                                                  className="form-control-plaintext text-right"/>
                                                </td>
                                                <td className="text-right">
                                                    <ReactNumeric valuex={item.valMinimo ? item.valMinimo : 0}
                                                                  readOnly
                                                                  className="form-control-plaintext text-right"/>
                                                </td>
                                                <td className="text-right">
                                                    <ReactNumeric valuex={item.valFijo ? item.valFijo : 0}
                                                                  readOnly
                                                                  className="form-control-plaintext text-right"/>
                                                </td>
                                                <td className="text-right">
                                                    <span>{item.observaciones}</span>
                                                </td>
                                            </>}
                                        </tr>
                                    ))}
                                </React.Fragment>
                                </tbody>
                            </Table>
                        </React.Fragment>
                        <br/>
                        {this.props.vam ?
                            <>
                                <h4 className={"text-left "}>Liquidación del Siniestro</h4>
                                <React.Fragment>
                                    <table className="table table-borderless table-hover">
                                        <thead>
                                        <tr className="text-secondary">
                                            <th className="bg-white" scope="col">Item</th>
                                            <th className="bg-white" scope="col">Forma Pago</th>
                                            <th className="bg-white" scope="col">Fc Liquida</th>
                                            <th className="bg-white" scope="col">Valor</th>
                                            <th className="bg-white" scope="col">Fc Docum</th>
                                            <th className="bg-white" scope="col">Banco</th>
                                            <th className="bg-white" scope="col">Cheque</th>
                                            <th className="bg-white" scope="col">Cta Cte</th>
                                            <th className="bg-white" scope="col">Tipo Pago</th>
                                            <th className="bg-white" scope="col">Observaciones</th>
                                            <th className="bg-white" scope="col">Finiquito</th>
                                            <th className="bg-white" scope="col">Fecha Anticipo</th>
                                            <th className="bg-white" scope="col">Valor Anticipo</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <React.Fragment>
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
                                                    <td className="text-center">
                                                        <span>{item.finiquito ? 'NO' : 'SI'}</span>
                                                    </td>
                                                    <td className="text-left">
                                                    <span>
                                                        {item.fcPagoSol ? moment(item.fcPagoSol).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}
                                                    </span>
                                                    </td>
                                                    <ReactNumeric valuex={item.valorSol ? item.valorSol : 0}
                                                                  readOnly
                                                                  className="form-control-plaintext text-right"/>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                        </tbody>
                                    </table>
                                </React.Fragment>
                            </>
                            :
                            ''
                        }
                    </Col>
                </Container>
            </React.Fragment>
        )
    }
}