import React, {Component} from "react";
import {Modal, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {routes} from "../../UtilsGeneral";
import axios from "axios";
import Alerts from "../../../../components/Alerts";
import {Coberturas} from "./polizas/Coberturas";
import {FormaPrima} from "./polizas/FormaPrima";
import {Deducibles} from "./polizas/Deducibles";
import {Notas} from "./polizas/Notas";
import {Clausulas} from "./polizas/Clausulas";
import {Contratante} from "./Contratante";
import {Pagos} from "./Facturacion";
import {UqaiModalHeader} from "../../../../components/UqaiModal";

export class Condiciones extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            totalSaldo: 0,
            formaPago: {},
            totalPago: 0,
            pagos: [],
            value: "",
            editing: false,
            pagosVista: false,
            item: {},
            hTabs: "ht1",
            coberturas: [],
            primas: [],
            beneficiario: [],
            clausulas: [],
            deducibles: [],
            exclusiones: [],
            exclusionesCobertura: [],
            notas: []
        };
    }

    componentDidUpdate(prevProps) {
        let {open} = this.props;
        let openOld = prevProps.open;

        if (open !== openOld) {
            if (open) {
                this.setState({
                    totalSaldo: 0,
                    formaPago: {},
                    totalPago: 0,
                    pagos: [],
                    value: "",
                    editing: false,
                    item: {},
                    hTabs: "ht1",
                    coberturas: [],
                    primas: [],
                    beneficiario: [],
                    clausulas: [],
                    deducibles: [],
                    exclusiones: [],
                    exclusionesCobertura: [],
                    notas: []
                }, this.fetchData)
            } else {
                this.setState({item: {}});
            }
        }
    }

    fetchData() {
        let {item} = this.props;
        this.getPagos(item.cdCompania);
        this.getCoberturasVam(item.cdCompania, item.cdUbicacion);
        this.getFormaPrima(item.cdCompania, item.cdUbicacion);
        this.getDeducibles(item.cdUbicacion, this.props.poliza.cdCompania);
        this.getNotas(item.cdRamoCotizacion, item.cdCompania);
        this.getClausulas(item.cdCompania, item.cdUbicacion);
    }

    getPagos = (idComp) => {
        axios.get(routes.api + '/polizas/formaPago', {
            params: {
                cdCompania: idComp,
                cdCotizacion: this.props.poliza.cotizacion.cdCotizacion,
                vam: this.props.vida
            }
        }).then(resp => {
            let data = resp.data;
            this.setState({
                formaPago: data.item,
                pagos: data.financiamientoList,
                totalPago: data.totalPago,
                totalSaldo: data.totalSaldo
            });
        }).catch(error => {

            }
        );
    };
    getCoberturasVam = (idComp, cdUbicacion) => {
        //diferenciar a q peticion mandar
        axios.get(routes.api + '/polizas/vam/coberturas', {
            params: {
                cdCompania: idComp,
                cdUbicacion: cdUbicacion
            }
        }).then(resp => {
            let cobs = resp.data;
            this.setState({coberturas: cobs});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getFormaPrima = (idComp, cdUbicacion) => {
        axios.get(routes.api + '/polizas/formaPrima', {
            params: {
                cdCompania: idComp,
                cdUbicacion: cdUbicacion
            }
        }).then(resp => {
            let primas = resp.data;
            this.setState({primas: primas});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };


    getDeducibles = (cdUbicacion, cdCompania) => {
        axios.get(routes.api + '/polizas/deducibles', {
            params: {
                cdUbicacion: cdUbicacion,
                cdCompania: cdCompania
            }
        }).then(resp => {
            let deducibles = resp.data;
            this.setState({deducibles: deducibles});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };
    getNotas = (cdRamoCoti, cdCompania) => {
        axios.get(routes.apiVam + '/notas', {
            params: {
                cdRamosCotizacion: cdRamoCoti,
                cdCompania
            }
        }).then(resp => {
            let notas = resp.data.sort((a1, a2) => a1.cdAclaratorio - a2.cdAclaratorio);
            this.setState({notas: notas});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getClausulas = (idComp, cdUbicacion) => {
        axios.get(routes.api + '/polizas/clausulas', {
            params: {
                cdCompania: idComp,
                cdUbicacion: cdUbicacion
            }
        }).then(resp => {
            let notas = resp.data;
            this.setState({clausulas: notas});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    closeModal = () => {
        this.props.toggleModal(false);
        this.setState({list: [], item: {}});
    };

    tabSelect = (tab) => {
        this.setState({hTabs: tab});
    };

    render() {
        let ramos = this.props.ramos;
        return (
            <React.Fragment>
                <Alerts ref={this.alert}/>
                <Modal className="modal-xl mx-auto" isOpen={this.props.open} toggle={this.closeModal}>
                    <UqaiModalHeader toggle={this.closeModal} title="Detalle Póliza"/>
                    <ModalBody>
                        <div className="row">
                            <Contratante poliza={this.props.poliza} item={this.props.item} user={this.props.user}
                                         vida={this.props.vida} ramos={ramos} vista={false}/>

                            <div className="col-lg-9">
                                <Nav pills className="nav-pills-primary">
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht1" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht1")}>
                                            Plan Cobertura
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht2" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht2")}>
                                            Pagos
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht4" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht4")}>
                                            Forma Prima
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht5" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht5")}>
                                            Deducibles
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht7" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht7")}>
                                            Notas Aclaratorias
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.hTabs}
                                            className="tab-space">
                                    <TabPane tabId="ht1">
                                        <Coberturas hTabs={this.state.hTabs} coberturas={this.state.coberturas}
                                                    vida={this.props.vida}/>
                                    </TabPane>
                                    <TabPane tabId="ht2">
                                        <Pagos item={this.state.formaPago} financiamientoList={this.state.pagos}
                                               totalSaldo={this.state.totalSaldo} totalPago={this.state.totalPago}
                                               vistaTabla={this.props.pagosVista} vam={true}/>
                                    </TabPane>
                                    <TabPane tabId="ht4">
                                        <FormaPrima hTabs={this.state.hTabs} primas={this.state.primas}/>
                                    </TabPane>
                                    <TabPane tabId="ht5">
                                        <Deducibles hTabs={this.state.hTabs} deducibles={this.state.deducibles}/>
                                    </TabPane>
                                    <TabPane tabId="ht7">
                                        <Notas hTabs={this.state.hTabs} notas={this.state.notas}/>
                                    </TabPane>
                                    <TabPane tabId="ht8">
                                        <Clausulas hTabs={this.state.hTabs} clausulas={this.state.clausulas}/>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}