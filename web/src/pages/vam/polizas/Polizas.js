import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {CardBody} from "reactstrap";
import axios from "axios";
import Alerts from "../../../components/Alerts";
import UqaiFormik from "../../../components/UqaiFormik";
import {Form} from "formik";
import {find_aseguradoras, find_companias, find_ram_grupos, find_ramos, find_ramos_ramgrp} from "../../../api/CacheApi";
import {UqaiCalendario} from "../../../components/UqaiCalendario";
import ReactTable from "react-table";
import {on_select} from "./actions";
import {UqaiField} from "../../../components/UqaiField"
import {routes} from "../UtilsVam";
import {pos} from "../../../util/General";
import {Condiciones} from "./parts/Condiciones";
import moment from "moment";
import "moment/locale/es"
import Pages from "../../../layouts/Pages";
import {NoDataResult} from "../../../components/NoDataResult";
import {DocsDigitalesPolizas} from "../../gen/polizas/parts/doc-digital/DocsDigitalesPolizas";
import useToggle from "../../../hooks/useToggle";
import {useSelector} from "react-redux";

class Polizas extends Component {

    constructor() {
        super(...arguments);
        this.alert = React.createRef();
        this.form = React.createRef();
        this.state = {
            data: [],
            ramos: [],
            nombres: null,
            telfs: null,
            correos: null,
            asegs: [],
            agentes: [],
            companias: [],
            adicionales: [],
            pages: -1,
            page: 0,
            loading: false,
            cot: {},
            itemPoli: {},
            cdUbicacion: null,
            cdCotizacion: null,
            cdRamo: null,
            itemAdi: {},
            modalCondiciones: false,
            modalAsegurados: false,
            modalFacturacion: false,
            query: this.itemQuery(),
            first: true

        };
    }

    itemQuery() {
        return {
            page: 0,
            pageSize: 10,
            poliza: '',
            ramo: 0,
            aseg: 0,
            comp: 0,
            desde: "",
            hasta: "",
            sorted: null,
            ci: this.props.user.cedula
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user.cedula !== this.props.user.cedula) {
            this.setState({query: this.itemQuery()}, () => {
                this.fetchData({}, {})
            });
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
        find_companias().then(resp => {
            this.setState({companias: resp});
        });
    }

    /**
     * funcion a ejecutarse cuando se da click en guardar desde el menu
     */
    onSubmit = (newValues, actions) => {
        this.setState({
            query: {...this.state.query, ...newValues, page: 0},
            page: 0, first: false,
        }, () => this.fetchData({}, actions));
    };


    fetchData = (query = {}, actions) => {
        this.setState({loading: true});

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
            axios.post(routes.api + '/polizas', query2).then(resp => {

                resp.data.content.forEach(p => {
                    if (p.tipo.indexOf('RENO') >= 0) {
                        p.tipo = 'RENOVACIÓN';
                    }

                    if (p.tipo.indexOf('COTI') >= 0) {
                        p.tipo = 'POLIZA NUEVA';
                    }
                });

                this.setState({
                    data: resp.data.content,
                    pages: resp.data.totalPages,
                    loading: false,
                    sorted: resp.data.sorted,
                    adicionales: []
                });
                if (actions.setSubmitting) {
                    actions.setSubmitting(false);
                }
            }).catch(error => {
                    this.alert.current.handle_error(error);
                    if (actions.setSubmitting) {
                        actions.setSubmitting(false);
                    }
                }
            ).finally(() => this.setState({loading: false}));
        }
    };

    getEjecutivo = (coti) => {
        axios.get(routes.api + '/ejecutivoAdm', {
            params: {
                id: coti.cdEjecutivo,
                comp: coti.cdCompania,
            }
        }).then(resp => {
            this.setState({nombres: resp.data.nombres, correos: resp.data.correos, telfs: resp.data.telefonos});
        });
    };

    onSelectAdicional = (coti) => {
        coti.isIndividual = coti.nmRamo.toLowerCase().indexOf('individual') >= 0;

        axios.get(routes.api + '/ubicacion', {
            params: {
                cdCompania: coti.cdCompania,
                cdUbicacion: coti.cdUbicacion
            }
        }).then(resp => {
            this.setState({
                cdUbicacion: resp.data.cdUbicacion,
                cdRamo: resp.data.cdRamoCotizacion,
                itemAdi: resp.data,
                itemPoli: coti
            }, () => {
                this.showCondiciones(true);
            });

        }).catch(error => {
            this.alert.current.handle_error(error);
        });


    };

