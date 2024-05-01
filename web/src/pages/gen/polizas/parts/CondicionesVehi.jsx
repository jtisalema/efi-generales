import React, {Component} from "react";
import {Modal, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {routes} from "../../UtilsGeneral";
import axios from "axios";
import Alerts from "../../../../components/Alerts";
import {Coberturas} from "./polizas/Coberturas";
import {DeduciblesVehi} from "./polizas/Deducibles";
import {Notas} from "./polizas/Notas";
import {Clausulas} from "./polizas/Clausulas";
import {Contratante} from "./Contratante";
import {Pagos} from "./Facturacion";
import {Garantias} from "./polizas/Garantias";
import {Beneficiario} from "./polizas/Beneficiario";
import {ExclusionesClausulasRamo} from "./polizas/ExclusionesClausulasRamo";
import {UqaiModalHeader} from "../../../../components/UqaiModal";

export class CondicionesVehi extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: "",
            editing: false,
            vistaTabla: true,
            vista: false,
            item: {},
            hTabs: "ht1",
            coberturas: [],
            clausulas: [],
            beneficiario: [],
            deducibles: [],
            otros: [],
            garantias: [],
            exclusionesCobertura: [],
            exclusiones: [],
            notas: [],
            pagos: [],
            formaPago: {},
            totalPago: 0,
            totalSaldo: 0,
            tipo: 1,//por defecto vehiculo
        };
    }

    componentDidUpdate(prevProps) {
        let {open} = this.props;
        let openOld = prevProps.open;

        if (open !== openOld) {
            if (open) {
                // this.tipoContenido();
                this.setState({
                    value: "",
                    editing: false,
                    item: {},
                    hTabs: "ht1",
                    coberturas: [],
                    clausulas: [],
                    beneficiario: [],
                    deducibles: [],
                    otros: [],
                    garantias: [],
                    exclusionesCobertura: [],
                    exclusiones: [],
                    notas: [],
                    pagos: [],
                    formaPago: {},
                    totalPago: 0,
                    totalSaldo: 0,
                    tipo: 1
                }, this.fetchData)
            } else {
                this.setState({item: {}});
            }
        }
    }

    fetchData() {
        let {item, poliza} = this.props;
        // let tipo = this.state.tipo;
        let id = '';
        // if (tipo === 1) {
        //     id = (poliza.cdRamCotOri != null && (!item.numCotizacion.startsWith('R') && !item.numCotizacion.startsWith('C'))) ? poliza.cdRamCotOri : item.cdRamoCotizacion;
        // } else {
        //     id = poliza.cdRamoCotizacion;
        id = poliza.cdRamoCotizacion;
        // }
        this.getCoberturas(item.compania.cdCompania, id);
        this.getClausulas(item.compania.cdCompania, id);
        this.getBeneficiario(item.compania.cdCompania, item.cdRamoCotizacion);
        this.getDeducibles(item.compania.cdCompania, id);
        this.getExclusiones(item.compania.cdCompania, item.cdRamoCotizacion);
        this.getExclusionesCoberturas(item.compania.cdCompania, item.cdRamoCotizacion);
        this.getGarantias(id);
        this.getNotas(id, item.compania.cdCompania);
        this.getPagos(item.compania.cdCompania, item.cdCotizacion);
    }


    tipoContenido() {
        let item = this.props.item;
        axios.get(routes.api + '/polizas/tipo-contenido', {
            params: {
                cdRamoCotizacion: item.cdRamoCotizacion,
                cdCompania: item.compania.cdCompania
            }
        }).then(resp => {
            let ramo = resp.data;
            let tipo;
            if (ramo != null && (ramo.nmRamo.includes('VIDA') || ramo.nmRamo.includes('MEDICA'))) {
                tipo = 2;
            } else if (ramo != null && ramo.nmRamo.includes('VEHICULO')) {
                tipo = 1;
            } else {
                tipo = 0;
            }
            this.setState({tipo: tipo});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    }

    getExclusiones = (idComp, cdRamoCotizacion) => {
        axios.get(routes.api + '/polizas/exclusiones-ramo', {
            params: {
                cdCompania: idComp,
                cdRamoCotizacion: cdRamoCotizacion
            }
        }).then(resp => {
            let exclusiones = resp.data;
            this.setState({exclusiones: exclusiones});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };
    getExclusionesCoberturas = (idComp, cdRamoCotizacion) => {
        axios.get(routes.api + '/polizas/exclusiones-cobertura', {
            params: {
                cdCompania: idComp,
                cdRamoCotizacion: cdRamoCotizacion
            }
        }).then(resp => {
            let exclusiones = resp.data;
            this.setState({exclusionesCobertura: exclusiones.exclusiones});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getBeneficiario = (idComp, cdRamoCotizacion) => {
        axios.get(routes.api + '/polizas/beneficiario', {
            params: {
                cdCompania: idComp,
                cdRamoCotizacion: cdRamoCotizacion
            }
        }).then(resp => {
            let beneficiario = resp.data;
            this.setState({beneficiario: beneficiario});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };
    getCoberturas = (idComp, cdRamoCotizacion) => {
        //diferenciar a q peticion mandar
        axios.get(routes.api + '/polizas/coberturas', {
            params: {
                cdCompania: idComp,
                cdRamoCotizacion: cdRamoCotizacion
            }
        }).then(resp => {
            let cobs = resp.data;
            this.setState({coberturas: cobs});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getGarantias = (ramoCot) => {
        axios.get(routes.api + '/polizas/garantias', {
            params: {
                ramoCot: ramoCot
            }
        }).then(resp => {
            let list = resp.data;
            this.setState({garantias: list});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getDeducibles = (idComp, ramoCot) => {
        axios.get(routes.api + '/polizas/otros-deducibles', {
            params: {
                cdCompania: idComp,
                ramoCot: ramoCot
            }
        }).then(resp => {
            let data = resp.data;
            this.setState({otros: data.otros, deducibles: data.deducibles});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getPagos = (idComp, ramoCoti) => {
        axios.get(routes.api + '/polizas/formaPago', {
            params: {
                cdCompania: idComp,
                cdCotizacion: ramoCoti,
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

    getClausulas = (idComp, ramoCot) => {
        axios.get(routes.api + '/polizas/clausulas', {
            params: {
                cdCompania: idComp,
                ramoCot: ramoCot
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
                <Modal className="modal-xl mx-auto" isOpen={this.props.open}>
                    <UqaiModalHeader toggle={this.closeModal} title="Detalle Póliza"/>
                    <ModalBody>
                        <div className="row">
                            <Contratante poliza={this.props.poliza} item={this.props.item} user={this.props.user}
                                         vida={this.props.vida} ramos={ramos} vista={this.state.vista}/>

                            <div className="col-lg-9">
                                <Nav pills className="nav-pills-primary">
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht1" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht1")}>
                                            Coberturas
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht2" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht2")}>
                                            Cláusulas
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht3" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht3")}>
                                            Deducibles
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht4" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht4")}>
                                            Garantías
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht5" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht5")}>
                                            Notas Aclaratorias
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht6" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht6")}>
                                            Pagos
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht7" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht7")}>
                                            Beneficiario
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht8" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht8")}>
                                            Exlusiones
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
                                        <Clausulas hTabs={this.state.hTabs} clausulas={this.state.clausulas}/>
                                    </TabPane>
                                    <TabPane tabId="ht3">
                                        <DeduciblesVehi coberturas={this.state.deducibles}
                                                        otros={this.state.otros}/>
                                    </TabPane>
                                    <TabPane tabId="ht4">
                                        <Garantias garantias={this.state.garantias}/>
                                    </TabPane>
                                    <TabPane tabId="ht5">
                                        <Notas hTabs={this.state.hTabs} notas={this.state.notas}/>
                                    </TabPane>
                                    <TabPane tabId="ht6">
                                        <Pagos item={this.state.formaPago} financiamientoList={this.state.pagos}
                                               totalSaldo={this.state.totalSaldo} totalPago={this.state.totalPago}
                                               vistaTabla={this.state.vistaTabla} vam={false}/>
                                    </TabPane>
                                    <TabPane tabId="ht7">
                                        <Beneficiario hTabs={this.state.hTabs} beneficiario={this.state.beneficiario}/>
                                    </TabPane>
                                    <TabPane tabId="ht8">
                                        <ExclusionesClausulasRamo hTabs={this.state.hTabs}
                                                                  exclusiones={this.state.exclusiones}
                                                                  exclusionesCobertura={this.state.exclusionesCobertura}/>
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