import React, {Component} from "react";
import {routes} from "../../UtilsGeneral";
import axios from "axios";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";
import {JedaiCalendarioViewText} from "../../../../components/UqaiCalendario";
import {Modal, ModalBody} from "reactstrap";
import {Contratante} from "./Contratante";
import {UqaiModalHeader} from "../../../../components/UqaiModal";

export class Facturacion extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            item: {},
            financiamientoList: [],
            totalPago: 0,
            totalSaldo: 0,
            vistaTabla: false
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
    }


    getFormaPago = () => {
        let {poliza, item, vida} = this.props;
        let id = '';
        // let id = (poliza.cdRamCotOri != null && (!item.numCotizacion.startsWith('R') && !item.numCotizacion.startsWith('C'))) ? poliza.cdRamCotOri : item.cdRamoCotizacion;
        id = item.cdCotizacion;

        axios.get(routes.api + '/polizas/formaPago', {
            params: {
                cdCompania: this.props.poliza.cdCompania,
                cdCotizacion: vida ? this.props.poliza.cotizacion.cdCotizacion : id,
                vam: vida
            }
        }).then(resp => {
            let data = resp.data;
            this.setState({
                item: data.item,
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

            }
        );
    };

    toggleModalDetalle = open => {
        this.setState({modalDetalle: open});
    };

    render() {
        let item = this.state.item;
        let ramos = this.props.ramos;

        return (
            <Modal className="modal-xl mx-auto" isOpen={this.props.open}>
                <UqaiModalHeader toggle={this.closeModal} title="Detalle Póliza"/>
                <ModalBody>
                    <div className="row">
                        <Contratante poliza={this.props.poliza} item={this.props.item} user={this.props.user}
                                     vida={this.props.vida} ramos={ramos}/>
                        <div className="col-lg-9">
                            <Pagos item={item} financiamientoList={this.state.financiamientoList}
                                   totalPago={this.state.totalPago} totalSaldo={this.state.totalSaldo}
                                   vistaTabla={this.state.vistaTabla}/>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}

export const Pagos = ({item, financiamientoList, totalPago, totalSaldo, vistaTabla, vam}) => {
    return (
        <>
            {vistaTabla &&
            <div className={"row"}>
                <div className="table-responsive">
                    <br/>
                    <table className="table table-borderless table-hover">
                        <thead>
                        <tr className={"text-secondary"}>
                            <th className="bg-white" scope="col">Forma Pago</th>
                            <th className="bg-white" scope="col">Prima Neta</th>
                            <th className="bg-white" scope="col">Val. Finan.</th>
                            <th className="bg-white" scope="col">Der. Emi.</th>
                            <th className="bg-white" scope="col">Super Cias</th>
                            <th className="bg-white" scope="col">Seg. Camp</th>
                            <th className="bg-white" scope="col">Otro Valor</th>
                            <th className="bg-white" scope="col">IVA</th>
                            <th className="bg-white" scope="col">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{item.frmPago === "EFECTIVO" || item.frmPago === "TARJETA" ? "CONTADO" : item.frmPago}</td>
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
                </div>
            </div>
            }
            <br/>
            <div className={"row"}>
                <div className="table-responsive">
                    <h4 className="font-weight-lighter text-left">Cuotas</h4>
                    <table className="table table-borderless table-hover">
                        <thead>
                        <tr className={"text-secondary"}>
                            <th className="bg-white" scope="col">No.</th>
                            <th className="bg-white" scope="col">Tipo</th>
                            <th className="bg-white" scope="col">Valor</th>
                            <th className="bg-white" scope="col">Saldo</th>
                            <th className="bg-white" scope="col">Fc. Vencimiento</th>
                            <th className="bg-white" scope="col">Pagado</th>
                            {vam &&
                                <>
                                    <th className="bg-white" scope="col">No Factura</th>
                                    <th className="bg-white" scope="col">Fc Emisión</th>
                                    <th className="bg-white" scope="col" title="Fecha Vigencia Desde">Fc. Vig Desde</th>
                                    <th className="bg-white" scope="col" title="Fecha Vigencia Hasta">Fc. Vig Hasta</th>
                                    {/*<th className="text-center">Ver Detalle</th>*/}
                                </>
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {financiamientoList.map(finZ => (
                            <tr key={finZ.cdFinanciamiento}>
                                <td>{finZ.ordinal}</td>
                                <td>{finZ.frmFinanciamiento}</td>
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
                                {vam &&
                                <>
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
                                </>
                                }
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td/>
                            <td className="text-right">Total</td>
                            <td className="text-right main-color t-bold">
                                <ReactNumeric
                                    valuex={totalPago}
                                    readOnly
                                    className="form-control-plaintext text-right"/>
                            </td>
                            <td className="text-right main-color t-bold">
                                <ReactNumeric
                                    valuex={totalSaldo}
                                    readOnly
                                    className="form-control-plaintext text-right"/>
                            </td>
                            <td>&#160;</td>
                            <td>&#160;</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    )
}