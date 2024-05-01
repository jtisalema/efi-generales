import React, {Component} from "react";
import {Modal, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {routes} from "../../UtilsGeneral";
import axios from "axios";
import Alerts from "../../../../components/Alerts";
import {Liquidacion} from "./Liquidacion";
import {Documentos} from "./Documentos";
import {Facturas} from "./Facturas";
import {ContratanteGEN} from "./ContratanteGEN";
import {Gestion} from "./Gestion";
import {Beneficios} from "./Beneficios";
import {UqaiModalHeader} from "../../../../components/UqaiModal";

export class DetallesGEN extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: "",
            editing: false,
            item: {},
            cliente: {},
            hTabs: "ht0",
            beneficios: [],
            documentos: [],
            facturas: [],
            gestion: [],
            liquidaciones: [],
            gastoLiquidacion: [],
            coberturas: [],
            totalesBeneficio: [],
            deducible: {
                total: 1,
                saldo: 1,
                consumido: 0,
            },
            diasExtra: null
        };
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
        this.getBeneficios(this.props.siniestro.cdCompania, this.props.siniestro.cdReclamo);
        this.getDocumentos(this.props.siniestro.cdCompania, this.props.siniestro.cdReclamo);
        this.getFacturas(this.props.siniestro.cdCompania, this.props.siniestro.cdReclamo);
        this.getLiquidaciones(this.props.siniestro.cdCompania, this.props.siniestro.cdReclamo);
        this.getGastoLiquidacion(this.props.siniestro.cdCompania, this.props.siniestro.cdReclamo);
        this.getGestiones(this.props.siniestro.cdCompania, this.props.siniestro.cdReclamo);
        this.getPoliza();

        // let isAm = this.props.siniestro.nmRamo.toLowerCase().indexOf('med') >= 0;


    };

    getBeneficios = (idComp, cdReclamo) => {
        axios.get(routes.api + '/siniestros-gen/cobertura', {
            params: {
                cdCompania: idComp,
                cdReclamo: cdReclamo
            }
        }).then(resp => {
            let bens = resp.data.sort((a1, a2) => a1.cdCobDedSiniestro - a2.cdCobDedSiniestro);

            let totales = {
                valSiniestro: 0, valExceso: 0, valNoelegible: 0, valCubierto: 0, valDeducible: 0, valFijo: 0
            };
            bens.forEach(item => {
                item.valCubierto = item.valSiniestro - item.valMinimo;
                totales.valSiniestro += item.valSiniestro ? item.valSiniestro : 0;
                totales.valExceso += item.valExceso ? item.valExceso : 0;
                totales.valNoelegible += item.valNoelegible ? item.valNoelegible : 0;
                totales.valCubierto += item.valCubierto ? item.valCubierto : 0;
                totales.valDeducible += item.valDeducible ? item.valDeducible : 0;
                totales.valFijo += item.valFijo ? item.valFijo : 0;
            });
            this.setState({beneficios: bens, totalesBeneficio: totales});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getDocumentos = (idComp, cdReclamo) => {
        axios.get(routes.api + '/siniestros-gen/documentos', {
            params: {
                cdCompania: idComp,
                cdReclamo: cdReclamo
            }
        }).then(resp => {
            let docs = resp.data.sort((a1, a2) => parseInt(a1.item) - parseInt(a2.item));
            this.setState({documentos: docs});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getFacturas = (idComp, cdReclamo) => {
        axios.get(routes.api + '/siniestros-gen/cargarFactura', {
            params: {
                cdCompania: idComp,
                cdReclamo: cdReclamo
            }
        }).then(resp => {
            let facts = resp.data;
            this.setState({facturas: facts});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getLiquidaciones = (idComp, cdReclamo) => {
        axios.get(routes.api + '/siniestros-gen/cargarLiquidacion', {
            params: {
                cdCompania: idComp,
                cdReclamo: cdReclamo
            }
        }).then(resp => {
            let liqs = resp.data;
            this.setState({liquidaciones: liqs});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getGastoLiquidacion = (cdComp, cdReclamo) => {
        axios.get(routes.api + '/siniestros-gen/cargarGastoLiquidacion', {
            params: {
                cdCompania: cdComp,
                cdReclamo: cdReclamo
            }
        }).then(resp => {
            let gasliq = resp.data;
            this.setState({gastoLiquidacion: gasliq});
        }).catch(error => {
            alert('Error al consultar' + error);
        });
    }

    getGestiones = (idComp, cdReclamo) => {
        axios.get(routes.api + '/siniestros-gen/inspecion', {
            params: {
                cdCompania: idComp,
                cdReclamo: cdReclamo
            }
        }).then(resp => {
            let ges = resp.data;
            this.setState({gestion: ges});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };


    closeModal = () => {
        this.props.toggleModal(false);
        this.setState({item: {}});
    };

    tabSelect = (tab) => {
        this.setState({hTabs: tab});
    };

    getPoliza = () => {
        axios.get(routes.api + "" +
            "/cliente-nombre", {
            params: {
                cdCliente: this.props.siniestro.cdCliente
            }
        }).then(resp => {
            this.setState({cliente: resp.data});
        }).catch(error => {
            alert('Error al consultar' + error);
        });
    };

    getDias = () => {
        let cdIncSiniestro = this.props.siniestro.cdIncSiniestro;
        let cdCompania = this.props.siniestro.cdCompania;
        let numReclamo = this.props.siniestro.numSiniestro + '.' + this.props.siniestro.item;
        let anio = this.props.siniestro.anoSiniestro;

        axios.post(routes.api + "/DiasMsg",
            {cdIncSiniestro, cdCompania, numReclamo, anio}
        ).then(resp => {
            this.setState({diasExtra: resp.data});
        }).catch(error => {
            alert('Error al consultar' + error);
        });
    };

    render() {

        return (
            <React.Fragment>
                <Alerts ref={this.alert}/>
                <Modal className="modal-xl mx-auto " isOpen={this.props.open}>
                    <UqaiModalHeader toggle={this.closeModal} title="Detalle del Siniestro"/>
                    <ModalBody>
                        <div className="row">
                            <ContratanteGEN siniestro={this.props.siniestro} cliente={this.state.cliente}
                                            alert={this.alert.current} diasExtra={this.state.diasExtra}/>

                            <div className="col-lg-9">
                                <Nav pills className="nav-pills-primary">
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht0" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht0")}>
                                            Coberturas Aplicadas
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht1" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht1")}>
                                            Gestión
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht2" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht2")}>
                                            Documentos
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht3" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht3")}>
                                            Facturas
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht4" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht4")}>
                                            Liquidación
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.hTabs} className="tab-space">
                                    <TabPane tabId="ht0">
                                        <Beneficios hTabs={this.state.hTabs} beneficios={this.state.beneficios}
                                                    totales={this.state.totalesBeneficio} vam={false}/>
                                    </TabPane>
                                    <TabPane tabId="ht1">
                                        <Gestion hTabs={this.state.hTabs} gestion={this.state.gestion}/>
                                    </TabPane>
                                    <TabPane tabId="ht2">
                                        <Documentos hTabs={this.state.hTabs} documentos={this.state.documentos}/>
                                    </TabPane>
                                    <TabPane tabId="ht3">
                                        <Facturas hTabs={this.state.hTabs} facturas={this.state.facturas} vam={false}/>
                                    </TabPane>
                                    <TabPane tabId="ht4">
                                        <Liquidacion hTabs={this.state.hTabs} liquidaciones={this.state.liquidaciones}
                                                     gastoliquidacion={this.state.gastoLiquidacion}/>
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