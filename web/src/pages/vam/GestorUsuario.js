import React, {useEffect, useRef, useState} from "react";
import Alerts from "../../components/Alerts";
import {Button, CardBody, CardHeader, Col, Label, Row} from "reactstrap";
import UqaiFormik from "../../components/UqaiFormik";
import {UqaiField} from "../../components/UqaiField";
import {Form} from "formik";
import {UqaiCalendario} from "../../components/UqaiCalendario";
import moment from "moment";
import ReactTable from "react-table";

import axios from "axios";
import {routes} from "./UtilsVam";
import {find_aseguradoras, find_ram_grupos, find_ramos, find_ramos_ramgrp} from "../../api/CacheApi";
import {pos} from "../../util/General";
import Pages from "../../layouts/Pages";

export const GestorUsuario = (props) => {
    const [data, setData] = useState(getDefaultData());
    const [asegs, setAsegs] = useState([]);
    const [ramos, setRamos] = useState([]);
    const [nmCliGrupo, setNmCliGrupo] = useState([]);
    const [listSP, setListSP] = useState([]);

    const alert = useRef();
    const form = useRef();
    //const user = useSelector(state => state.user);

    useEffect(() => {
        fetchAsegs(setAsegs)
        fetchRamos(setRamos)
        fetchNmCliGrupo(setNmCliGrupo)
    }, [])

    const handleNuevaConsulta = () => {
        setListSP([])
        setData(getDefaultData())
    }

    const onSubmit = (newValues, actions) => {
        const current = alert.current
        setListSP([])
        if (!newValues.fcDesde || !newValues.fcHasta) {
            setData(getDefaultData())
        } else {
            setData({...newValues, loading: true})
        }
        axios.post(routes.api + "/usuarios-vam-gestor", {...newValues})
            .then(res => {
                handleQuery(res, data, setData)
                //current.show_info('Búsqueda Exitosa')
                actions.setSubmitting(false)
            }).catch(err => {
            actions.setSubmitting(false)
            current.handle_error(err)
        })
    };

    return (
        <Pages title={'Gestor Usuarios'}>
            <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                <div className="container-fluid">
                    <Alerts ref={alert}/>
                    <div className={"card shadow"}>
                        <CardHeader className="d-flex align-items-center border-bottom border-primary">
                            <h5 className="my-0 fw-bold">Gestor Usuarios</h5>
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
                                                    <h4 className="text-center">Contratante</h4>
                                                    <Row>
                                                        <div className={"col-md-6 col-sm-12"}>
                                                            <Label
                                                                className={"form-label fw-bold text-secondary fs-7"}>Nombre:</Label>
                                                            <UqaiField className="form-control" type="text"
                                                                       autoFocus={true}
                                                                       placeholder="Nombre"
                                                                       name="nmContratante"/>
                                                        </div>
                                                        <div className={"col-md-6 col-sm-12"}>
                                                            <Label
                                                                className={"form-label fw-bold text-secondary fs-7"}>Apellido:</Label>
                                                            <UqaiField className="form-control" type="text"
                                                                       autoFocus={true}
                                                                       placeholder="Apellido"
                                                                       name="apContratante"/>
                                                            </div>
                                                        </Row>
                                                        <Row>
                                                            <div className={"col-md-6 col-sm-12"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Póliza:</Label>
                                                                <UqaiField className="form-control" type="text"
                                                                           autoFocus={true}
                                                                           placeholder="Póliza"
                                                                           name="poliza"/>
                                                            </div>
                                                            <div className={"col-md-6 col-sm-12"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Ramo:</Label>
                                                                <UqaiField component="select"
                                                                           className="form-select w-100 inputTable"
                                                                           name="ramo">
                                                                    <option value="0">--TODOS--</option>
                                                                    {ramos.map(ramo => (
                                                                        <option
                                                                            key={ramo.cdRamo}
                                                                            value={ramo.cdRamo}>{ramo.nmRamo}</option>
                                                                    ))}
                                                                </UqaiField>
                                                            </div>

                                                        </Row>
                                                        <Row>
                                                            <div className={"col-md-6 col-sm-12"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Grupo
                                                                    contratante:</Label>
                                                                <UqaiField component="select"
                                                                           className="form-select w-100 inputTable"
                                                                           name="nmCliGrupo">
                                                                    <option value="0">--TODOS--</option>
                                                                    {nmCliGrupo.map(n => (
                                                                        <option
                                                                            key={n.cdCliGrupo}
                                                                            value={n.cdCliGrupo || ""}>{n.nmCliGrupo}</option>
                                                                    ))}
                                                                </UqaiField>
                                                            </div>
                                                            <div className={"col-md-6 col-sm-12"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Aseguradora:</Label>
                                                                <UqaiField component="select"
                                                                           className="form-select w-100 inputTable"
                                                                           name="aseg">
                                                                    <option value="0">--TODOS--</option>
                                                                    {asegs.map(aseg => (
                                                                        <option
                                                                            key={aseg.cdAseguradora}
                                                                            value={aseg.cdAseguradora}>{aseg.nmAlias}</option>
                                                                    ))}
                                                                </UqaiField>
                                                            </div>

                                                        </Row>
                                                        <Row>
                                                            <div className={"col-md-3 col-sm-6"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Desde:</Label>
                                                                <UqaiField name={"fcDesde"} placeholder={"Desde"}
                                                                           component={UqaiCalendario}/>

                                                            </div>
                                                            <div className={"col-md-3 col-sm-6"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Hasta:</Label>
                                                                <UqaiField name={"fcHasta"} placeholder={"Hasta"}
                                                                           component={UqaiCalendario}/>

                                                        </div>

                                                        </Row>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <h4 className={"text-center my-2"}>Asegurado</h4>
                                                        <Row>
                                                            <div className={"col-md-6 col-sm-12"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Nombre:</Label>
                                                                <UqaiField className="form-control" type="text"
                                                                           autoFocus={true}
                                                                           placeholder="Nombre"
                                                                           name="nmAsegurado"/>
                                                            </div>
                                                            <div className={"col-md-6 col-sm-12"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Apellido:</Label>
                                                                <UqaiField className="form-control" type="text"
                                                                           autoFocus={true}
                                                                           placeholder="Apellido"
                                                                           name="apAsegurado"/>
                                                            </div>
                                                        </Row>
                                                        <Row>
                                                            <div className={"col-md-6 col-sm-12"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Cédula/RUC:</Label>
                                                                <UqaiField className="form-control" type="text"
                                                                           autoFocus={true}
                                                                           placeholder="Cédula/RUC"
                                                                           name="cedula"/>
                                                            </div>
                                                            <div className={"col-md-6 col-sm-12"}>
                                                                <Label
                                                                    className={"form-label fw-bold text-secondary fs-7"}>Correo:</Label>
                                                                <UqaiField className="form-control" type="text"
                                                                           autoFocus={true}
                                                                           placeholder="Correo"
                                                                           name="correo"/>
                                                            </div>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <div className="col-md-6 col-sm-12 my-2">
                                                        <Button type={"submit"} color="primary"
                                                                className="me-3"
                                                                onClick={submitForm}
                                                                disabled={isSubmitting}>
                                                            Buscar
                                                        </Button>
                                                        <Button className={"btn-success"}
                                                                onClick={handleNuevaConsulta}>
                                                            Nueva Consulta
                                                        </Button>
                                                    </div>
                                                    {listSP.length > 0 &&
                                                        <div
                                                            className={"form-group col-md-6 col-sm-12 my-2 d-flex justify-content-end"}>
                                                            <Button color="success"
                                                                    className="mx-2"
                                                                    onClick={() => handleCreaUsrWeb(listSP, alert, submitForm)}>
                                                                Activar consultas web
                                                            </Button>
                                                            <Button color="danger"
                                                                    onClick={() => handleDesUrsWeb(listSP, alert, submitForm)}
                                                            >
                                                                Desactivar consultas web
                                                            </Button>
                                                    </div>}
                                            </Row>
                                        </Form>
                                    )}
                                </UqaiFormik>
                                <Row>
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
                                                    Header: "Contratante",
                                                    columns: [
                                                        {
                                                            Header: "Nombres",
                                                            minResizeWidth: 50,
                                                            width: 140,
                                                            sortable: false,
                                                            accessor: "nmContratante"
                                                        },
                                                        {
                                                            Header: "Apellidos",
                                                            minResizeWidth: 50,
                                                            width: 140,
                                                            sortable: false,
                                                            accessor: "apContratante"
                                                        }
                                                    ]
                                                },
                                                {
                                                    Header: "Asegurado VAM",
                                                    columns: [
                                                        {
                                                            Header: "Título",
                                                            minResizeWidth: 50,
                                                            width: 60,
                                                            sortable: false,
                                                            accessor: "titulo"
                                                        },
                                                        {
                                                            Header: "Nm Asegurado",
                                                            minResizeWidth: 50,
                                                            width: 140,
                                                            sortable: false,
                                                            accessor: "nmAsegudado"
                                                        },
                                                        {
                                                            Header: "Ap Asegurado",
                                                            minResizeWidth: 50,
                                                            width: 140,
                                                            sortable: false,
                                                            accessor: "apAsegudado"
                                                        },
                                                        {
                                                            Header: "Cédula",
                                                            minResizeWidth: 50,
                                                            width: 100,
                                                            sortable: false,
                                                            accessor: "cedula"
                                                        },
                                                        {
                                                            Header: "Correo Asegurado",
                                                            minResizeWidth: 50,
                                                            width: 200,
                                                            sortable: false,
                                                            accessor: "correo"
                                                        },
                                                    ]
                                                },
                                                {
                                                    Header: "Aseg",
                                                    minResizeWidth: 10,
                                                    accessor: "aseg",
                                                    sortable: false,
                                                    width: 100,
                                                },
                                                {
                                                    Header: "Ramo",
                                                    minResizeWidth: 10,
                                                    accessor: "ramo",
                                                    sortable: false,
                                                    width: 100,
                                                },
                                                {
                                                    Header: "Póliza",
                                                    minResizeWidth: 10,
                                                    accessor: "poliza",
                                                    sortable: false,
                                                    width: 80,
                                                },
                                                {
                                                    id: "selected",
                                                    Header: "Sel.",
                                                    minResizeWidth: 10,
                                                    sortable: false,
                                                    width: 50,
                                                    Cell: row => {
                                                        return <div>
                                                            <input className="form-check-input c-pointer"
                                                                   type="checkbox"
                                                                   defaultChecked={listSP.filter(i => i.index === row.original.rownum).length > 0}
                                                            />
                                                        </div>
                                                    }
                                                },
                                                {
                                                    Header: "Usr. Web",
                                                    minResizeWidth: 10,
                                                    sortable: false,
                                                    accessor: "activaWeb",
                                                    width: 70,
                                                    Cell: row => {
                                                        return (row.original.activaWeb === 1) ?
                                                            <p><span className={"text-primary"}>SI</span></p>
                                                            :
                                                            <p><span className={"text-danger"}>NO</span></p>
                                                    }
                                                },
                                                {
                                                    id: "fcDesde",
                                                    Header: "Fc Desde",
                                                    accessor: d => {
                                                        return moment(d.fcDesde).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                    },
                                                    minResizeWidth: 10,
                                                    width: 100,
                                                },
                                                {
                                                    id: "fcHasta",
                                                    Header: "Fc Hasta",
                                                    sortable: false,
                                                    accessor: d => {
                                                        return moment(d.fcHasta).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                    },
                                                    minResizeWidth: 10,
                                                    width: 100
                                                },

                                            ]}
                                            getTdProps={(state, rowInfo, column) => {
                                                if (rowInfo && rowInfo.row) {
                                                    return {
                                                        onClick: (e, handleOriginal) => {
                                                            if (column.id === "selected") {
                                                                handleListSP(rowInfo, listSP, setListSP)
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
                                            manual
                                            data={data.list}
                                            pages={data.pages}
                                            loading={data.loading}
                                            onFetchData={(state, instance) => {
                                                if (data.list.length !== 0) {
                                                    setData({...data, loading: true});
                                                    axios.post(routes.api + '/usuarios-vam-gestor', {
                                                        ...data,
                                                        page: state.page,
                                                        pageSize: state.pageSize,
                                                        //sorted: state.sorted,
                                                    }).then((res) => {
                                                        handleQuery(res, data, setData)
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
                        </CardBody>
                    </div>
                </div>
            </section>
        </Pages>
    );
}


export const fetchAsegs = (setAsegs) => {
    find_aseguradoras().then(resp => {
        setAsegs(resp)
    })
}

export const fetchRamos = (setRamos) => {
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
                    if (isVam(item)) {
                        ramosTmp.push(item);
                    }
                });
                setRamos(ramosTmp.sort((a, b) => a.nmRamo.localeCompare(b.nmRamo)))
            })
        });
    });
}

export const fetchNmCliGrupo = (setNmCliGrupo) => {
    axios.get(routes.api + '/usuarios-vam-cli-grupo')
        .then(res => {
            setNmCliGrupo(res.data)
        }).catch(err => err)
}

const isVam = (r) => {
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

export const getDefaultData = () => ({
    list: [],
    page: 0,
    pages: -1,
    pageSize: 10,
    loading: false,
    nmContratante: "",
    apContratante: "",
    poliza: "",
    ramo: 0,
    aseg: 0,
    nmCliGrupo: 0,
    fcDesde: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
    fcHasta: new Date(),
    nmAsegurado: "",
    apAsegurado: "",
    cedula: "",
    correo: "",
});

export const handleQuery = (query, data, setData) => {
    let q = []
    query.data.content.forEach(i => {
            q.push({
                rownum: i[0],
                cedula: i[1],
                nmAsegudado: i[2],
                inclusion: i[3],
                exclusion: i[4],
                apAsegudado: i[5],
                aseg: i[6],
                ramo: i[7],
                poliza: i[8],
                fcDesde: i[9],
                fcHasta: i[10],
                fcNacimiento: i[11],
                genero: i[12],
                estadoCivil: i[13],
                profesion: i[14],
                titulo: i[15],
                nmConyuge: i[16],
                apConyuge: i[17],
                celular: i[18],
                correo: i[19],
                valido: i[20],
                fcValido: i[21],
                acepta: i[22],
                fcAcepta: i[23],
                validadoWs: i[24],
                fcValidadoWs: i[25],
                usroCdgo: i[26],
                fcCreacion: i[27],
                usuarioWeb: i[28],
                activaWeb: i[29],
                activado: i[30],
                notas: i[31],
                nmContratante: i[32],
                apContratante: i[33],
                grupoCont: i[34],
                selecciona: i[35]
            })
        }
    )
    setData({...data, list: q, pages: query.data.totalPages, loading: false})
}

export const handleListSP = (row, listSP, setListSP) => {

    if (listSP.filter(i => i.index === row.original.rownum).length > 0) {
        setListSP(listSP.filter(i => i.index !== row.original.rownum))
    } else {
        setListSP([...listSP, {
            index: row.original.rownum,
            cedula: row.original.cedula,
            correo: row.original.correo,
        }])
    }
}

// llamado a los SP activa, desactiva web
export const handleCreaUsrWeb = (listSP, alert, submitForm) => {
    const current = alert.current
    axios.post(routes.api + "/usuarios-vam-crear", listSP)
        .then(res => {
            current.show_info("Activados " + res.data)
            submitForm && submitForm();
        }).catch(err => current.handle_error(err))
}

export const handleDesUrsWeb = (listSP, alert, submitForm) => {
    const current = alert.current
    axios.post(routes.api + "/usuarios-vam-desactivar", listSP)
        .then(res => {
            current.show_info("Desactivados " + res.data)
            submitForm && submitForm();
        }).catch(err => current.handle_error(err))
}