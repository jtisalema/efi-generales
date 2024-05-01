import React, {Component} from "react";
import {Modal, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {routes} from "../../UtilsVam";
import axios from "axios";
import Alerts from "../../../../components/Alerts";
import {Coberturas} from "./Coberturas";
import {FormaPrima} from "./FormaPrima";
import {Deducibles} from "./Deducibles";
import {Notas} from "./Notas";
import {Contratante} from "./Contratante";
import {Facturacion} from "./Facturacion";
import {Asegurados} from "../Asegurados";
import {UqaiModalHeader} from "../../../../components/UqaiModal";

export class Condiciones extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            value: "",
            editing: false,
            item: {},
            hTabs: "ht1",
            coberturas: [],
            primas: [],
            clausulas: [],
            deducibles: [],
            exclusiones: [],
            notas: []
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
        this.getCoberturas(this.props.item.cdCompania, this.props.item.cdUbicacion);
        this.getFormaPrima(this.props.item.cdCompania, this.props.item.cdUbicacion);
        this.getDeducibles(this.props.item.cdCompania, this.props.item.cdUbicacion);
        this.getExclusiones(this.props.item.cdCompania, this.props.item.cdUbicacion);
        this.getNotas(this.props.item.cdRamoCotizacion, this.props.item.cdCompania);
        this.getClausulas(this.props.item.cdCompania, this.props.item.cdUbicacion);
    };

    getCoberturas = (idComp, cdUbicacion) => {
        axios.get(routes.api + '/coberturas', {
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
        axios.get(routes.api + '/formaPrima', {
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

    getDeducibles = (idComp, cdUbicacion) => {
        axios.get(routes.api + '/deducibles', {
            params: {
                cdCompania: idComp,
                cdUbicacion: cdUbicacion
            }
        }).then(resp => {
            let deducibles = resp.data;
            this.setState({deducibles: deducibles});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getExclusiones = (idComp, cdUbicacion) => {
        axios.get(routes.api + '/exclusiones', {
            params: {
                cdCompania: idComp,
                cdUbicacion: cdUbicacion
            }
        }).then(resp => {
            let exclusiones = resp.data;
            this.setState({exclusiones: exclusiones});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    getNotas = (cdRamoCoti, cdCompania) => {
        axios.get(routes.api + '/notas', {
            params: {
                cdRamosCotizacion: cdRamoCoti,
                cdCompania: cdCompania,
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
        axios.get(routes.api + '/clausulas', {
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

        return (
            <React.Fragment>
                <Alerts ref={this.alert}/>
                <Modal isOpen={this.props.open} toggle={this.closeModal} size="xl">
                    <UqaiModalHeader toggle={this.closeModal} title="Detalle Póliza"/>
                    <ModalBody>
                        <div className="row">
                            <Contratante poliza={this.props.poliza} item={this.props.item}/>

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
                                            Dependientes
                                        </NavLink>
                                    </NavItem>
                                    {this.props.isIndividual && <NavItem className="cursorPointer">
                                        <NavLink
                                            className={this.state.hTabs === "ht3" ? "active" : ""}
                                            onClick={() => this.tabSelect("ht3")}>
                                            Facturación
                                        </NavLink>
                                    </NavItem>}
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
                                        <Coberturas hTabs={this.state.hTabs} coberturas={this.state.coberturas}/>
                                    </TabPane>
                                    <TabPane tabId="ht2">
                                        <Asegurados open={this.props.open} item={this.props.item}
                                                    cdObjCotizacion={this.props.cdObjCotizacion}
                                                    ubicacion={this.props.ubicacion}
                                                    cotizacion={this.props.cotizacion}
                                                    ramo={this.props.cdRamo} cedula={this.props.cedula}
                                                    alert={this.props.alert}
                                                    poliza={this.props.poliza}/>

                                    </TabPane>
                                    {this.props.isIndividual && <TabPane tabId="ht3">
                                        <Facturacion open={this.props.open} item={this.props.item}
                                                     alert={this.props.alert} poliza={this.props.poliza}/>
                                    </TabPane>}
                                    <TabPane tabId="ht4">
                                        <FormaPrima hTabs={this.state.hTabs} primas={this.state.primas}/>
                                    </TabPane>
                                    <TabPane tabId="ht5">
                                        <Deducibles hTabs={this.state.hTabs} deducibles={this.state.deducibles}/>
                                    </TabPane>
                                    <TabPane tabId="ht7">
                                        <Notas hTabs={this.state.hTabs} notas={this.state.notas}/>
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