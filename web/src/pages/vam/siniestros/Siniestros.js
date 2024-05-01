import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {CardBody, Col, Row} from "reactstrap";
import axios from "axios";
import Alerts from "../../../components/Alerts";
import UqaiFormik from "../../../components/UqaiFormik";
import {Form} from "formik";
import {find_aseguradoras, find_ram_grupos, find_ramos, find_ramos_ramgrp} from "../../../api/CacheApi";
import {UqaiCalendario} from "../../../components/UqaiCalendario";
import ReactTable from "react-table";
import {on_select} from "../polizas/actions";
import {UqaiField} from "../../../components/UqaiField"
import {routes} from "../UtilsVam";
import {pos} from "../../../util/General";
import {Detalles} from "./Detalles";
import moment from "moment";
import "moment/locale/es"
import {DeduciblesModal} from "./DeduciblesModal";
import Reporte from "./parts/Reporte";
import {DocsDigitales} from "../../gen/polizas/parts/doc-digital/DocsDigitales";
import Pages from "../../../layouts/Pages";

class Siniestros extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.form = React.createRef();
        this.state = {
            data: [],
            ramos: [],
            asegs: [],
            pages: -1,
            page: 0,
            loading: false,
            item: {},
            cot: {},
            modalSiniestroVidas: false,
            modalDocs: false,
            tipo: "siniestro",
            query: this.itemQuery()
        };
    }

    itemQuery() {
        return {
            page: 0,
            pageSize: 10,
            poliza: '',
            ramo: 0,
            aseg: 0,
            numSiniestro: '',
            anio: '',
            comp: '',
            ci: this.props.user.cedula,
            desde: "",
            hasta: "",
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
                        if (this.isVam(item)) {
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
        }

        if (query.pageSize >= 0) {
            query2.pageSize = query.pageSize;
        }

        if (query2.page !== this.state.query.page || query2.page === 0) {
            axios.post(routes.api + '/siniestros/search', query2).then(resp => {
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
        this.setState({...this.state, query: this.itemQuery(), data: [], selected: -1})
        resetForm()
    }

    render() {
        return (<Pages title={"Siniestros Asegurado"}>
                <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                    <div className="container-fluid">
                        <Alerts ref={this.alert}/>
                        <div className={"card shadow"}>
                            <CardBody>
                                <div className="container">
                                    <UqaiFormik initialValues={this.state.query} onSubmit={this.onSubmit}
                                                ref={this.form}
                                                enableReinitialize={true} validateOnChange={false}>
                                        {({resetForm, submitForm}) => (
                                            <Form className="container">
                                                <div className="row gy-3">
                                                    <div className="col-lg-6">
                                                        <label
                                                            className="form-label fw-bold text-secondary fs-7">Póliza: </label>
                                                        <UqaiField className="form-control" type="text"
                                                                   autoFocus={true}
                                                                   placeholder="Póliza"
                                                                   name="poliza"/>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label
                                                            className="form-label fw-bold text-secondary fs-7">Aseguradora: </label>
                                                        <UqaiField component="select"
                                                                   className="form-select w-100 inputTable"
                                                                   name="aseg">
                                                            <option value="0">--TODOS--</option>
                                                            {this.state.asegs.map(aseg => (
                                                                <option
                                                                    key={aseg.cdAseguradora}
                                                                    value={aseg.cdAseguradora}>{aseg.nmAlias}</option>
                                                            ))}
                                                        </UqaiField>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label
                                                            className="form-label fw-bold text-secondary fs-7">Ramo: </label>
                                                        <UqaiField component="select"
                                                                   className="form-select w-100 inputTable"
                                                                   name="ramo">
                                                            <option value="0">--TODOS--</option>
                                                            {this.state.ramos.map(ramo => (
                                                                <option
                                                                    key={ramo.cdRamo}
                                                                    value={ramo.cdRamo}>{ramo.nmRamo}</option>
                                                            ))}
                                                        </UqaiField>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label className="form-label fw-bold text-secondary fs-7">No.
                                                            Siniestro: </label>
                                                        <UqaiField name="numSiniestro"
                                                                   className="form-control"
                                                                   type="text"
                                                                   placeholder="No. Siniestro"/>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label className="form-label fw-bold text-secondary fs-7">Año
                                                            Siniestro: </label>
                                                        <UqaiField name="anio" className="form-control"
                                                                   type="text"
                                                                   placeholder="Año Siniestro"/>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <label className="form-label fw-bold text-secondary fs-7">Fc.Siniestro
                                                            Desde: </label>
                                                        <UqaiField name="desde"
                                                                   placeholder="Ingrese Fecha"
                                                                   component={UqaiCalendario}
                                                        />
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label className="form-label fw-bold text-secondary fs-7">Fc.Siniestro
                                                            Hasta: </label>
                                                        <UqaiField name="hasta"
                                                                   placeholder="Ingrese Fecha"
                                                                   component={UqaiCalendario}
                                                        />
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <button type="button" className="btn btn-secondary me-2"
                                                                onClick={() => this.setState({modalDed: true})}>
                                                            Consultas deducibles
                                                        </button>

                                                        <button type="button" className="btn btn-success me-2"
                                                                onClick={() => this.handleResetForm(resetForm)}>
                                                            Nueva Consulta
                                                        </button>

                                                        <button type="button" className="btn btn-primary"
                                                                onClick={submitForm}>
                                                            Buscar
                                                        </button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </UqaiFormik>
                                    <br/>
                                    <Row>
                                        <Col xs={12}>
                                            {(this.state.data.length > 0) ?
                                                <ReactTable
                                                    noDataText={this.state.loading ? '' : 'No se han encontrado pólizas'}
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
                                                            Header: "Reportes",
                                                            width: 80,
                                                            filterable: false,
                                                            sortable: false,
                                                            Cell: row => <Reporte
                                                                siniestro={row.original}
                                                                alert={this.alert.current}/>
                                                        },
                                                        {
                                                            Header: "Num Siniestro",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "numSiniestro"
                                                        }, {
                                                            Header: "Item",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "item"
                                                        }, {
                                                            Header: "Año",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "anoSiniestro"
                                                        },
                                                        {
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
                                                            Header: "Titular",
                                                            minResizeWidth: 100,
                                                            sortable: true,
                                                            width: 300,
                                                            accessor: "titular"
                                                        },
                                                        {
                                                            Header: "Paciente",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            width: 300,
                                                            accessor: "dscObjeto"
                                                        },
                                                        {
                                                            Header: "Incapacidad",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            width: 200,
                                                            accessor: "nmIncapacidad"
                                                        },
                                                        {
                                                            Header: "Valor Incurrido",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "valIncurrido"
                                                        },
                                                        {
                                                            Header: "Ramo",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            width: 100,
                                                            accessor: "nmRamoAlias"
                                                        },
                                                        {
                                                            Header: "Aseguradora",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            width: 200,
                                                            accessor: "nmAseg"
                                                        },
                                                        {
                                                            Header: "Tipo",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "clAsegurado"
                                                        },
                                                        {
                                                            id: "fcUltimodoc",
                                                            Header: "Fc Ult. Carta",
                                                            sortable: true,
                                                            accessor: d => {
                                                                return !d.fcUltimodoc ? '' : moment(d.fcUltimodoc).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                            },
                                                            minResizeWidth: 10,
                                                            width: 115
                                                        },
                                                        {
                                                            // Header: "Dias",
                                                            Header: () => <span
                                                                title="Días transcurridos">Días</span>, // note it's func
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            accessor: "dias"
                                                        },
                                                        {
                                                            Header: "Estado",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            width: 150,
                                                            accessor: "aliasEstado"
                                                        },
                                                        {
                                                            Header: "Tipo Siniestro",
                                                            minResizeWidth: 10,
                                                            sortable: true,
                                                            width: 150,
                                                            accessor: "tpSiniestro"
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
                                                    loadingText={"Cargando..."}
                                                    onFetchData={this.fetchData}
                                                    defaultPageSize={5}
                                                    showPaginationTop
                                                    showPaginationBottom={false}
                                                    className="-highlight"
                                                    page={this.state.page}
                                                    pageSize={this.state.pageSize}
                                                    onPageChange={page => this.setState({page})}
                                                    onPageSizeChange={(pageSize, page) =>
                                                        this.setState({page, pageSize})}>
                                                </ReactTable>
                                                : null
                                            }
                                        </Col>
                                    </Row>
                                    <br/>
                                </div>
                            </CardBody>
                        </div>

                        <Detalles open={this.state.modalSiniestroVidas} toggleModal={this.showSiniestroVidas}
                                  siniestro={this.state.item} user={this.props.user}/>

                        <DeduciblesModal open={this.state.modalDed} closeModal={() => this.setState({modalDed: false})}
                                         cedula={this.props.user.cedula}/>


                    </div>
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
)(Siniestros);