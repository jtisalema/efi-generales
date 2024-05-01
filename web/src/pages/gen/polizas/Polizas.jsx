import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {Button, CardBody, CardHeader, Col, Label, Row, Table} from "reactstrap";
import axios from "axios";
import Alerts from "../../../components/Alerts";
import UqaiFormik from "../../../components/UqaiFormik";
import {Form} from "formik";
import {find_aseguradoras, find_companias, find_ram_grupos, find_ramos, find_ramos_ramgrp} from "../../../api/CacheApi";
import {UqaiCalendario} from "../../../components/UqaiCalendario";
import ReactTable from "react-table";
import {on_select} from "./actions";
import {UqaiField} from "../../../components/UqaiField"
import {pos} from "../../../util/General";
import {routes} from "../UtilsGeneral";
import {Condiciones} from "./parts/Condiciones";
import moment from "moment";
import "moment/locale/es"
import {Asegurados} from "./Asegurados";
import {Facturacion} from "./parts/Facturacion";
import {CondicionesVehi} from "./parts/CondicionesVehi";
import {Detalles} from "./Detalles";
import {DocsDigitalesPolizas} from "./parts/doc-digital/DocsDigitalesPolizas";
import Pages from "../../../layouts/Pages";

class Polizas extends Component {

    constructor() {
        super(...arguments);
        this.alert = React.createRef();
        this.form = React.createRef();
        this.state = {
            data: [],
            data1: [],
            ramos: [],
            ramosList: [],
            nombres: null,
            telfs: null,
            correos: null,
            contratantes: null,
            asegs: [],
            agentes: [],
            companias: [],
            pages: -1,
            pages1: -1,
            page: 0,
            page1: 0,
            loading: false,
            loading1: false,
            cot: {},
            itemPoli: {},
            cdUbicacion: null,
            cdCotizacion: null,
            cdRamo: null,
            itemAdi: {},
            adicionales: [],
            modalCondiciones: false,
            modalCondicionesVehi: false,
            modalDetallesVehi: false,
            modalAsegurados: false,
            modalFacturacion: false,
            modalDocs: false,
            modalDetalles: false,
            vida: false,
            selected: -1,
            query: this.queryItem()
        };
    }

    queryItem() {
        return {
            page: 0,
            pageSize: 10,
            poliza: '',
            placa: '',
            ramo: 0,
            aseg: 0,
            comp: 0,
            desde: "",
            hasta: "",
            sorted: [],
            cdCliente: this.props.user.cdCliente,
            inclEjecutivo: false,
            cdEjecutivoAdm: 0,
            cdEjecutivo: 0
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
                        ramosTmp.push(item);
                    });
                    this.setState({ramosList: ramos, ramos: ramosTmp.sort((a, b) => a.nmRamo.localeCompare(b.nmRamo))});
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
            this.setState({query: this.queryItem()}, () => {
                this.fetchData({}, {})
            });
        }
    }


    /**
     * funcion a ejecutarse cuando se da click en guardar desde el menu
     */
    onSubmit = (newValues, actions) => {
        this.setState({
            query: {...this.state.query, ...newValues, page: 0},
            page: 0, selected: -1, selected2: -1
        }, () => this.fetchData({}, actions));
    };


    fetchData = (query = {}, actions) => {

        let query2 = Object.assign({}, this.state.query);
        query2.sorted = query.sorted;
        if (query.page >= 0) {
            query2.page = query.page;
            // query2.page = 1;
        }

        if (query.pageSize >= 0) {
            query2.pageSize = query.pageSize;
        }
        this.setState({loading: true});

        if (query2.page !== this.state.query.page || query2.page === 0) {
            axios.post(routes.api + '/polizas', query2).then(resp => {

                resp.data.content.forEach(p => {
                    switch (p.tipoPol) {
                        case 'N':
                            p.tipoPol = 'POLIZA NUEVA';
                            break;
                        case 'R':
                            p.tipoPol = 'RENOVACIÓN';
                            break;
                        default:
                            break;
                    }
                });
                this.setState({
                    data: resp.data.content,
                    pages: resp.data.totalPages,
                    loading: false,
                    sorted: resp.data.sorted,
                    data1: [],
                    adicionales: [],
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
            );
        }
    };

    getEjecutivo = (coti) => {
        axios.get(routes.api + '/ejecutivoAdm', {
            params: {
                cdEjecutivo: coti.cdEjecutivo,
                cdCompania: coti.cdCompania,
            }
        }).then(resp => {
            this.setState({nombres: resp.data.nombres, correos: resp.data.correos, telfs: resp.data.telefonos});
        });
    };

    onSelectAdicional = (coti) => {
        let ramo = this.state.ramos.find(ram => ram.cdRamo === coti.cdRamo);
        if (ramo && (ramo.nmRamo.includes('VIDA') || ramo.nmRamo.includes('MEDICA'))) {
            axios.get(routes.api + '/ubicacion', {
                params: {
                    cdCompania: coti.cdCompania,
                    cdRamoCotizacion: coti.cdRamoCotizacion
                }
            }).then(resp => {
                this.setState({
                        adicionales: resp.data,
                        itemPoli: coti,
                        vida: true, //para saber q mostrar en condiciones, asegurados y facturacion
                    }
                );

                document.getElementById('dummy').scrollIntoView({behavior: "smooth"});

            }).catch(error => {
                this.alert.current.handle_error(error);
            });
        } else {
            this.getVPolizas(coti)
        }
    };

    getVPolizas = (coti, page = 0, pageSize = 10, sorted = []) => {
        let query = {
            cdCliente: this.props?.user?.cdCliente,
            poliza: coti.poliza,
            cdRamo: coti.cdRamo,
            cdAseguradora: coti?.cotizacion?.aseguradora?.cdAseguradora,//con esto busca la aseguradora
            cdCompania: coti?.cdCompania,
            placa: coti?.placa,
            page: page,
            pageSize: pageSize,
            sorted: sorted,
            fcDesde: new Date(coti?.fcDesde),
            fcHasta: new Date(coti?.fcHasta || coti?.fcVenceMst),
        };
        let query2 = Object.assign({}, query);
        query2.sorted = query.sorted;
        if (query.page >= 0) {
            query2.page = query.page;
        }
        if (query.pageSize >= 0) {
            query2.pageSize = query.pageSize;
        }

        if (query2.page !== this.state.query.page || query2.page === 0) {
            axios.post(routes.api + '/v-polizas', query2).then(resp => {
                resp.data.content.forEach(p => {
                    if (p.tipo.indexOf('RENO') >= 0) {
                        p.tipo = 'RENOVACIÓN';
                    }

                    if (p.tipo.indexOf('COTI') >= 0) {
                        p.tipo = 'POLIZA NUEVA';
                    }
                });
                this.setState({
                    itemPoli: coti,
                    data1: resp.data.content,
                    pages1: resp.data.totalPages,
                    loading1: false,
                    vida: false//para saber q mostrar en condiciones, detalles y facturacion
                });

                document.getElementById('dummy').scrollIntoView({behavior: "smooth"});
            }).catch(error => {
                    this.alert.current.handle_error(error);
                }
            );
        }
    }
    onSelectAnexo = (coti) => {
        this.setState({itemAdi: coti});
    }

    showCondiciones = open => {
        this.setState({modalCondiciones: open});
    }

    showDetallesVehi = open => {
        this.setState({modalDetallesVehi: open});
    }

    showCondicionesVehi = open => {
        this.setState({modalCondicionesVehi: open});
    }

    showAsegurados = open => {
        this.setState({modalAsegurados: open});
    }

    showFacturacion = open => {
        this.setState({modalFacturacion: open});
    }

    showDocs = open => {
        this.setState({modalDocs: open});
    }

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
        this.setState({...this.state, query: this.queryItem(), data: [], data1: [], selected: -1})
        resetForm();
    }

    render() {
        return (
            <Pages title={'Pólizas Contratante'}>
                <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                    <div className="container-fluid">
                        <Alerts ref={this.alert}/>
                        <div className={"card shadow"}>
                            <CardHeader className="d-flex align-items-center border-bottom border-primary">
                                <h5 className="my-0 fw-bold">Mis Pólizas</h5>
                            </CardHeader>
                            <CardBody>
                                <div className="container-fluid">
                                    <UqaiFormik initialValues={this.state.query} onSubmit={this.onSubmit}
                                                ref={this.form}
                                                enableReinitialize={true} validateOnChange={false}>
                                        {({isSubmitting, resetForm, submitForm}) => (
                                            <Form className="container">
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
                                                            className={"form-label fw-bold text-secondary fs-7"}>Ramo: </Label>
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
                                                </Row>
                                                <Row>
                                                    <Col xs={12} sm={6}>
                                                        <Row>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Vigencia
                                                                    Desde: </Label>
                                                                <UqaiField name="desde"
                                                                           placeholder="Ingrese Fecha"
                                                                           component={UqaiCalendario}
                                                                />
                                                            </div>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Vigencia
                                                                    Hasta: </Label>
                                                                <UqaiField name="hasta"
                                                                           placeholder="Ingrese Fecha"
                                                                           component={UqaiCalendario}
                                                                />
                                                            </div>
                                                        </Row>
                                                    </Col>
                                                    <Col xs={12} sm={6}>
                                                        <Row>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}> Placa: </Label>
                                                                <UqaiField className="form-control" type="text"
                                                                           placeholder="Placa" name="placa"/>
                                                            </div>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Aseguradora: </Label>
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
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <div className="form-group col-lg-6 my-2">
                                                        <Button type={"submit"} color="primary"
                                                                className="me-3"
                                                                onClick={submitForm}
                                                                disabled={isSubmitting}>
                                                            Buscar
                                                        </Button>
                                                        <Button className="btn-success"
                                                                onClick={() => this.handleResetForm(resetForm)}>
                                                            Nueva Consulta
                                                        </Button>

                                                    </div>
                                                </Row>
                                            </Form>
                                        )}
                                    </UqaiFormik>
                                    <br/>
                                    <Row>
                                        <Col xs={12}>
                                            <h4>{"Pólizas"}</h4>
                                            <ReactTable
                                                noDataText={this.state.loading?'':'No se han encontrado pólizas'}
                                                previousText={"Anterior"}
                                                loadingText={"Cargando..."}
                                                nextText={"Siguiente"}
                                                pageText={"Página"}
                                                rowsText={"filas"}
                                                ofText={"de"}
                                                columns={[
                                                    {
                                                        Header: "Aseguradora",
                                                        minResizeWidth: 50,
                                                        sortable: true,
                                                        accessor: "cotizacion.aseguradora.nmAlias",
                                                    },
                                                    {
                                                        Header: "Ramo",
                                                        minResizeWidth: 50,
                                                        minWidth: 200,
                                                        sortable: true,
                                                        accessor: "ramo.nmRamo",
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

                                                            return d.fcHasta ? moment(d.fcHasta).locale('moment/locale/es').local().format("DD/MM/YYYY") : (d.fcVenceMst ? moment(d.fcVenceMst).locale('moment/locale/es').local().format("DD/MM/YYYY") : '-')
                                                        },
                                                        minResizeWidth: 10,
                                                    },
                                                    {
                                                        Header: "Póliza",
                                                        minResizeWidth: 10,
                                                        sortable: true,
                                                        accessor: "poliza",
                                                        width: 140,
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
                                                        accessor: "tipoPol",
                                                    }
                                                ]}
                                                getTdProps={(state, rowInfo) => {
                                                    if (rowInfo && rowInfo.row) {
                                                        return {
                                                            onClick: (e, handleOriginal) => {
                                                                this.setState({adicionales: [], data1: []});
                                                                this.onSelectAdicional(rowInfo.original);
                                                                this.getEjecutivo(rowInfo.original);

                                                                this.setState({
                                                                    selected: rowInfo.index,
                                                                    selected2: -1
                                                                });
                                                                if (handleOriginal) {
                                                                    handleOriginal();
                                                                }
                                                            },
                                                            style: {
                                                                cursor: "pointer",
                                                                backgroundColor: rowInfo.index === this.state.selected ? '#00BCEA' : 'rgba(238,245,246,0.15)',
                                                                color: rowInfo.index === this.state.selected ? 'white' : 'black',
                                                                height: 35,
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
                                        </Col>
                                    </Row>
                                    <br/>
                                    <br/>
                                    <div id={"dummy"}/>
                                    <Row>
                                        <Col xs={12}>
                                            {(this.state.adicionales.length > 0) ?
                                                <>
                                                    <h4>{"Pólizas - Anexos"}</h4>
                                                    <Table className="table table-borderless table-hover" responsive>
                                                        <thead>
                                                        <tr className="text-secondary">
                                                            <th className={"bg-white st-250"} scope="col">Información
                                                                Adicional
                                                            </th>
                                                            <th className="bg-white" scope="col">Item</th>
                                                            <th className="bg-white" scope="col">Grupo</th>
                                                            <th className="bg-white" scope="col">Fc Desde</th>
                                                            <th className="bg-white" scope="col">Fc Hasta</th>
                                                            <th className="bg-white" scope="col">Póliza</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {(this.state.adicionales).map(adicional => (
                                                            <tr key={adicional.cdRubro}>
                                                                <td className="st-250">
                                                                    <div className="text-left">
                                                                <span className="text-primary option px-2 c-pointer"
                                                                      title="Ver condiciones" onClick={() => {
                                                                    this.onSelectAnexo(adicional);
                                                                    this.showCondiciones(true);
                                                                }}>
                                                                <i className="fas fa-eye mx-2"/>
                                                                 Condiciones
                                                                       </span>
                                                                        <br/>
                                                                        <span
                                                                            className="text-primary option px-2 c-pointer"
                                                                            title="Ver asegurados"
                                                                            onClick={() => {
                                                                                this.onSelectAnexo(adicional);
                                                                                this.showAsegurados(true);
                                                                            }}>
                                                        <i className="fas fa-eye mx-2 c-pointer"/>
                                                        Asegurados
                                                                       </span>
                                                                        <br/>
                                                                        <span
                                                                            className="text-primary option px-2 c-pointer"
                                                                            title="Ver docs. digitales"
                                                                            onClick={() => {
                                                                                this.onSelectAnexo(adicional);
                                                                                this.showDocs(true);
                                                                            }}>
                                                        <i className="fas fa-eye mx-2 c-pointer"/>
                                                        Docs.Digitales
                                                                       </span>
                                                                    </div>
                                                                </td>
                                                                <td>{adicional.item}</td>
                                                                <td>{adicional.dscUbicacion}</td>
                                                                <td>{this.state.itemPoli.fcDesde}</td>
                                                                <td>{this.state.itemPoli.fcHasta}</td>
                                                                <td>{this.state.itemPoli.poliza}</td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </Table>
                                                </>
                                                : null
                                            }
                                        </Col>

                                        <Col xs={12}>
                                            {(this.state.data1.length > 0) ?
                                                <>
                                                    <h4>{"Pólizas - Anexos"}</h4>
                                                    <ReactTable
                                                        noDataText={"No se han encontrado pólizas"}
                                                        previousText={"Anterior"}
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
                                                                Cell: row => <InfoAdicional coti={row.original}
                                                                                            onSelectAnexo={this.onSelectAnexo}
                                                                                            showCondiciones={this.showCondicionesVehi}
                                                                                            showDetalles={this.showDetallesVehi}
                                                                                            showFacturacion={this.showFacturacion}
                                                                                            showDocs={this.showDocs}/>
                                                            },
                                                            {
                                                                Header: "Ramo",
                                                                minResizeWidth: 50,
                                                                width: 200,
                                                                sortable: true,
                                                                accessor: "nmRamo",
                                                            },
                                                            {
                                                                id: "fcDesde",
                                                                Header: "Fc Desde",
                                                                sortable: true,
                                                                accessor: d => {
                                                                    return moment(d.fcDesde).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                                },
                                                                minResizeWidth: 10,
                                                                width: 100,
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
                                                                width: 140,
                                                                sortType: (rowA, rowB) => {
                                                                    const nameA = rowA.original?.poliza;
                                                                    const nameB = rowB.original?.poliza;
                                                                    return nameA.localeCompare(nameB);
                                                                },
                                                            },
                                                            {
                                                                Header: "Tipo Movimiento",
                                                                minResizeWidth: 10,
                                                                sortable: true,
                                                                accessor: "tipo",
                                                                width: 160,
                                                            },
                                                            {
                                                                Header: "Factura",
                                                                minResizeWidth: 10,
                                                                sortable: true,
                                                                accessor: "factAseg",
                                                                width: 140
                                                            },
                                                            {
                                                                Header: "Anexo",
                                                                minResizeWidth: 10,
                                                                sortable: true,
                                                                accessor: "anexo"
                                                            },
                                                            {
                                                                Header: "Aplicación",
                                                                minResizeWidth: 10,
                                                                sortable: true,
                                                                accessor: "numAplica"
                                                            },
                                                            {
                                                                Header: "Val. Asegurado",
                                                                minResizeWidth: 10,
                                                                sortable: true,
                                                                accessor: "totAsegurado"
                                                            },
                                                            {
                                                                Header: "Prima Neta",
                                                                minResizeWidth: 10,
                                                                sortable: true,
                                                                accessor: "totPrima"
                                                            }
                                                        ]}
                                                        getTdProps={(state, rowInfo) => {
                                                            if (rowInfo && rowInfo.row) {
                                                                return {
                                                                    onClick: (e, handleOriginal) => {

                                                                        this.setState({
                                                                            selected2: rowInfo.index
                                                                        });

                                                                        if (handleOriginal) {
                                                                            handleOriginal();
                                                                        }
                                                                    },
                                                                    style: {
                                                                        cursor: "pointer",
                                                                        // backgroundColor: rowInfo.index === this.state.selected2 ? '#dde7ec' : 'white',
                                                                        //color: rowInfo.index === this.state.selected2 ? 'white' : 'black',
                                                                        height: 90,
                                                                    }
                                                                }
                                                            } else {
                                                                return {}
                                                            }
                                                        }}
                                                        manual
                                                        data={this.state.data1}
                                                        pages={this.state.pages1}
                                                        loading={this.state.loading1}
                                                        defaultPageSize={5}
                                                        showPaginationTop
                                                        onFetchData={(state, instance) => {
                                                            if (Object.entries(this.state.itemPoli)?.length > 0) {
                                                                this.getVPolizas(this.state.itemPoli, state?.page, state?.pageSize, state?.sorted);
                                                            }
                                                        }}
                                                        showPaginationBottom={false}
                                                        className="-highlight"
                                                        page={this.state.page1}
                                                        pageSize={this.state.pageSize1}
                                                        onPageChange={page => this.setState({
                                                            page,
                                                            selected2: false
                                                        })}
                                                        onPageSizeChange={(pageSize, page) =>
                                                            this.setState({page, pageSize})}>
                                                    </ReactTable>
                                                </>
                                                : null
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </div>
                        <Condiciones open={this.state.modalCondiciones} item={this.state.itemAdi}
                                     toggleModal={this.showCondiciones} alert={this.alert.current}
                                     poliza={this.state.itemPoli} cdObjCotizacion={this.state.itemPoli.cdObjCotizacion}
                                     ubicacion={this.state.cdUbicacion} cotizacion={this.state.itemPoli.cdCotizacion}
                                     ramo={this.state.cdRamo} user={this.props.user} vida={this.state.vida}
                                     ramos={this.state.ramosList}/>

                        <CondicionesVehi open={this.state.modalCondicionesVehi} item={this.state.itemAdi}
                                         toggleModal={this.showCondicionesVehi} alert={this.alert.current}
                                         poliza={this.state.itemPoli}
                                         cdObjCotizacion={this.state.itemPoli.cdObjCotizacion}
                                         ubicacion={this.state.cdUbicacion}
                                         cotizacion={this.state.itemPoli.cdCotizacion}
                                         ramo={this.state.cdRamo} user={this.props.user} vida={this.state.vida}
                                         ramos={this.state.ramosList}/>

                        <Asegurados open={this.state.modalAsegurados} item={this.state.itemAdi}
                                    toggleModal={this.showAsegurados} alert={this.alert.current}
                                    poliza={this.state.itemPoli} cdObjCotizacion={this.state.itemPoli.cdObjCotizacion}
                                    ubicacion={this.state.cdUbicacion} user={this.props.user} vida={this.state.vida}
                                    ramos={this.state.ramosList}/>

                        <Detalles open={this.state.modalDetallesVehi} item={this.state.itemAdi}
                                  toggleModal={this.showDetallesVehi} alert={this.alert.current}
                                  poliza={this.state.itemPoli} cdObjCotizacion={this.state.itemPoli.cdObjCotizacion}
                                  ubicacion={this.state.cdUbicacion} user={this.props.user} vida={this.state.vida}
                                  ramos={this.state.ramosList}/>

                        <Facturacion open={this.state.modalFacturacion} item={this.state.itemAdi}
                                     toggleModal={this.showFacturacion} alert={this.alert.current}
                                     poliza={this.state.itemPoli} user={this.props.user} vida={this.state.vida}
                                     ramos={this.state.ramosList}/>

                        <DocsDigitalesPolizas open={this.state.modalDocs}
                                              closeModal={this.showDocs}
                                              row={{
                                                  ...this.state.itemPoli,
                                                  cdCliente: this.state.itemPoli.cotizacion?.cdCliente,
                                                  poliza: this.state.itemPoli.poliza,
                                                  cdRamo: this.state.itemPoli.cdRamo,
                                                  cdCompania: this.state.itemPoli.cdCompania,
                                                  cdRamoCotizacion: this.state.itemPoli.cdRamoCotizacion
                                              }} user={this.props.user} tipo={"produccion"}/>
                    </div>
                </section>
            </Pages>
        )
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

export const InfoAdicional = ({coti, onSelectAnexo, showCondiciones, showDetalles, showFacturacion, showDocs}) => {

    return (
        <div className={"d-flex flex-column justify-content-start"}>
            <tr key={"condiciones"}>
                <td className="st-50">
                    <div className="text-left">
                        <span className="text-primary option px-2 c-pointer"
                              title="Ver condiciones" onClick={() => {
                            onSelectAnexo(coti);
                            showCondiciones(true);
                        }}><i className="fas fa-eye mx-2"/>Condiciones</span>
                    </div>
                </td>
            </tr>
            <tr key={"detalles"}>
                <td>
                    <div className="text-left">
                        <span className="text-primary option px-2 c-pointer" title="Ver detalles" onClick={() => {
                            onSelectAnexo(coti);
                            showDetalles(true);
                        }}><i className="fas fa-eye mx-2"/>Detalles</span>
                    </div>
                </td>
            </tr>

            <tr key={"docs"}>
                <td>
                    <div className="text-left">
                        <span className="text-primary option px-2 c-pointer" title={"Ver docs. digitales"}
                              onClick={() => {
                                  onSelectAnexo(coti);
                                  showDocs(true);
                              }}>
                            <i className="fas fa-eye mx-2"/>Docs.Digitales
                        </span>
                    </div>
                </td>
            </tr>
        </div>
    )
}