import React, {Component} from "react";
import {Col, Container} from "reactstrap";
import Alerts from "../../../../components/Alerts";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";

export class Beneficios extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: "",
        };
    }

    componentDidUpdate(prevProps) {

    }


    render() {
        let totales = this.props.totales;
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
                                    <th className="bg-white" scope="col">Beneficio</th>
                                    <th className="bg-white" scope="col">+Valor Incurrido</th>
                                    <th className="bg-white" scope="col">-Valor Excesos</th>
                                    <th className="bg-white" scope="col">-Val No Elegible</th>
                                    {/*<th className="bg-white" scope="col">=Val No Cubierto</th>*/}
                                    <th className="bg-white"
                                        title="Valor a pagar sin descontar deducible ni Coaseguro">=Valor Cubierto
                                    </th>
                                    <th className="bg-white" title={"Aplica Deducible"}>Aplica Deducible</th>
                                    <th className="bg-white" scope="col">-Valor Deducible</th>
                                    <th className="bg-white" title={"Total a pagar sin Coaseguro"}>Total a pagar
                                    </th>
                                    <th className="bg-white" title={"Aplica Coaseguro"}>Coa</th>
                                    <th className="bg-white" title={"Porcentaje Coaseguro"}>% Coa</th>
                                    <th className="bg-white" title={"Valor Coaseguro"}>-Valor Coa</th>
                                    <th className="bg-white" scope="col">Valor Indemnizado</th>
                                    <th className="bg-white" scope="col">No. Liquidación</th>
                                    <th className="bg-white" scope="col">Notas</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.props.beneficios || []).map((item, index) => (
                                    <tr key={item.cdCobDedSiniestro}>
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
                                        {/*<td className="text-left">*/}
                                        {/*    <span>*/}
                                        {/*        <ReactNumeric valuex={item.valMinimo} readOnly*/}
                                        {/*                      className="form-control-plaintext text-right"/>*/}
                                        {/*    </span>*/}
                                        {/*</td>*/}
                                        <td className="text-right">
                                                    <span>
                                                        <ReactNumeric valuex={item.valCubierto}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                        </td>
                                        <td>
                                            <span>{item.flgDed ? 'SI' : 'NO'}</span>
                                        </td>
                                        <td className="text-left">
                                                    <span>
                                                        <ReactNumeric valuex={item.valDeducible ? item.valDeducible : 0}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                        </td>
                                        <td className="text-right" style={{minWidth: 80}}>
                                            <span>{item.valTotal}</span>
                                        </td>
                                        <td><span>{item.flgCoa ? 'SI' : 'NO'}</span></td>
                                        <td className="text-left">
                                                    <span>
                                                        <ReactNumeric valuex={item.pctVAseg ? item.pctVAseg : 0}
                                                                      readOnly currencySymbol="%"
                                                                      currencySymbolPlacement={"s"}
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.valMontoCoa}</span>
                                        </td>
                                        <td className="text-left">
                                                    <span>
                                                        <ReactNumeric valuex={item.valFijo ? item.valFijo : 0}
                                                                      readOnly
                                                                      className="form-control-plaintext text-right"/>
                                                    </span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.numLiquidacion}</span>
                                        </td>
                                        <td className="text-left">
                                            <span>{item.observaciones}</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td/>
                                    <td className="text-left">
                                        totales:
                                    </td>
                                    <td className="text-right">
                                        <ReactNumeric valuex={totales.valSiniestro} readOnly
                                                      className="form-control-plaintext text-right font-weight-bold"/>
                                    </td>
                                    <td className="text-right">
                                        <ReactNumeric valuex={totales.valExceso} readOnly
                                                      className="form-control-plaintext text-right font-weight-bold"/>
                                    </td>
                                    <td className="text-right">
                                        <ReactNumeric valuex={totales.valNoelegible} readOnly
                                                      className="form-control-plaintext text-right font-weight-bold"/>
                                    </td>

                                    <td className="text-right">
                                        <ReactNumeric valuex={totales.valCubierto}
                                                      readOnly
                                                      className="form-control-plaintext text-right font-weight-bold"/>
                                    </td>
                                    <td/>
                                    <td className="text-left">
                                        <ReactNumeric
                                            valuex={totales.valDeducible ? totales.valDeducible : 0}
                                            readOnly
                                            className="form-control-plaintext text-right font-weight-bold"/>
                                    </td>
                                    <td className="text-right" style={{minWidth: 80}}>
                                        <span>{totales.valTotal}</span>
                                    </td>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td className="text-left">
                                        <ReactNumeric valuex={totales.valFijo ? totales.valFijo : 0}
                                                      readOnly
                                                      className="form-control-plaintext text-right font-weight-bold"/>
                                    </td>
                                    <td/>
                                    <td/>
                                </tr>
                                </tfoot>
                            </table>
                        </React.Fragment>

                    </Col>

                </Container>
            </React.Fragment>
        )
    }
}