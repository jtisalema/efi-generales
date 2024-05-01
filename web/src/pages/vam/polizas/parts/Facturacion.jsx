import React, {Component} from "react";
import {routes} from "../../UtilsVam";
import axios from "axios";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";
import {JedaiCalendarioViewText} from "../../../../components/UqaiCalendario";

export class Facturacion extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            item: {},
            financiamientoList: [],
            totalPago: 0,
            totalSaldo: 0
        };
    }

    componentDidMount() {
        let {open} = this.props;
        if (open) {
            this.fetchData();
        }
    }

    componentDidUpdate(prevProps) {
        let {open} = this.props;
        let openOld = prevProps.open;

        if (open !== openOld) {
            if (open) {
                this.fetchData();
            } else {
                this.setState({item: {}});
            }
        }
    }

    fetchData() {
        this.getFormaPago();
    };


    getFormaPago = (idComp, cdUbicacion) => {
        axios.get(routes.api + '/formaPago', {
            params: {
                cdCompania: this.props.poliza.cdCompania,
                cdCotizacion: this.props.poliza.cdCotizacion
            }
        }).then(resp => {
            let data = resp.data;
            this.setState({
                item: data.formaPago,
                financiamientoList: data.financiamientoList,
                totalPago: data.totalPago,
                totalSaldo: data.totalSaldo
            });
        }).catch(error => {

            }
        );
    };

    closeModal = () => {
        this.props.toggleModal(false);
        this.setState({list: [], item: {}});
    };

    showDetalle = finZ => {
        axios.get(routes.api + '/clausulas', {
            params: {
                cdCompania: 1,
                cdUbicacion: 666
            }
        }).then(resp => {
            //this.setState({detalle: resp.data});
            this.toggleModalDetalle(true);
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    toggleModalDetalle = open => {
        this.setState({modalDetalle: open});
    };

    render() {
        let item = this.state.item;

        return (
            <div className="table-responsive">
                <table className="table table-borderless table-hover">
                    <thead>
                    <tr className="text-secondary">
                        <th className="bg-white">Forma Pago</th>
                        <th className="bg-white">Prima Neta</th>
                        <th className="bg-white">Val. Finan.</th>
                        <th className="bg-white">Der. Emi.</th>
                        <th className="bg-white">Super Cias</th>
                        <th className="bg-white">Seg. Camp</th>
                        <th className="bg-white">Otro Valor</th>
                        <th className="bg-white">IVA</th>
                        <th className="bg-white">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{item.frmPago}</td>
                        <td>
                            <ReactNumeric
                                valuex={item.totPrima ? item.totPrima : 0}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                        <td>
                            <ReactNumeric
                                valuex={item.valFinanciamiento ? item.valFinanciamiento : 0}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                        <td>
                            <ReactNumeric
                                valuex={item.dereEmision ? item.dereEmision : 0}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                        <td>
                            <ReactNumeric
                                valuex={item.superBancos ? item.superBancos : 0}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                        <td>
                            <ReactNumeric
                                valuex={item.seguroC ? item.seguroC : 0}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                        <td>
                            <ReactNumeric
                                valuex={item.valRubro ? item.valRubro : 0}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                        <td>
                            <ReactNumeric
                                valuex={item.iva ? item.iva : 0}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                        <td>
                            <ReactNumeric
                                valuex={item.totalPago ? item.totalPago : 0}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                    </tr>
                    </tbody>

                </table>

                <br/>

                <h4>Cuotas</h4>

                <table className="table table-borderless table-hover">
                    <thead>
                    <tr className="text-secondary">
                        <th className="bg-white">No.</th>
                        <th className="bg-white">Valor</th>
                        <th className="bg-white">Saldo</th>
                        <th className="bg-white">Fc. Vencimiento</th>
                        <th className="bg-white">Pagado</th>
                        <th className="bg-white">No Factura</th>
                        <th className="bg-white">Fc Emision</th>
                        <th className="bg-white" title="Fecha Vigencia Desde">Fc. Vig Desde</th>
                        <th className="bg-white" title="Fecha Vigencia Hasta">Fc. Vig Hasta</th>
                        {/*<th className="text-center">Ver Detalle</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {(this.state.financiamientoList || []).map(finZ => (
                        <tr key={finZ.cdFinanciamiento}>
                            <td>{finZ.ordinal}</td>
                            <td className="text-right">
                                <ReactNumeric
                                    valuex={finZ.valor}
                                    readOnly
                                    className="form-control-plaintext text-right"/>
                            </td>
                            <td className="text-right">
                                <ReactNumeric
                                    valuex={finZ.saldoPago}
                                    readOnly
                                    className="form-control-plaintext text-right"/>
                            </td>
                            <td>
                                <JedaiCalendarioViewText value={finZ.fcVencimiento}/>
                            </td>
                            <td>{finZ.flgPago === 'S' ? 'SI' : 'NO'}</td>
                            <td className={finZ.detalles ? 'red' : ''}>{finZ.factAseg}</td>

                            <td>
                                <JedaiCalendarioViewText value={finZ.fcIngresoFactura}/>
                            </td>
                            <td>
                                <JedaiCalendarioViewText value={finZ.fcDesde}/>
                            </td>
                            <td>
                                <JedaiCalendarioViewText value={finZ.fcHasta}/>
                            </td>

                            {/*<td>*/}

                            {/*    <span className="text-info option px-2"*/}
                            {/*          title="Ver condiciones" onClick={() => {*/}
                            {/*        this.showDetalle(finZ);*/}
                            {/*    }}>*/}
                            {/*        <i className="fas fa-eye mx-2"/>*/}
                            {/*        Detalle*/}
                            {/*   </span>*/}
                            {/*</td>*/}
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td className="text-right">Total</td>
                        <td className="text-right main-color t-bold">
                            <ReactNumeric
                                valuex={this.state.totalPago}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                        <td className="text-right main-color t-bold">
                            <ReactNumeric
                                valuex={this.state.totalSaldo}
                                readOnly
                                className="form-control-plaintext text-right"/>
                        </td>
                        <td>&#160;</td>
                        <td>&#160;</td>
                        <td>&#160;</td>
                        <td>&#160;</td>
                        <td>&#160;</td>
                        <td>&#160;</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        )
    }
}