import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {Button, CardBody, CardHeader, Col, Label, Row} from "reactstrap";
import axios from "axios";
import Alerts from "../../../components/Alerts";
import UqaiFormik from "../../../components/UqaiFormik";
import {Form} from "formik";
import {find_aseguradoras, find_companias, find_ram_grupos, find_ramos, find_ramos_ramgrp} from "../../../api/CacheApi";
import {UqaiCalendario} from "../../../components/UqaiCalendario";
import ReactTable from "react-table";
import {on_select} from "../polizas/actions";
import {UqaiField} from "../../../components/UqaiField"
import {routes} from "../UtilsGeneral";
import {pos} from "../../../util/General";
import {DetallesGEN} from "./parts/DetallesGEN";
import moment from "moment";
import "moment/locale/es"
import {DeduciblesModal} from "./parts/DeduciblesModal";
import {DocsDigitales} from "../polizas/parts/doc-digital/DocsDigitales";
import {Reportes} from "./parts/Reportes";
import Pages from "../../../layouts/Pages";

class SiniestrosGEN extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.form = React.createRef();
        this.state = {
            data: [],
            ramos: [],
            asegs: [],
            companias: [],
            vehiculo: [],
            pages: -1,
            page: 0,
            loading: false,
            item: {},
            cot: {},
            modalSiniestroVidas: false,
            modalDocs: false,
            tipo: "siniestros",
            query: this.itemQuery()
        };
    }

    itemQuery() {
        return {
            page: 0,
            pageSize: 10,
            poliza: '',
            cdRamo: 0,
            cdReclamo: '',
            cdAseguradora: 0,
            numSiniestro: '',
            anio: '',
            dscObjeto: null,
            cdCompania: this.props.user.cdCompania,
            cdCliente: this.props.user.cdCliente,
            cdPool: 0,
            cdEjecutivo: 0,
            ci: this.props.user.cedula,
            fcDesde: "",
            fcHasta: "",
            sorted: null,
        }
    }

    componentDidMount() {
        find_ramos().then(resp => {
            let ramos = resp;
            find_ram_grupos().then(resp => {
                let areas = resp;
                find_ramos_ramgrp().then(resp => {
                    let ramosTmp = [];
                    resp.forEach(r => {
                        let item = Object.assign({}, r);//clono el item
                        item.nmRamo = ramos.find(ramo => ramo.cdRamo === item.cdRamo).nmRamo;
                        item.nmArea = areas.find(area => area.cdRamGrupo === item.cdRamGrupo).nmRamGrupo;
                        item.nm = item.nmRamo;
                        if (!this.isVam(item)) {
                            ramosTmp.push(item);
                        }
                    });
                    this.setState({ramos: ramosTmp.sort((a, b) => a.nmRamo.localeCompare(b.nmRamo))});
                })
            });
        });

        find_aseguradoras().then(resp => {
            this.setState({asegs: resp});
        });

        find_companias().then(resp => {
            this.setState({companias: resp});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user.cdCliente !== this.props.user.cdCliente) {
            this.setState({query: this.itemQuery()}, () => {
                this.fetchData({}, {})
            });
        }
    }

    /**
     * funcion a ejecutarse cuando se da click en guardar desde el menu
     */
    onSubmit = (newValues) => {
        this.setState({
            query: {...this.state.query, ...newValues, page: 0},
            page: 0
        }, this.fetchData);
    };


    fetchData = (query = {}) => {

        let query2 = Object.assign({}, this.state.query);
        query2.sorted = query.sorted;
        if (query.page >= 0) {
            query2.page = query.page;
            // query2.page = 1;
        }

        if (query.pageSize >= 0) {
            query2.pageSize = query.pageSize;
        }

        if (query2.page !== this.state.query.page || query2.page === 0) {
            axios.post(routes.api + '/siniestros-gen/search', query2).then(resp => {
                this.setState({
                    data: resp.data.content,
                    pages: resp.data.totalPages,
                    loading: false,
                    sorted: resp.data.sorted
                });
            }).catch(error => {
                    this.alert.current.handle_error(error);
                }
            );
        }
    };

    onSelectCoti = (coti) => {
        this.setState({item: coti});
        this.showSiniestroVidas(true);
        this.props.on_select({cot: coti, query: this.state.query});
    };

    verDocDigital = (coti) => {
        this.setState({item: coti}, () => {
            this.showDocs(true);
            this.showSiniestroVidas(false);
        });

    };

    showSiniestroVidas = open => {
        this.setState({modalSiniestroVidas: open});
    };

    showDocs = open => {
        this.setState({modalDocs: open});
    };

    isVam = (r) => {
        let vam = false;
        let ls_nm_grp_ramo = r.nmArea;

        if (pos(ls_nm_grp_ramo, 'MEDICA') > 0) {
            //pb_actvam.TriggerEvent(Clicked!)
            vam = true;
        } else if (pos(ls_nm_grp_ramo, 'VIDA') > 0) {
            //pb_actvam.TriggerEvent(Clicked!)
            vam = true;
        } else {
            vam = false;
        }
        return vam
    };
    closeModalDoc = () => {
        this.setState({modalDocs: false});
    };
    handleResetForm = (resetForm) => {
        this.setState({...this.state, query: this.itemQuery(), data: [], data1: []})
        resetForm()
    }


    render() {
        return (
            <Pages title={'Siniestros Generales'}>
                <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                    <div className="container-fluid">
                        <Alerts ref={this.alert}/>
                        <div className={"card shadow"}>
                            <CardHeader className="d-flex align-items-center border-bottom border-primary">
                                <h5 className="my-0 fw-bold">Siniestros Generales</h5>
                            </CardHeader>
                            <CardBody>
                                <div className="container-fluid">
                                    <UqaiFormik initialValues={this.state.query} onSubmit={this.onSubmit}
                                                ref={this.form}
                                                enableReinitialize={true} validateOnChange={false}>
                                        {({resetForm, submitForm}) => (
                                            <Form className="container">
                                                <Row>
                                                    <Col xs={12} sm={6}>
                                                        <Row>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Póliza: </Label>
                                                                <UqaiField className="form-control" type="text"
                                                                           autoFocus={true}
                                                                           placeholder="Póliza"
                                                                           name="poliza"/>
                                                            </div>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Aseguradora: </Label>
                                                                <UqaiField component="select"
                                                                           className="form-select w-100 inputTable"
                                                                           name="cdAseguradora">
                                                                    <option value="0">--TODOS--</option>
                                                                    {this.state.asegs.map(aseg => (
                                                                        <option
                                                                            key={aseg.cdAseguradora}
                                                                            value={aseg.cdAseguradora}>{aseg.nmAlias}</option>
                                                                    ))}
                                                                </UqaiField>
                                                            </div>
                                                        </Row>
                                                    </Col>
                                                    <div className="form-group col-lg-6">
                                                        <Label
                                                            className={"form-label fw-bold text-secondary fs-7"}>Ramo: </Label>
                                                        <UqaiField component="select"
                                                                   className="form-select w-100 inputTable"
                                                                   name="cdRamo">
                                                            <option value="0">--TODOS--</option>
                                                            {this.state.ramos.map(ramo => (
                                                                <option
                                                                    key={ramo.cdRamo}
                                                                    value={ramo.cdRamo}>{ramo.nmRamo}</option>
                                                            ))}
                                                        </UqaiField>
                                                    </div>
                                                </Row>

                                                <Row>
                                                    <Col xs={12} sm={6}>
                                                        <Row>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Fecha
                                                                    de Ocurrencia del
                                                                    Siniestro Desde: </Label>
                                                                <UqaiField name="fcDesde"
                                                                           placeholder="Ingrese Fecha"
                                                                           component={UqaiCalendario}
                                                                />
                                                            </div>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Fecha
                                                                    de Ocurrencia del
                                                                    Siniestro Hasta: </Label>
                                                                <UqaiField name="fcHasta"
                                                                           placeholder="Ingrese Fecha"
                                                                           component={UqaiCalendario}
                                                                />
                                                            </div>
                                                        </Row>
                                                        <br/>
                                                    </Col>
                                                    <Col xs={12} sm={6}>
                                                        <Row>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>No.
                                                                    Siniestro: </Label>
                                                                <UqaiField name="numSiniestro"
                                                                           className="form-control"
                                                                           type="text"
                                                                           placeholder="No. Siniestro"/>
                                                            </div>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Año
                                                                    Siniestro: </Label>
                                                                <UqaiField name="anio" className="form-control"
                                                                           type="text"
                                                                           placeholder="Año Siniestro"/>
                                                            </div>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={12} sm={6}>
                                                        <Row>
                                                            <div className="col-lg-6 my-2">
                                                                <Button type={"submit"} color="primary"
                                                                        className="me-3"
                                                                        onClick={submitForm}>
                                                                    Buscar
                                                                </Button>

                                                                <Button className="btn-success"
                                                                        onClick={() => this.handleResetForm(resetForm)}>
                                                                    Nueva Consulta
                                                                </Button>
                                                            </div>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        )}
                                    </UqaiFormik>
                                    <Label className={"form-label fw-bold text-secondary fs-7"}>Siniestros
                                        Generales: </Label>
                                    <Row>
                                        <Col xs={12}>
                                            {(this.state.data.length > 0) ?
                                                <ReactTable
                                                    noDataText={this.state.loading?'':'No se han encontrado pólizas'}
                                                    loadingText={"Cargando..."}
                                                    previousText={"Anterior"}
                                                    nextText={"Siguiente"}
                                                    pageText={"Página"}
                                                    rowsText={"filas"}
                                                    ofText={"de"}
                                                    columns={[
                                                        {
                                                            Header: "Documentos",
                                                            width: 100,
                                                            filterable: false,
                                                            sortable: false,
                                                            Cell: row => <DocsDigitales alert={this.alert}
                                                                                        tipo={"siniestro"}
                                                                                        row={row.original}/>
                                                        },
                                                        {
                                                            Header: "Estado",
                                                            minResizeWidth: 10,
                                                            width: 190,
                                                            sortable: true,
                                                            accessor: "estadoActivo.estSiniestro.dscEstado"
                                                        },
                                                        {
                                                            Header: "Num Siniestro",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "numSiniestro"
                                                        }, {
                                                            Header: "Año",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "anoSiniestro"

                                                        }, {
                                                            id: "fcSiniestro",
                                                            Header: "Fc Siniestro",
                                                            sortable: true,
                                                            accessor: d => {
                                                                return moment(d.fcSiniestro).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                            },
                                                            minResizeWidth: 10
                                                        },
                                                        {
                                                            Header: "Póliza",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "poliza",
                                                            sortType: (rowA, rowB) => {
                                                                const nameA = rowA.original?.poliza;
                                                                const nameB = rowB.original?.poliza;
                                                                return nameA.localeCompare(nameB);
                                                            },
                                                        },
                                                        {
                                                            Header: "Causa",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            width: 200,
                                                            accessor: "causa"
                                                        },
                                                        {
                                                            Header: "Objeto",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            width: 150,
                                                            accessor: "objeto.dscObjeto"
                                                        }, {
                                                            Header: "Aseguradora",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "aseguradora.nmAlias"
                                                        }, {
                                                            Header: "Ramo",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            width: 100,
                                                            accessor: "ramo.nmAlias"
                                                        }, {
                                                            Header: "Desde",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "ramosCotizacion.fcDesde"
                                                        }, {
                                                            Header: "Hasta",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "ramosCotizacion.fcHasta"
                                                        }, {
                                                            Header: "Val Asegurado",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "objeto.valAsegurado"
                                                        },
                                                        {
                                                            id: "objeto",
                                                            Header: "Carateristicas",
                                                            sortable: true,
                                                            width: 190,

                                                            accessor: ob => {
                                                                let veh = ob.objeto.objCotizacion?.vehiculo
                                                                return veh ? `${veh.placa} ${veh.marca} ${veh.anioDeFabricacion} ${veh.color} ${veh.noDeMotor}
                                                                    ${veh.modelo} ${veh.noDeChasis}` : null
                                                            }
                                                        }

                                                    ]}
                                                    getTdProps={(state, rowInfo, column) => {
                                                        if (rowInfo && rowInfo.row) {
                                                            return {
                                                                onClick: (e, handleOriginal) => {
                                                                    if (column.Header !== 'Documentos' && column.Header !== 'Reportes') {
                                                                        this.onSelectCoti(rowInfo.original);
                                                                        this.setState({
                                                                            selected: rowInfo.index,
                                                                            item: rowInfo.original
                                                                        });
                                                                    }
                                                                    if (handleOriginal) {
                                                                        handleOriginal();
                                                                    }
                                                                },
                                                                style: {
                                                                    cursor: "pointer",
                                                                    height: 50,
                                                                }
                                                            }
                                                        } else {
                                                            return {}
                                                        }
                                                    }}
                                                    manual
                                                    data={this.state.data}
                                                    pages={this.state.pages}
                                                    loading={this.state.loading}
                                                    onFetchData={this.fetchData}
                                                    defaultPageSize={5}
                                                    showPaginationTop
                                                    showPaginationBottom={false}
                                                    className="-highlight"
                                                    page={this.state.page}
                                                    pageSize={this.state.pageSize}
                                                    onPageChange={page => this.setState({page, selected: false})}
                                                    onPageSizeChange={(pageSize, page) =>
                                                        this.setState({page, pageSize})}>
                                                </ReactTable>
                                                : null
                                            }
                                        </Col>
                                    </Row>
                                    <br/>
                                    <br/>
                                </div>
                            </CardBody>
                        </div>
                    </div>


                    <DetallesGEN open={this.state.modalSiniestroVidas} toggleModal={this.showSiniestroVidas}
                                 siniestro={this.state.item} user={this.props.user}/>


                    <DeduciblesModal open={this.state.modalDed} closeModal={() => this.setState({modalDed: false})}
                                     cedula={this.props.user.cedula}/>
                </section>
            </Pages>

        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    auth: state.auth
});

const mapDispatchToProps = {
    on_select
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SiniestrosGEN);

