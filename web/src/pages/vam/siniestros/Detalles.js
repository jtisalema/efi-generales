import React, {Component} from "react";
import {Modal, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {routes} from "../UtilsVam";
import axios from "axios";
import Alerts from "../../../components/Alerts";
import {Beneficios} from "./parts/Beneficios";
import {Liquidacion} from "./parts/Liquidacion";
import {Documentos} from "./parts/Documentos";
import {Facturas} from "./parts/Facturas";
import {Contratante} from "./Contratante";
import {Deducibles} from "./parts/Deducibles";
import {NotasCobranza} from "./parts/NotasCobranza";
import {UqaiModalHeader} from "../../../components/UqaiModal";

export class Detalles extends Component {

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
            liquidaciones: [],
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
        this.getDeducibles(this.props.siniestro.cdCompania, this.props.siniestro.cdAsegurado);
        this.getBeneficios(this.props.siniestro.cdCompania, this.props.siniestro.cdIncSiniestro);
        this.getDocumentos(this.props.siniestro.cdCompania, this.props.siniestro.cdIncSiniestro);
        this.getFacturas(this.props.siniestro.cdCompania, this.props.siniestro.cdIncSiniestro);
        this.getLiquidaciones(this.props.siniestro.cdCompania, this.props.siniestro.cdIncSiniestro);
        this.getPoliza();

        let isAm = this.props.siniestro.nmRamo.toLowerCase().indexOf('med') >= 0;


    };

    getBeneficios = (idComp, cdIncSiniestro) => {
        axios.get(routes.api + '/siniestro/coberturas', {
            params: {
                cdCompania: idComp,
                cdIncSiniestro: cdIncSiniestro
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

    getDocumentos = (idComp, cdIncSiniestro) => {
        axios.get(routes.api + '/siniestro/inspeccion', {
            params: {
                cdCompania: idComp,
                cdIncSiniestro: cdIncSiniestro
            }
        }).then(resp => {
            let docs = resp.data.sort((a1, a2) => parseInt(a1.item) - parseInt(a2.item));
            this.setState({documentos: docs});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getFacturas = (idComp, cdIncSiniestro) => {
        axios.get(routes.api + '/siniestro/facturas', {
            params: {
                cdCompania: idComp,
                cdIncSiniestro: cdIncSiniestro
            }
        }).then(resp => {
            let facts = resp.data;
            this.setState({facturas: facts});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getLiquidaciones = (idComp, cdIncSiniestro) => {
        axios.get(routes.api + '/siniestro/liquidacion', {
            params: {
                cdCompania: idComp,
                cdIncSiniestro: cdIncSiniestro
            }
        }).then(resp => {
            let liqs = resp.data;
            this.setState({liquidaciones: liqs});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getDeducibles = (cdCompania, cdAsegurado) => {
        axios.get(routes.api + '/siniestro/deducible', {
            params: {cdCompania, cdAsegurado}
        }).then(resp => {
            let deducible = resp.data;
            this.setState({deducible});
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
        axios.get(routes.gen + "/cliente-nombre", {
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
                <Modal isOpen={this.props.open} toggle={this.closeModal} size="xl">
                    <UqaiModalHeader toggle={this.closeModal} title="Detalle del Siniestro"/>
                    <ModalBody>
                        <div className="row">
                            <Contratante siniestro={this.props.siniestro} cliente={this.state.cliente}
                                         alert={this.alert.current} diasExtra={this.state.diasExtra}/>

                            <div className="col-lg-9">
                                <Nav pills className="nav-pills-primary">
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht0" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht0")}>
                                            Deducible
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht1" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht1")}>
                                            Beneficios
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht2" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht2")}>
                                            Documentos Presentados
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht3" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht3")}>
                                            Facturas Presentadas
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht4" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht4")}>
                                            Liquidación del Siniestro
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht5" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht5")}>
                                            Nota de Cobranza
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.hTabs} className="tab-space">
                                    <TabPane tabId="ht0">
                                        <Deducibles hTabs={this.state.hTabs} deducible={this.state.deducible}/>
                                    </TabPane>
                                    <TabPane tabId="ht1">
                                        <Beneficios hTabs={this.state.hTabs} beneficios={this.state.beneficios}
                                                    totales={this.state.totalesBeneficio}/>
                                    </TabPane>
                                    <TabPane tabId="ht2">
                                        <Documentos hTabs={this.state.hTabs} documentos={this.state.documentos}/>
                                    </TabPane>
                                    <TabPane tabId="ht3">
                                        <Facturas hTabs={this.state.hTabs} facturas={this.state.facturas}/>
                                    </TabPane>
                                    <TabPane tabId="ht4">
                                        <Liquidacion hTabs={this.state.hTabs} liquidaciones={this.state.liquidaciones}/>
                                    </TabPane>
                                    <TabPane tabId="ht5">
                                        <NotasCobranza alert={this.alert.current}
                                                       cdCompania={this.props.siniestro.cdCompania}
                                                       cdIncSiniestro={this.props.siniestro.cdIncSiniestro}/>
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