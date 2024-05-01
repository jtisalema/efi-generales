import React, {useRef, useState} from 'react';
import Alerts from "../../components/Alerts";
import {Button, CardBody, CardHeader, Col, Label, Row} from "reactstrap";
import UqaiFormik from "../../components/UqaiFormik";
import {Form} from "formik";
import {UqaiField} from "../../components/UqaiField";
import axios from "axios";
import {routes} from "../../util/General";
import ReactTable from "react-table";
import Pages from "../../layouts/Pages";

export const GestorUsuario = (props) => {

    const getDefaultData = () => ({
        list: [],
        page: 0,
        pages: -1,
        loading: false,
        pageSize: 10,
        cdContratante: "",
        nmContratante: "",
        apContratante: "",
        cedula: "",
        nmContacto: "",
        apContacto: "",
        correo: "",
    })

    const [data, setData] = useState(getDefaultData());
    const [listSP, setListSP] = useState([]);

    const alert = useRef();
    const form = useRef();

    const handleListSP = (row) => {

        if (listSP.filter(i => i.index === row.original.rnum).length > 0) {
            setListSP(listSP.filter(i => i.index !== row.original.rnum))
        } else {
            setListSP([...listSP, {
                index: row.original.rnum,
                cdCliente: row.original.cdCliente,
                correo: row.original.mail,
                cdEjecutivo: row.original.cdEjecutivo,
                cedula: row.original.rucCed
            }])
        }
    }

    const handleCreaUsrWeb = (submitForm) => {
        const current = alert.current
        axios.post(routes.api + "/usuarios-generales-crear", listSP)
            .then(res => {
                current.show_info("Activados " + res.data)
                submitForm && submitForm();
            }).catch(err => current.handle_error(err))
    }

    const handleInacUsrWeb = (submitForm) => {
        const current = alert.current
        axios.post(routes.api + "/usuarios-generales-desactivar", listSP)
            .then(res => {
                current.show_info("Desactivados " + res.data)
                submitForm && submitForm();
            }).catch(err => current.handle_error(err))
    }

    const handleResetForm = () => {
        setListSP([]);
        setData(getDefaultData());
    }

    const onSubmit = (newValues, actions) => {
        const current = alert.current
        setListSP([])
        setData({...newValues, loading: true})
        axios.post(routes.api + "/usuarios-generales-gestor", {...newValues})
            .then(res => {
                setData({...data, list: res.data.data, pages: res.data.totalPages, loading: false})
                //current.show_info('Búsqueda Exitosa')
                actions.setSubmitting(false)
            }).catch(err => {
            actions.setSubmitting(false)
            current.handle_error(err)
        })
    }

    return (
        <Pages title={'Usuarios'}>
            <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                <div className="container-fluid">
                    <Alerts ref={alert}/>
                    <div className={"card shadow"}>
                        <CardHeader className="d-flex align-items-center border-bottom border-primary">
                            <h5 className="my-0 fw-bold">Usuarios</h5>
                        </CardHeader>
                        <CardBody>
                            <div className="container-fluid">
                                <UqaiFormik initialValues={data} onSubmit={onSubmit} ref={form}
                                            enableReinitialize={true}
                                            validateOnChange={false}>
                                    {({isSubmitting, submitForm}) => (
                                        <Form className="container">
                                            <Row>
                                                <Col lg={6}>
                                                    <h4 className={"text-center my-2"}>Contratante</h4>
                                                    <Row>
                                                        <div className={"form-group col-md-6 col-sm-12"}>
                                                            <Label
                                                                className={"form-label fw-bold text-secondary fs-7"}>Nombre:</Label>
                                                            <UqaiField className="form-control" type="text"
                                                                       autoFocus={true}
                                                                       placeholder="Nombre"
                                                                       name="nmContratante"/>
                                                        </div>
                                                        <div className={"form-group col-md-6 col-sm-12"}>
                                                            <Label
                                                                className={"form-label fw-bold text-secondary fs-7"}>Apellido:</Label>
                                                            <UqaiField className="form-control" type="text"
                                                                       autoFocus={true}
                                                                       placeholder="Apellido"
                                                                       name="apContratante"/>
                                                        </div>
                                                    </Row>
                                                    <Row>
                                                        <div className={"form-group col-md-6 col-sm-12"}>
                                                            <Label
                                                                className={"form-label fw-bold text-secondary fs-7"}>Código:</Label>
                                                            <UqaiField className="form-control" type="text"
                                                                       autoFocus={true}
                                                                       placeholder="Código"
                                                                       name="cdContratante"/>
                                                        </div>
                                                        <div className={"form-group col-md-6 col-sm-12"}>
                                                            <Label
                                                                className={"form-label fw-bold text-secondary fs-7"}>Cédula/RUC:</Label>
                                                            <UqaiField className="form-control" type="text"
                                                                       autoFocus={true}
                                                                       placeholder="Cédula"
                                                                       name="cedula"/>
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col lg={6}>
                                                    <h4 className={"text-center my-2"}>Contacto</h4>
                                                    <Row>
                                                        <div className={"form-group col-md-6 col-sm-12"}>
                                                            <Label
                                                                className={"form-label fw-bold text-secondary fs-7"}>Nombre:</Label>
                                                            <UqaiField className="form-control" type="text"
                                                                       autoFocus={true}
                                                                       placeholder="Nombre"
                                                                       name="nmContacto"/>
                                                        </div>
                                                        <div className={"form-group col-md-6 col-sm-12"}>
                                                            <Label
                                                                className={"form-label fw-bold text-secondary fs-7"}>Apellido:</Label>
                                                            <UqaiField className="form-control" type="text"
                                                                       autoFocus={true}
                                                                       placeholder="Apellido"
                                                                       name="apContacto"/>
                                                        </div>
                                                    </Row>
                                                    <Row>
                                                        <div className={"form-group col-md-6 col-sm-12"}>
                                                            <Label
                                                                className={"form-label fw-bold text-secondary fs-7"}>Correo:</Label>
                                                            <UqaiField className="form-control" type="text"
                                                                       autoFocus={true}
                                                                       placeholder="Correo"
                                                                       name="correo"/>
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col xs={12}>
                                                    <Row>
                                                        <div className="form-group col-md-6 col-sm-12 my-2">
                                                            <Button className={"me-3"} type={"submit"} color="primary"
                                                                    onClick={submitForm}
                                                                    disabled={isSubmitting}>
                                                                Buscar
                                                            </Button>
                                                            <Button className="btn-success"
                                                                    onClick={handleResetForm}>
                                                                Nueva Consulta
                                                            </Button>
                                                        </div>
                                                        {listSP.length > 0 &&
                                                            <div
                                                                className={"form-group col-md-6 col-sm-12 my-2 d-flex justify-content-end"}>
                                                                <Button color="primary"
                                                                        className="mx-2"
                                                                        onClick={() => handleCreaUsrWeb(submitForm)}
                                                                >
                                                                    Activar consultas web
                                                                </Button>
                                                                <Button color="danger"
                                                                        onClick={() => handleInacUsrWeb(submitForm)}
                                                                >
                                                                    Desactivar consultas web
                                                                </Button>
                                                            </div>}
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Form>
                                    )}
                                </UqaiFormik>
                                <Col xs={12}>
                                    <ReactTable
                                        noDataText={"No se han encontrado datos"}
                                        previousText={"Anterior"}
                                        nextText={"Siguiente"}
                                        pageText={"Página"}
                                        rowsText={"filas"}
                                        ofText={"de"}
                                        columns={[
                                            {
                                                Header: "Cód.",
                                                minResizeWidth: 50,
                                                width: 70,
                                                sortable: false,
                                                accessor: "cdCliente"
                                            },
                                            {
                                                Header: "Cédula/RUC Contra.",
                                                minResizeWidth: 50,

                                                width: 140,
                                                sortable: false,
                                                accessor: "rucCed"
                                            },
                                            {
                                                Header: "Nombres Contratante",
                                                minResizeWidth: 50,
                                                width: 140,
                                                sortable: false,
                                                accessor: "nmCliente"
                                            },
                                            {
                                                Header: "Apellidos Contratante",
                                                minResizeWidth: 50,
                                                width: 140,
                                                sortable: false,
                                                accessor: "apCliente"
                                            },
                                            {
                                                Header: "Título Contra.",
                                                minResizeWidth: 50,
                                                width: 90,
                                                sortable: false,
                                                accessor: "titulo"
                                            },
                                            {
                                                Header: "Nombres Contacto",
                                                minResizeWidth: 50,
                                                width: 140,
                                                sortable: false,
                                                accessor: "nmEjecutivo"
                                            },
                                            {
                                                Header: "Apellidos Contacto",
                                                minResizeWidth: 50,
                                                width: 140,
                                                sortable: false,
                                                accessor: "apEjecutivo"
                                            },
                                            {
                                                Header: "Usr. Web",
                                                minResizeWidth: 10,
                                                sortable: false,
                                                accessor: "usuarioWebT",
                                                width: 100,
                                                Cell: row => {
                                                    return (row.original.usuarioWebT === 1) ?
                                                        <p><span className={"text-primary"}>SI</span></p>
                                                        :
                                                        <p><span className={"text-danger"}>NO</span></p>
                                                }
                                            },
                                            {
                                                Header: "Cargo Cont.",
                                                minResizeWidth: 50,
                                                width: 110,
                                                sortable: false,
                                                accessor: "cargo"
                                            },
                                            {
                                                Header: "Correo",
                                                minResizeWidth: 50,
                                                width: 200,
                                                sortable: false,
                                                accessor: "mail"
                                            },
                                            {
                                                id: "selected",
                                                Header: "Sel.",
                                                sortable: false,
                                                minResizeWidth: 10,
                                                width: 50,
                                                Cell: row => {
                                                    return <div>
                                                        <input className="form-check-input c-pointer" type="checkbox"
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
                                                        //backgroundColor: rowInfo.index === state.selected ? '#6f92a4' : 'white',
                                                        //color: rowInfo.index === state.selected ? 'white' : 'black',
                                                        height: 35,
                                                    }
                                                }
                                            } else {
                                                return {}
                                            }
                                        }}
                                        manual
                                        data={data.list}
                                        pages={data.pages}
                                        loading={data.loading}
                                        onFetchData={(state, instance) => {
                                            setData({...data, pageSize: state.pageSize})
                                            if (data.list.length !== 0) {
                                                setData({...data, loading: true})
                                                axios.post(routes.api + '/usuarios-generales-gestor', {
                                                    ...data, page: state.page, pageSize: state.pageSize
                                                })
                                                    .then((res) => {
                                                        setData({
                                                            ...data,
                                                            list: res.data.data,
                                                            pages: res.data.totalPages,
                                                            pageSize: state.pageSize,
                                                            loading: false
                                                        })
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
                            </div>
                        </CardBody>
                    </div>
                </div>
            </section>
        </Pages>
    );
};