    showCondiciones = open => {
        this.setState({modalCondiciones: open});
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
    handleResetForm = (resetForm) => {
        this.setState({...this.state, query: this.itemQuery(), data: [], selected: -1, first: true})
        resetForm()
    }

    noDataComponent = () => {
        return <NoDataResult first={this.state.first}/>
    }

    render() {
        return (<Pages title={"Pólizas Asegurado"}>
            <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                <div className="container-fluid">
                    <Alerts ref={this.alert}/>
                    <div className={"card shadow"}>
                        <CardBody>
                            <div className="container-fluid">
                                <UqaiFormik initialValues={this.state.query} onSubmit={this.onSubmit}
                                            ref={this.form}
                                            enableReinitialize={true} validateOnChange={false}>
                                    {({
                                          isSubmitting,
                                          resetForm,
                                          submitForm
                                      }) => (
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
                                                <div className="col-lg-3">
                                                    <label
                                                        className="form-label fw-bold text-secondary fs-7">Desde: </label>
                                                    <UqaiField name="desde"
                                                               placeholder="Ingrese Fecha"
                                                               component={UqaiCalendario}
                                                    />
                                                </div>
                                                <div className="col-lg-3">
                                                    <label
                                                        className="form-label fw-bold text-secondary fs-7">Hasta: </label>
                                                    <UqaiField name="hasta"
                                                               placeholder="Ingrese Fecha"
                                                               component={UqaiCalendario}
                                                    />
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
                                                <div className="col-lg-6" align="left">
                                                    <button type="button" className="btn btn-success me-2"
                                                            onClick={() => this.handleResetForm(resetForm)}>
                                                        Nueva Consulta
                                                    </button>
                                                    <button type="submit" className="btn btn-primary"
                                                            onClick={submitForm}
                                                            disabled={isSubmitting || this.state.loading}>
                                                        Buscar
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </UqaiFormik>

                                <div className="container mt-4">
                                    <span className="text-primary option px-2">Titular: </span>
                                    <span
                                        className="text-verde option px-2">{this.props.user.nmAsegurado} {this.props.user.apAsegurado}</span>
                                </div>

                                <div className="container mt-4">
                                    <ReactTable
                                        noDataText={this.noDataComponent}
                                        previousText={"Anterior"}
                                        loadingText={"Cargando..."}
                                        nextText={"Siguiente"}
                                        pageText={"Página"}
                                        rowsText={"filas"}
                                        ofText={"de"}
                                        columns={[
                                            {
                                                Header: "Información Adicional",
                                                minResizeWidth: 200,
                                                sortable: false,
                                                width: 200,
                                                id: "informacion",
                                                accessor: "cdRamoCotizacion",
                                                Cell: row => <InfoAdicionalPoliza coti={row.original}/>
                                            },
                                            {
                                                Header: "Aseguradora",
                                                minResizeWidth: 50,
                                                sortable: true,
                                                accessor: "aseguradora"
                                            },
                                            {
                                                Header: "Ramo",
                                                minResizeWidth: 50,
                                                accessor: "nmRamo",
                                                sortable: true,
                                                minWidth: 180
                                            },
                                            {
                                                Header: "Cliente",
                                                minResizeWidth: 50,
                                                sortable: true,
                                                accessor: "nmCliente"
                                            },
                                            {
                                                id: "fcDesde",
                                                Header: "Fc Desde",
                                                sortable: true,
                                                accessor: d => {
                                                    return moment(d.fcDesde).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                },
                                                minResizeWidth: 10,
                                            },
                                            {
                                                id: "fcHasta",
                                                Header: "Fc Hasta",
                                                sortable: true,
                                                accessor: d => {
                                                    return moment(d.fcHasta).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                },
                                                minResizeWidth: 10,
                                                width: 100
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
                                                Header: "Factura",
                                                minResizeWidth: 10,
                                                sortable: true,
                                                accessor: "factAseg",

                                            },
                                            {
                                                Header: "Tipo Póliza",
                                                minResizeWidth: 10,
                                                sortable: true,
                                                accessor: "tipo",

                                            }
                                        ]}
                                        getTdProps={(state, rowInfo, column) => {
                                            if (rowInfo && rowInfo.row) {
                                                return {
                                                    onClick: (e, handleOriginal) => {

                                                        if (column.id === "informacion") {
                                                            return;
                                                        }

                                                        this.onSelectAdicional(rowInfo.original);
                                                        this.getEjecutivo(rowInfo.original);

                                                        this.setState({
                                                            selected: rowInfo.index
                                                        });
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
                                        onFetchData={this.fetchData}
                                        defaultPageSize={5}
                                        className="-highlight"
                                        page={this.state.page}
                                        pageSize={this.state.pageSize}
                                        showPaginationTop
                                        showPaginationBottom={false}
                                        onPageChange={page => this.setState({page})}
                                        onPageSizeChange={(pageSize, page) =>
                                            this.setState({page, pageSize})}>
                                    </ReactTable>
                                </div>
                            </div>
                        </CardBody>
                        <Condiciones open={this.state.modalCondiciones} item={this.state.itemAdi}
                                     toggleModal={this.showCondiciones} alert={this.alert.current}
                                     poliza={this.state.itemPoli} isIndividual={this.state.itemPoli.isIndividual}
                                     cdObjCotizacion={this.state.itemPoli.cdObjCotizacion}
                                     ubicacion={this.state.cdUbicacion} cotizacion={this.state.itemPoli.cdCotizacion}
                                     ramo={this.state.cdRamo} cedula={this.props.user.cedula}
                        />
                    </div>
                </div>
            </section>
        </Pages>)
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: state.user,
    auth: state.auth
});

const mapDispatchToProps = {
    on_select
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Polizas);

const InfoAdicionalPoliza = ({coti}) => {
    const [open, toggle] = useToggle(false);
    const user = useSelector(a => a.user);

    return <>
        <div className={"d-flex flex-column justify-content-start"}>

            <tr key={"docs"}>
                <td>
                    <div className="text-left">
                        <span className="text-primary option px-2 c-pointer" title={"Ver docs. digitales"}
                              onClick={() => {
                                  toggle();
                              }}>
                            <i className="fas fa-eye mx-2"/>Docs.Digitales
                        </span>
                    </div>
                </td>
            </tr>
        </div>
        <DocsDigitalesPolizas open={open}
                              closeModal={toggle}
                              row={{
                                  ...coti,
                                  cdCliente: coti.cdCliente,
                                  poliza: coti.poliza,
                                  cdRamo: coti.cdRamo,
                                  cdCompania: coti.cdCompania,
                                  cdRamoCotizacion: coti.cdRamoCotizacion
                              }} user={user} tipo={"produccion"} vam={true}/>
    </>
}