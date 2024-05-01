import React, {useEffect, useRef, useState} from 'react';
import {Button, CardBody, CardHeader, Col, Label, Row} from "reactstrap";
import UqaiFormik from "../../components/UqaiFormik";
import {Form} from "formik";
import {UqaiField} from "../../components/UqaiField";
import axios from "axios";
import {routes} from "./UtilsGeneral";
import ReactTable from "react-table";
import Alerts from "../../components/Alerts";
import Pages from "../../layouts/Pages";

export const GestorEjecutivo = (props) => {

    const getDefaultData = () => ({
        list: [],
        nmAgente: "",
        apAgente: "",
        cdEjecutivo: "",
        cedula: "",
        mail: "",
        tipo: 'E',
        inactivos: false,
        tipoEjecutivo: "0"

    })
    useEffect(() => {
        onSubmit(data);
    }, [])

    const [data, setData] = useState(getDefaultData());
    const [listSP, setListSP] = useState([]);
    const [all, setAll] = useState(false);

    const alert = useRef();
    const form = useRef();

    const handleListSP = (row) => {

        if (listSP.filter(i => i.index === row.original.rnum).length > 0) {
            setListSP(listSP.filter(i => i.index !== row.original.rnum));
            setAll(false);
        } else {
            setListSP([...listSP, {
                index: row.original.rnum,
                nmAgente: row.original.nmAgente,
                tpPersAdm: row.original.tpPersAdm,
                tipo: row.original.tipo,
                cdCompania: row.original.cdCompania,
                mail: row.original.mail,
                cdEjecutivo: row.original.cdEjecutivo,
                cedula: row.original.rucCed,
                tipoEjecutivo: row.original.tipoEjecutivo
            }]);
            setAll(listSP.length === data.list.length);
        }
    }

    const selectAll = (valor) => {
        let tmp = [];
        if (valor) {
            data.list.forEach(value => {
                tmp.push({
                    index: value.rnum,
                    nmAgente: value.nmAgente,
                    tpPersAdm: value.tpPersAdm,
                    tipo: value.tipo,
                    cdCompania: value.cdCompania,
                    mail: value.mail,
                    cdEjecutivo: value.cdEjecutivo,
                    cedula: value.rucCed,
                })
            });
        }
        setListSP(tmp);
        setAll(valor);
    }

    const handleCreaUsrWeb = (submitForm) => {
        const current = alert.current
        axios.post(routes.api + "/ejecutivosSubagente-crear", listSP)
            .then(res => {
                current.show_info("Activados " + res.data)
                submitForm && submitForm();
            }).catch(err => current.handle_error(err))
    }

    const handleInacUsrWeb = (submitForm) => {
        const current = alert.current
        axios.post(routes.api + "/ejecutivoDesactivar", listSP)
            .then(res => {
                current.show_info("Desactivados " + res.data)
                submitForm && submitForm();
            }).catch(err => current.handle_error(err))
    }

    const handleResetForm = () => {
        setListSP([]);
        setData(getDefaultData());
    }

    const onSubmit = (newValues) => {
        const current = alert.current
        setListSP([])
        setData({...newValues, loading: true})
        axios.post(routes.api + "/ejecutivo-search", {...newValues})
            .then(res => {
                setData({...data, list: res.data.data, loading: false});
                setListSP([]);
                setAll(false);
            }).catch(current.handle_error)
    }


    return (
        <Pages title={'Gestor Ejecutivo'}>
            <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                <div className="container-fluid">
                    <Alerts ref={alert}/>
                    <div className={"card shadow"}>
                        <CardHeader className="d-flex align-items-center border-bottom border-primary">
                            <h5 className="my-0 fw-bold">Gestor Ejecutivo</h5>
                        </CardHeader>
                        <CardBody>
                            <div className="container-fluid">
                                <UqaiFormik initialValues={data} onSubmit={onSubmit} ref={form}
                                            enableReinitialize={true}
                                            validateOnChange={false}>
                                    {({isSubmitting, submitForm}) => (
                                        <Form className={"container"}>
                                            <Row>
                                                <div className="form-group col-lg-6">
                                                    <Label className={"form-label fw-bold text-secondary fs-7"}>Tipo de
                                                        Ejecutivo</Label>
                                                    <UqaiField component="select" className="form-select" type="text"
                                                               placeholder="tipo"
                                                               name="tipoEjecutivo">
                                                        <option value="0">Ejecutivos Activos</option>
                                                        <option value="X">Ejecutivos Inactivos</option>
                                                        <option value="1">TODOS</option>
                                                    </UqaiField>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="form-group col-lg-6">
                                                    <Label
                                                        className={"form-label fw-bold text-secondary fs-7"}>Nombre:</Label>
                                                    <UqaiField className="form-control" type="text"

                                                               placeholder="Nombre"
                                                               name="nmAgente"/>
                                                </div>
                                                <div className={"form-group col-md-6 col-sm-12"}>
                                                    <Label
                                                        className={"form-label fw-bold text-secondary fs-7"}>Apellido:</Label>
                                                    <UqaiField className="form-control" type="text"

                                                               placeholder="Apellido"
                                                               name="apAgente"/>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="form-group col-lg-6">
                                                    <Label
                                                        className={"form-label fw-bold text-secondary fs-7"}>Correo:</Label>
                                                    <UqaiField className="form-control" type="text"

                                                               placeholder="Correo"
                                                               name="mail"/>
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <Label
                                                        className={"form-label fw-bold text-secondary fs-7"}>Cédula/RUC:</Label>
                                                    <UqaiField className="form-control" type="text"

                                                               placeholder="Cédula"
                                                               name="cedula"/>
                                                </div>
                                            </Row>
                                            <Col xs={12}>
                                                <Row>
                                                    <div className="form-group col-lg-6 my-2">
                                                        <Button type={"submit"} color="primary"
                                                                className="me-3"
                                                                onClick={submitForm}
                                                                disabled={isSubmitting}>
                                                            Buscar
                                                        </Button>
                                                        <Button className="btn-success"
                                                                onClick={() => handleResetForm()}>
                                                            Nueva Consulta
                                                        </Button>
                                                    </div>
                                                    <div
                                                        className={"form-group col-lg-6 my-2 d-flex justify-content-end"}>
                                                        {listSP.length > 0 &&
                                                            <Button color="primary" className="mx-2"
                                                                    onClick={() => handleCreaUsrWeb(submitForm)}
                                                            >
                                                                Activar Ejecutivo
                                                            </Button>}
                                                        {listSP.length > 0 &&
                                                            <Button color="danger"
                                                                    onClick={() => handleInacUsrWeb(submitForm)}
                                                            >
                                                                    Desactivar Ejecutivo
                                                                </Button>}
                                                            <div className="form-check mx-2">
                                                                <label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>
                                                                    <input className="form-check-input"
                                                                           type="checkbox"
                                                                           style={{cursor: "pointer"}}
                                                                           checked={all}
                                                                           defaultChecked={all}
                                                                           onChange={(e) => {
                                                                               selectAll(e.target.checked);
                                                                           }}
                                                                    />
                                                                    <span
                                                                        className="form-check-sign">Seleccionar Todos los Ejecutivos</span>
                                                                </label>
                                                            </div>
                                                    </div>
                                                </Row>
                                            </Col>
                                        </Form>
                                    )}
                                </UqaiFormik>
                                <br/>
                                <div className={"container"}>
                                    <Row>
                                        <Col xs={12}>
                                            <ReactTable
                                                noDataText={"No se ha encontrado información"}
                                                previousText={"Anterior"}
                                                nextText={"Siguiente"}
                                                pageText={"Página"}
                                                rowsText={"filas"}
                                                ofText={"de"}
                                                columns={[
                                                    {
                                                        Header: "Cod.Ejecutivo",
                                                        width: 130,
                                                        accessor: "cdEjecutivo"
                                                    },
                                                    {
                                                        Header: "Cédula/RUC Contra.",
                                                        width: 150,
                                                        accessor: "cedula"
                                                    },
                                                    {
                                                        Header: "Nombres Ejecutivo",
                                                        width: 140,
                                                        accessor: "nmAgente"
                                                    },
                                                    {
                                                        Header: "Apellidos Ejecutivo",
                                                        width: 140,
                                                        accessor: "apAgente"
                                                    },
                                                    {
                                                        Header: "Dirección",
                                                        width: 150,
                                                        accessor: "direccion"
                                                    },
                                                    {
                                                        Header: "Correo",
                                                        width: 200,
                                                        accessor: "mail"
                                                    }, {
                                                        Header: "Cargo",
                                                        width: 140,
                                                        accessor: "cargo"
                                                    }, {
                                                        Header: "Usr. Web",
                                                        minResizeWidth: 10,
                                                        accessor: "activaWeb",
                                                        width: 100,
                                                        Cell: row => {
                                                            return (row.original.usuarioweb === 1) ?
                                                                <p><span className={"text-primary"}>SI</span></p>
                                                                :
                                                                <p><span className={"text-danger"}>NO</span></p>
                                                        }
                                                    },
                                                    {
                                                        id: "selected",
                                                        Header: "Sel.",
                                                        width: 50,
                                                        Cell: row => {
                                                            return <div>
                                                                <input type="checkbox"
                                                                       className="form-check-input c-pointer"
                                                                       defaultChecked={listSP.filter(i => i.index === row.original.rnum).length > 0}
                                                                />
                                                            </div>
                                                        }
                                                    },


                                                ]}
                                                getTdProps={(state, rowInfo, column) => {
                                                    if (rowInfo && rowInfo.row) {
                                                        return {
                                                            onClick: (e, handleOriginal) => {
                                                                if (column.id === "selected") {
                                                                    handleListSP(rowInfo)
                                                                }
                                                                if (handleOriginal) {
                                                                    handleOriginal();
                                                                }
                                                            },
                                                            style: {
                                                                cursor: "pointer",
                                                                //backgroundColor: rowInfo.index === state.selected ? '#47b2a2' : 'white',
                                                                //color: rowInfo.index === state.selected ? 'white' : 'black',
                                                                height: 35,
                                                            }
                                                        }
                                                    } else {
                                                        return {}
                                                    }
                                                }}
                                                data={data.list}
                                                pages={data.pages}
                                                loading={data.loading}
                                                onFetchData={(state, instance) => {
                                                    setData({...data, pageSize: state.pageSize})
                                                    if (data.list.length !== 0) {
                                                        setData({...data, loading: true})
                                                        axios.post(routes.api + '/ejecutivo-search', {
                                                            ...data
                                                        })
                                                            .then((res) => {
                                                                setData({
                                                                    ...data,
                                                                    list: res.data.data,
                                                                    loading: false
                                                                });
                                                                setListSP([]);
                                                                setAll(false);
                                                            }).catch(err => err)
                                                    }
                                                }}
                                                sortable={false}
                                                defaultPageSize={10}
                                                showPaginationTop
                                                showPaginationBottom={false}
                                                className="-highlight">
                                            </ReactTable>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </CardBody>
                    </div>
                </div>
            </section>
        </Pages>
    );
};