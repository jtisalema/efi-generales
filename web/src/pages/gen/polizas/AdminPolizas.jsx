import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {Button, CardBody, CardHeader, Col, Label, Modal, ModalBody, ModalFooter, Row, Table} from "reactstrap";
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
import moment from "moment";
import "moment/locale/es"
import {do_login} from "../../sec/redux/actions";
import Pages from "../../../layouts/Pages";
import {UqaiModalHeader} from "../../../components/UqaiModal";

class AdminPolizas extends Component {

    constructor() {
        super(...arguments);
        this.alert = React.createRef();
        this.form = React.createRef();
        this.state = {
            data: [],
            ramos: [],
            telfs: null,
            correos: null,
            asegs: [],
            companias: [],
            adicionales: [],
            pages: -1,
            page: 0,
            pageSize: 10,
            loading: false,
            cdUbicacion: null,
            cdCotizacion: null,
            cdRamo: null,
            itemAdi: {},
            query: {
                page: 0,
                pageSize: 10,
                poliza: '',
                ramo: 0,
                aseg: 0,
                comp: 0,
                desde: new Date(new Date().getFullYear() - 10, new Date().getMonth(), 1),
                hasta: new Date(),
                sorted: null,
                nm: '',
                ap: '',
                cedula: ''

            },

        };
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
            page: 0
        }, () => {
            this.fetchData({}, actions)
        });
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

        if (query2.page !== this.state.query.page || query2.page === 0) {
            axios.post(routes.api + '/polizas.admin', query2).then(resp => {


                let data = [];
                resp.data.content.forEach(d => {
                    data.push({
                        cdCotizacion: d[0],
                        cdCompania: d[1],
                        nmCliente: d[2],
                        apCliente: d[3],
                        cdAseguradora: d[4],
                        cdRamo: d[5],
                        nmAseguradora: d[6],
                        nmRamo: d[7],
                        poliza: d[8],
                        totAsegurado: d[9],
                        cdRamoCotizacion: d[10],
                        fcDesde: d[11],
                        fcHasta: d[12],
                        cdCliente: d[13],
                        tipo: d[14],
                        numCotizacion: d[15]
                    })
                });

                data.forEach(p => {
                    if (p.tipo.indexOf('RENO') >= 0) {
                        p.tipo = 'RENOVACIÓN';
                    }

                    if (p.tipo.indexOf('COTI') >= 0) {
                        p.tipo = 'POLIZA NUEVA';
                    }
                });

                this.setState({
                    data,
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
            );
        }
    };


    onSelectAdicional = (coti) => {

        axios.get(routes.api + '/objeto.admin', {
            params: {
                cdCompania: coti.cdCompania,
                cdRamoCotizacion: coti.cdRamoCotizacion
            }
        }).then(resp => {
            this.setState({
                adicionales: resp.data,
                modal: true
            });

        }).catch(error => {
            this.alert.current.handle_error(error);
        });
    };


    isVam = (r) => {
        let vam;
        let ls_nm_grp_ramo = r.nmArea;
        if (pos(ls_nm_grp_ramo, 'MEDICA') > 0) {
            //pb_actvam.TriggerEvent(Clicked!)
            vam = true;
        } else vam = pos(ls_nm_grp_ramo, 'VIDA') > 0;
        return vam
    };

    onSelectObj = obj => {
        if (obj.cedulaO && obj.cedulaO.length > 2) {
            let user = JSON.parse(JSON.stringify(this.props.user));
            user.cedula = obj.cedulaO;
            user.nm = obj.dscObjeto;
            user.ap = '';
            this.props.do_login(user);
            this.props.history.push('/polizas');
        } else {
            this.alert.current.show_error('No tiene cédula');
        }
    };

    toggleModal = isOpen => {
        this.setState({modal: isOpen});
    };

    render() {
        return (
            <Pages title={'Administrador Selección'}>
                <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                    <div className="container-fluid">
                        <Alerts ref={this.alert}/>
                        <div className={"card shadow"}>
                            <CardHeader className="d-flex align-items-center border-bottom border-primary">
                                <h5 className="my-0 fw-bold">Administrador Selección</h5>
                            </CardHeader>
                            <CardBody>
                                <div className="container-fluid">
                                    <UqaiFormik initialValues={this.state.query} onSubmit={this.onSubmit}
                                                ref={this.form}
                                                enableReinitialize={true} validateOnChange={false}>
                                        {({values, isSubmitting, errors, handleChange, resetForm, submitForm}) => (
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
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Desde: </Label>
                                                                <UqaiField name="desde" placeholder="Ingrese Fecha"
                                                                           component={UqaiCalendario}
                                                                />
                                                            </div>
                                                            <div className="form-group col-lg-6">
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Hasta: </Label>
                                                                <UqaiField name="hasta" placeholder="Ingrese Fecha"
                                                                           component={UqaiCalendario}
                                                                />
                                                            </div>
                                                        </Row>
                                                    </Col>
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
                                                <Row>
                                                    <div className="form-group col-lg-6">
                                                        <Label
                                                            className={"form-label fw-bold text-secondary fs-7"}>Sucursales: </Label>
                                                        <UqaiField component="select"
                                                                   className="form-select w-100 inputTable"
                                                                   name="comp">
                                                            <option value="0">--TODOS--</option>
                                                            {this.state.companias.map(comp => (
                                                                <option
                                                                    key={comp.cdCompania}
                                                                    value={comp.cdCompania}>{comp.nombre}</option>
                                                            ))}
                                                        </UqaiField>
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <Label
                                                            className={"form-label fw-bold text-secondary fs-7"}>Cédula: </Label>
                                                        <UqaiField className="form-control" type="text"
                                                                   autoFocus={true}
                                                                   placeholder="Cédula"
                                                                   name="cedula"/>
                                                    </div>
                                                </Row>
                                                <Row>
                                                    <div className="form-group col-lg-6">
                                                        <Label
                                                            className={"form-label fw-bold text-secondary fs-7"}>Apellido: </Label>
                                                        <UqaiField className="form-control" type="text"
                                                                   autoFocus={true} placeholder="Apellido"
                                                                   name="ap"/>
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <Label
                                                            className={"form-label fw-bold text-secondary fs-7"}>Nombre: </Label>
                                                        <UqaiField className="form-control" type="text"
                                                                   autoFocus={true} placeholder="Nombre" name="nm"/>
                                                    </div>
                                                </Row>
                                                <br/>
                                                <Row>
                                                    <div className="form-group col-lg-6 my-2">
                                                        <Button type={"submit"} color="primary"
                                                                className="me-3"
                                                                onClick={submitForm}
                                                                disabled={isSubmitting}>
                                                            Buscar
                                                        </Button>
                                                        <Button className="btn-success"
                                                                onClick={resetForm}>
                                                            Nueva Consulta
                                                        </Button>

                                                    </div>
                                                </Row>
                                            </Form>
                                        )}
                                    </UqaiFormik>

                                    <br/>
                                    <br/>
                                    <Row>
                                        <Col xs={12}>
                                            <ReactTable
                                                noDataText={"No se han encontrado pólizas"}
                                                previousText={"Anterior"}
                                                nextText={"Siguiente"}
                                                pageText={"Página"}
                                                rowsText={"filas"}
                                                ofText={"de"}
                                                columns={[
                                                    {
                                                        Header: "Aseguradora",
                                                        minResizeWidth: 50,
                                                        width: 140,
                                                        sortable: false,
                                                        accessor: "nmAseguradora"
                                                    },
                                                    {
                                                        Header: "Ramo",
                                                        minResizeWidth: 50,
                                                        width: 200,
                                                        sortable: false,
                                                        accessor: "nmRamo"
                                                    },
                                                    {
                                                        Header: "Nombre",
                                                        minResizeWidth: 50,
                                                        width: 200,
                                                        sortable: false,
                                                        accessor: "nmCliente"
                                                    },
                                                    {
                                                        Header: "Apellido",
                                                        minResizeWidth: 50,
                                                        width: 200,
                                                        sortable: false,
                                                        accessor: "apCliente"
                                                    },
                                                    {
                                                        id: "fcDesde",
                                                        sortable: false,
                                                        Header: "Fc Desde",
                                                        accessor: d => {
                                                            return moment(d.fcDesde).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                        },
                                                        minResizeWidth: 10,
                                                        width: 100,
                                                    },
                                                    {
                                                        id: "fcHasta",
                                                        sortable: false,
                                                        Header: "Fc Hasta",
                                                        accessor: d => {
                                                            return moment(d.fcHasta).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                        },
                                                        minResizeWidth: 10,
                                                        width: 100
                                                    },
                                                    {
                                                        Header: "Póliza",
                                                        sortable: false,
                                                        minResizeWidth: 10,
                                                        accessor: "poliza",
                                                        width: 140,
                                                    },
                                                    {
                                                        Header: "Tipo Póliza",
                                                        sortable: false,
                                                        minResizeWidth: 10,
                                                        accessor: "tipo",
                                                        width: 160,
                                                    }
                                                ]}
                                                getTdProps={(state, rowInfo) => {
                                                    if (rowInfo && rowInfo.row) {
                                                        return {
                                                            onClick: (e, handleOriginal) => {
                                                                this.onSelectAdicional(rowInfo.original);

                                                                this.setState({
                                                                    selected: rowInfo.index
                                                                });

                                                                if (handleOriginal) {
                                                                    handleOriginal();
                                                                }
                                                            },
                                                            style: {
                                                                cursor: "pointer",
                                                                height: 30,
                                                            }
                                                        }
                                                    } else {
                                                        return {}
                                                    }
                                                }}

                                                getTrProps={(state, rowInfo, instance) => {
                                                    if (rowInfo) {
                                                        return {
                                                            style: {
                                                                color: rowInfo.index === this.state.selected ? 'white' : 'black'
                                                            }
                                                        }
                                                    }
                                                    return {};
                                                }}
                                                manual
                                                data={this.state.data}
                                                pages={this.state.pages}
                                                loading={this.state.loading}
                                                onFetchData={this.fetchData}
                                                defaultPageSize={10}
                                                className="-highlight"
                                                showPaginationTop
                                                showPaginationBottom={false}
                                                page={this.state.page}
                                                pageSize={this.state.pageSize}
                                                onPageChange={page => this.setState({page})}
                                                onPageSizeChange={(pageSize, page) =>
                                                    this.setState({page, pageSize})}>
                                            </ReactTable>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <br/>
                                    <br/>

                                    <Modal className="mx-auto" isOpen={this.state.modal}>
                                        <UqaiModalHeader toggle={() => this.toggleModal(false)}
                                                         title="Seleccionar Asegurado"/>
                                        <ModalBody>
                                            <Row>
                                                <Col xs={12}>
                                                    {(this.state.adicionales.length > 0) ?
                                                        <Table className="table table-borderless table-hover"
                                                               responsive>
                                                            <thead>
                                                            <tr className="text-secondary">
                                                                <th className="bg-white" scope="col">Item</th>
                                                                <th className="bg-white" scope="col">Cédula</th>
                                                                <th className="bg-white" scope="col">Asegurado</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.adicionales.map(adicional => (
                                                                <tr key={adicional.item} style={{cursor: 'pointer'}}
                                                                    onClick={() => this.onSelectObj(adicional)}>
                                                                    <td>{adicional.item}</td>
                                                                    <td>{adicional.cedulaO}</td>
                                                                    <td>{adicional.dscObjeto}</td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </Table>
                                                        : null
                                                    }
                                                </Col>
                                            </Row>
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-default"
                                                    onClick={() => this.toggleModal(false)}> Cerrar
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                </div>
                            </CardBody>
                        </div>
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
    on_select, do_login
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminPolizas);