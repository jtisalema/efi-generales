import React, {useEffect, useRef, useState} from "react";
import Alerts from "./Alerts";
import {Card, CardBody, CardHeader, Modal, ModalBody,} from "reactstrap";
import UqaiFormik from "./UqaiFormik";
import {UqaiField} from "./UqaiField";
import {useSelector} from "react-redux";
import {
    calcularDias,
    defaultFilter,
    ESTADOS_CLASS,
    SINIESTRO_EXPIRED_DAYS,
    TIPOS,
    v_filtro,
    validateTimeBetweenDates
} from "../pages/vam/siniestros-portal/utils";
import ReactTable from "react-table";
import moment from "moment/moment";
import Select from 'react-select';
import axios from "axios";
import {metricasGoogle, pos} from "../util/General";
import {routes as routesVam} from "../pages/vam/UtilsVam";
import {UqaiCalendario} from "./UqaiCalendario";
import {find_ram_grupos, find_ramos, find_ramos_ramgrp} from "../api/CacheApi";
import {ComboContratante} from "../pages/vam/siniestros-portal/parts/ComboContratante";
import {ComboAsegurados} from "../pages/vam/siniestros-portal/parts/ComboAsegurados";
import {Link, useHistory} from "react-router-dom";
import {CustomNumberFormat} from "./CustomNumberFormat";
import {ESTADOS_PORTAL_LISTA} from "../pages/vam/siniestros-portal/estados_edicion";
import Pages from "../layouts/Pages";
import {UqaiModalHeader} from "./UqaiModal";
import {Estados} from "../pages/vam/siniestros-portal/parts/Estados";
import {AccionButton} from "../pages/vam/siniestros-portal/parts/documentos-adjuntos/AccionesAdjuntos";
import {
    LoadingContextProvider
} from "../pages/vam/siniestros-portal/parts/documentos-adjuntos/context/LoadingContextProvider";
import {NoDataResult} from "./NoDataResult";
import PropTypes from "prop-types";
import {MODULES, useCurrentModule} from "../hooks/useModules";

export const FiltrosSiniestros = ({moduleEndpoints, userIdentificationModule, ...props}) => {

    const user = useSelector(state => state.user);
    const history = useHistory();
    const alert = useRef(null);
    const form = useRef();

    const isAdmin = user.isAdmin;
    const isEjecutivo = user.isEjecutivo;

    const [data, setData] = useState({data: [], pages: 0, page: 0, loading: false, pageSize: 10, sorted: []});
    const [query, setQuery] = useState(defaultFilter(user, isEjecutivo, isAdmin));
    const [isReset, setIsReset] = useState(false);
    const [ramos, setRamos] = useState([]);
    const [ejecutivos, setEjecutivos] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [isFirst, setIsFirst] = useState(true);

    const isGen = useCurrentModule() === MODULES.GEN;
    const isCliente = user.isUser;
    const defaultOptions = [{value: 0, label: 'TODOS'}];

    useEffect(() => {
        if ((!isGen && user?.cedula) || (isGen && user?.cdCliente) || !isCliente) {
            const queryStart = defaultFilter(user, isEjecutivo, isAdmin);
            getRamos();
            getEjecutivos();

            if (userIdentificationModule) {
                const userWithPrivilegesIdentification = user.hasPrivileges ? '' : user.cedula;
                const paramQuery = isGen ? {cdContratante: user.cdCliente} : {cedula: userWithPrivilegesIdentification}
                setQuery({...queryStart, ...paramQuery})
            }

            setShowTable(true);
        }
    }, [user?.cedula, user?.cdCliente, user.hasPrivileges, isGen, isCliente])

    const onSubmit = (newValues, actions) => {
        if (validateTimeBetweenDates(newValues.fcCreacionDesde, newValues.fcCreacionHasta)) {
            alert.current.show_error('El intervalo de fecha de creación no puede ser mayor a 1 año');
            actions?.setSubmitting(false)
            return;
        }
        if (validateTimeBetweenDates(newValues.fcIncurrenciaDesde, newValues.fcIncurrenciaHasta)) {
            alert.current.show_error('El intervalo de fecha de incurrencia no puede ser mayor a 1 año');
            actions?.setSubmitting(false)
            return;
        }
        setQuery({...newValues, page: 0});
        fetchData({...newValues, page: 0});
        actions?.setSubmitting(false)
        setIsFirst(false);
    }

    const fetchData = (q = {}) => {
        let query2 = Object.assign({}, q);
        query2.sorted = q.sorted;
        if (q.page >= 0) {
            query2.page = q.page;
        }

        if (q.pageSize >= 0) {
            query2.pageSize = q.pageSize;
        }

        if (query2.page !== query.page || query2.page === 0) {
            const url = moduleEndpoints.listSiniestrosReported;
            axios.post(url, query2).then(resp => {
                const data = resp.data;
                setData({
                    data: addStatus(data.content),
                    pages: data?.totalPages,
                    loading: false,
                    pageSize: data.size,
                    sorted: data.sort,
                    page: data.number
                })
                metricasGoogle(user, "siniestro_list", "siniestro", "list");
            }).catch(error => {
                alert.current.show_error(error);
            })
        }
    }

    const getRamos = () => {
        find_ramos().then(resp => {
            let ramos = resp;
            find_ram_grupos().then(resp => {
                let areas = resp;
                find_ramos_ramgrp().then(resp => {
                    let ramosTmp = [];
                    resp.forEach(r => {
                        let item = Object.assign({}, r);
                        item.nmRamo = ramos.find(ramo => ramo.cdRamo === item.cdRamo).nmRamo;
                        item.nmArea = areas.find(area => area.cdRamGrupo === item.cdRamGrupo).nmRamGrupo;
                        item.nm = item.nmRamo;
                        if (isVam(item)) {
                            ramosTmp.push(item);
                        }
                    });
                    let ram = ramosTmp.toSorted((a, b) => a.nmRamo.localeCompare(b.nmRamo)).map(x => ({
                        value: x.cdRamo,
                        label: x.nmRamo,
                        nmArea: x.nmArea
                    }));
                    ram.unshift({...defaultOptions[0], nmArea: 'ALL'});
                    setRamos(ram);
                    if (isCliente) {
                        getRamosNoAdmin(ram, userIdentificationModule);
                    }
                })
            });
        }).catch(alert.current.show_error);
    }

    const isVam = (r) => {
        let vam = false;
        let ls_nm_grp_ramo = r.nmArea;

        if (pos(ls_nm_grp_ramo, 'MEDICA') > 0) {
            vam = true;
        } else vam = pos(ls_nm_grp_ramo, 'VIDA') > 0;
        return vam
    };

    const handleResetForm = (resetForm) => {
        setIsReset(true);
        setData({data: [], pages: 0, page: 0, loading: false, pageSize: 10});
        setQuery(defaultFilter(user, isEjecutivo, isAdmin));
        resetForm();
    }

    const getEjecutivos = () => {
        axios.get(routesVam.api + '/siniestros-portal/ejecutivos').then(resp => {
            let list = resp.data;
            list.forEach(p => {
                p.label = p.ejecutivo;
                p.value = p.cdEjecutivo;
            });
            list.sort((a, b) => a.ejecutivo.localeCompare(b.ejecutivo));
            list.unshift(defaultOptions[0]);
            setEjecutivos(list);
        }).catch(error => {
            alert.current.show_error(error);
        });
    }

    const getRamosNoAdmin = async (ramos, identificadorCliente) => {
        const url = moduleEndpoints.getRamosNoAdmin;
        let list = await axios.get(url, {
            params: {
                cedula: identificadorCliente,
                caducada: false,
                cdCliente: identificadorCliente
            }
        });
        let ramosTmp = [];
        (list.data || []).forEach(x => {
                let ramo = findList(ramos, x.CD_RAMO);
                if (ramo) {
                    ramosTmp.push(ramo)
                }
            }
        );
        ramosTmp.unshift(defaultOptions[0]);
        setRamos(ramosTmp);
    }

    const findList = (list, id) => {
        let item = (list || []).find(x => x.value === id);
        return item ? item : null;
    }

    const addStatus = (lista) => {
        lista.forEach((elemento) => {
            const isExpired = calcularDias(elemento?.fcPrimeraFactura) > SINIESTRO_EXPIRED_DAYS;
            elemento.class = isExpired ? 'tr-danger' : ESTADOS_CLASS.find(x => x.value === elemento.estadoPortal)?.label;
        });
        return lista;
    }

    function noDataComponent() {
        return <NoDataResult first={isFirst}/>
    }

    return (<Pages title={"Siniestros registrados"}>
            <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                <div className="container-fluid">
                    <Alerts ref={alert}/>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12 py-2">
                            <Card className="shadow">
                                <CardHeader className="d-flex align-items-center border-bottom border-primary">
                                    <h5 className="my-0 fw-bold">
                                        <i className="icon-uqai align-middle uqai-filtros text-primary me-2"></i>
                                        Filtros
                                    </h5>
                                </CardHeader>
                                <CardBody>
                                    <UqaiFormik initialValues={query} onSubmit={onSubmit} enableReinitialize={true}
                                                validateOnChange={false} validationSchema={v_filtro} ref={form}>
                                        {({resetForm, submitForm, setFieldValue, values, isSubmitting}) => (
                                            <div className="row gy-3">
                                                {user.hasPrivileges &&
                                                    <div className="col-12">
                                                        <label
                                                            className="form-label fw-bold text-secondary fs-7">Contratante:</label>
                                                        <ComboContratante setFieldValue={setFieldValue}
                                                                          name={'cdContratante'} reset={isReset}
                                                                          setReset={setIsReset}
                                                                          alert={alert} values={values}
                                                                          defaultOptions={defaultOptions}/>
                                                    </div>
                                                }
                                                {!isCliente &&
                                                    <div className="col-12">
                                                        <label
                                                            className="form-label fw-bold text-secondary fs-7">Asegurado:</label>
                                                        <ComboAsegurados setFieldValue={setFieldValue}
                                                                         name={'cedula'}
                                                                         alert={alert} values={values}
                                                                         defaultOptions={defaultOptions}
                                                                         cedula={user.cedula}/>
                                                    </div>}
                                                <div className="col-12">
                                                    <label
                                                        className="form-label fw-bold text-secondary fs-7">Ramo:</label>
                                                    <UqaiField type="text"
                                                               component="select"
                                                               className="form-select"
                                                               name="cdRamo">
                                                        {(ramos || []).map(opt => (
                                                            <option key={opt.value}
                                                                    value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </UqaiField>
                                                </div>
                                                <div className="col-12">
                                                    <label
                                                        className="form-label fw-bold text-secondary fs-7">Estado:</label>
                                                    <UqaiField type="text" name="cdEstado" component="select"
                                                               className="form-select">
                                                        <option value={0} key={"todos"}>{"TODOS"}</option>
                                                        {ESTADOS_PORTAL_LISTA.map(est => (
                                                            <option value={est.value}
                                                                    key={est.value}>{est.label}</option>
                                                        ))}
                                                    </UqaiField>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold text-secondary fs-7">Fc.Creación
                                                        Desde: </label>
                                                    <UqaiField name="fcCreacionDesde" placeholder="Ingrese Fecha"
                                                               component={UqaiCalendario}/>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold text-secondary fs-7">Fc.Creación
                                                        Hasta: </label>
                                                    <UqaiField name="fcCreacionHasta" placeholder="Ingrese Fecha"
                                                               component={UqaiCalendario}/>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold text-secondary fs-7">Fc.Incurrencia
                                                        Desde: </label>
                                                    <UqaiField name="fcIncurrenciaDesde" placeholder="Ingrese Fecha"
                                                               component={UqaiCalendario}/>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold text-secondary fs-7">Fc.Incurrencia
                                                        Hasta: </label>
                                                    <UqaiField name="fcIncurrenciaHasta" placeholder="Ingrese Fecha"
                                                               component={UqaiCalendario}/>
                                                </div>
                                                <div className="col-12">
                                                    <label
                                                        className="form-label fw-bold text-secondary fs-7">Póliza:</label>
                                                    <UqaiField type="text" name={'poliza'}
                                                               className={"form-control"}
                                                               placeholder={"Póliza"}/>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-bold text-secondary fs-7">Tipo
                                                        de
                                                        Siniestro:</label>
                                                    <UqaiField type="text" name="cdReclamo"
                                                               component="select"
                                                               className="form-select">
                                                        <option value={0} key={"todos"}>{"TODOS"}</option>
                                                        {TIPOS.map(tp => (
                                                            <option value={tp.value}
                                                                    key={tp.value}>{tp.label}</option>
                                                        ))}
                                                    </UqaiField>
                                                </div>

                                                {user.hasPrivileges &&
                                                    <div className="col-12">
                                                        <label
                                                            className="form-label fw-bold text-secondary fs-7">Ejecutivo:</label>
                                                        <UqaiField type="text"
                                                                   name={'cdEjecutivo'}
                                                                   required
                                                                   component={Select}
                                                                   options={ejecutivos}
                                                                   value={ejecutivos.find(ejecutivo => ejecutivo.value === values.cdEjecutivo)}
                                                                   defaultValue={defaultOptions[0]}
                                                                   placeholder="--Seleccione un ejecutivo--"
                                                                   onChange={(e) => {
                                                                       setFieldValue('cdEjecutivo', e.value);
                                                                   }}
                                                                   className="react-select"
                                                                   classNamePrefix="react-select"/>
                                                    </div>}
                                                <div>
                                                    <div className="d-flex align-items-center justify-content-end"
                                                         align="right">
                                                        <button type="button" className="btn btn-success me-2"
                                                                onClick={() => {
                                                                    setFieldValue('cdRamo');
                                                                    handleResetForm(resetForm)
                                                                }}>
                                                            Limpiar filtros
                                                        </button>
                                                        <button type="submit" className="btn btn-primary"
                                                                onClick={(event) => {
                                                                    submitForm(event);
                                                                    metricasGoogle(user, "siniestro_search", "siniestro", "list");
                                                                }}
                                                                disabled={isSubmitting}>
                                                            Buscar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </UqaiFormik>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-lg-9 col-md-6 col-sm-12 py-2">
                            <Card className="shadow">
                                <CardHeader
                                    className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center border-bottom border-primary justify-content-between">
                                    <h5 className="my-0 fw-bold">
                                        <i className="icon-uqai align-middle uqai-lista-siniestros-reportados text-primary me-2"></i>
                                        Lista de siniestros reportados
                                    </h5>
                                    {isCliente &&
                                        <Link
                                            className="btn btn-info mt-2 mt-sm-0" onClick={() => {
                                            history.push(props.newSiniestro);
                                            metricasGoogle(user, "siniestro_new", "siniestro", "list");
                                        }}>
                                            <i className={"icon-uqai uqai-agregar me-1"}/>
                                            Nuevo Siniestro
                                        </Link>}
                                </CardHeader>
                                <CardBody className="pt-0">
                                    <div className="row">
                                        <div className="col">
                                            <LeyendaColor color={"#ffe2e2"}
                                                          txt={`Este registro se encuentra caducado ya que superó los ${SINIESTRO_EXPIRED_DAYS} días calendario`}/>
                                        </div>
                                        <div className="col">
                                            {showTable &&
                                                <ReactTable
                                                    noDataText={noDataComponent}
                                                    loadingText={"Cargando..."}
                                                    rowsText={"filas"}
                                                    ofText={"de"}
                                                    previousText={"Anterior"}
                                                    nextText={"Siguiente"}
                                                    pageText={"Página"}
                                                    columns={[
                                                        {
                                                            Header: "Num.Siniestro",
                                                            width: 120,
                                                            filterable: false,
                                                            accessor: "numSiniestro",
                                                            id: "NUM_SINIESTRO",
                                                        },
                                                        {
                                                            Header: "Tipo Reclamo",
                                                            width: 120,
                                                            filterable: false,
                                                            accessor: "tpReclamo",
                                                            id: "TP_RECLAMO",
                                                            Cell: row => {
                                                                return <div>{TIPOS.find(x => x.value === row.original.tpReclamo)?.label}</div>;
                                                            },
                                                        },
                                                        {
                                                            Header: "Observación",
                                                            minResizeWidth: 10,
                                                            filterable: false,
                                                            sortable: false,
                                                            accessor: "obsSiniestro",
                                                            id: "OBS_SINIESTRO",
                                                            Cell: row => <ListObservaciones
                                                                txt={row.original?.obsSiniestro}/>
                                                        },
                                                        {
                                                            Header: "Estado",
                                                            width: 200,
                                                            filterable: false,
                                                            accessor: "estadoPortal",
                                                            id: "ESTADO_PORTAL",
                                                            Cell: row => {
                                                                return <Estados estado={row.original.estadoPortal}/>;
                                                            },
                                                        },
                                                        {
                                                            Header: "Titular",
                                                            minResizeWidth: 10,
                                                            filterable: false,
                                                            accessor: "asegurado",
                                                            id: "asegurado",
                                                            show: (isGen || isAdmin || isEjecutivo),
                                                            width: 250,
                                                        },
                                                        {
                                                            Header: "Paciente",
                                                            minResizeWidth: 10,
                                                            filterable: false,
                                                            accessor: "paciente",
                                                            id: "paciente",
                                                            width: 250
                                                        },
                                                        {
                                                            Header: "Contratante",
                                                            minResizeWidth: 10,
                                                            filterable: false,
                                                            accessor: "contratante",
                                                            id: "contratante",
                                                            show: (isAdmin || isEjecutivo),
                                                            width: 120,
                                                        },
                                                        {
                                                            Header: "Incapacidad",
                                                            minResizeWidth: 10,
                                                            filterable: false,
                                                            accessor: "nmIncapacidad",
                                                            id: "nm_incapacidad",
                                                            width: 160
                                                        },
                                                        {
                                                            Header: "Valor Reclamo Total",
                                                            minResizeWidth: 10,
                                                            filterable: false,
                                                            sortable: false,
                                                            accessor: "valorReclamoPortal",
                                                            id: "VAL_RECLAMO_PORTAL",
                                                            width: 160,
                                                            Cell: row => {
                                                                return (
                                                                    <CustomNumberFormat
                                                                        value={row?.original?.valorReclamoPortal ? row?.original?.valorReclamoPortal : 0}/>)
                                                            }
                                                        },
                                                        {
                                                            Header: "Fc.Primera Factura",
                                                            id: "FC_PRIMERA_FACTURA",
                                                            accesor: "FC_PRIMERA_FACTURA",
                                                            filterable: false,
                                                            Cell: fechaPrimeraFactura,
                                                            minResizeWidth: 10,
                                                            width: 160
                                                        },
                                                        {
                                                            Header: "Fc.Creación",
                                                            id: "FC_CREACION",
                                                            filterable: false,
                                                            accessor: d => {
                                                                return !d.fcCreacion ? '' : moment(d.fcCreacion).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                            },
                                                            minResizeWidth: 10,
                                                            width: 115
                                                        },
                                                        {
                                                            Header: "Días transcurridos",
                                                            id: "FC_PRIMERA_FACTURA",
                                                            accesor: "FC_PRIMERA_FACTURA",
                                                            filterable: false,
                                                            Cell: row => {
                                                                return <div>{calcularDias(row.original.fcPrimeraFactura)}</div>
                                                            },
                                                            minResizeWidth: 10,
                                                            width: 150
                                                        },
                                                        {
                                                            Header: "Póliza",
                                                            minResizeWidth: 10,
                                                            filterable: false,
                                                            accessor: "poliza",
                                                            id: "poliza"
                                                        },
                                                        {
                                                            Header: "Ramo",
                                                            minResizeWidth: 10,
                                                            filterable: false,
                                                            accessor: "nmRamo",
                                                            id: "NM_RAMO",
                                                        },
                                                        {
                                                            Header: "Ejecutivo",
                                                            minResizeWidth: 10,
                                                            filterable: false,
                                                            accessor: "cdEjecutivo",
                                                            id: "CD_EJECUTIVO",
                                                            show: (isAdmin || isEjecutivo),
                                                            Cell: row => {
                                                                return <div>{findList(ejecutivos, row.original.cdEjecutivo)?.label}</div>
                                                            },
                                                        }
                                                    ]}
                                                    manual
                                                    data={data.data}
                                                    pages={data.pages}
                                                    loading={data.loading}
                                                    defaultPageSize={5}
                                                    filterable={true}
                                                    showPaginationTop
                                                    showPaginationBottom={false}
                                                    onFetchData={(state) => fetchData({
                                                        ...query, page: state.page,
                                                        pageSize: state.pageSize,
                                                        sorted: state.sorted,
                                                        filtered: state.filtered,
                                                    })}
                                                    getTrProps={(_, rowInfo) => {
                                                        if (rowInfo) {
                                                            const isExpired = calcularDias(rowInfo?.original?.fcPrimeraFactura) > SINIESTRO_EXPIRED_DAYS;
                                                            return {
                                                                className: `${rowInfo?.row?._original?.class} 
                                                            ${isExpired ? "text-custom" : ""}`
                                                            };
                                                        }
                                                        return {};
                                                    }}
                                                    getTdProps={(state, rowInfo, column) => {
                                                        if (rowInfo && rowInfo.row) {
                                                            return {
                                                                onClick: (e, handleOriginal) => {
                                                                    if (column.Header !== "Observación") {
                                                                        history.push(`${props.searchSiniestro}/${rowInfo.original.cdCompania}/${rowInfo.original.cdReclamo}/${rowInfo.original.cdIncSiniestro}`);
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
                                                    page={data.page}
                                                    pageSize={data.pageSize}
                                                    onPageChange={page => setData({...data, page})}
                                                    onPageSizeChange={(pageSize, page) => {
                                                        setData({...data, page, pageSize})
                                                    }}
                                                    className="-highlight fs-7 mi-div">
                                                </ReactTable>
                                            }
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </Pages>
    )
}

FiltrosSiniestros.propTypes = {
    moduleEndpoints: PropTypes.object.isRequired,
    userIdentificationModule: PropTypes.number
}

export const LeyendaColor = ({color, txt}) => {
    return (
        <div style={{display: "flex", alignItems: "center", margin: "25px"}}>
            <div style={{
                width: "25px",
                height: "25px",
                background: color,
                marginRight: "10px",
                borderRadius: "4px"
            }}></div>
            <span className={"form-label text-bold text-secondary fs-6 mt-2"}>{txt}</span>
        </div>
    )
}

export const ListObservaciones = ({txt, icon, ...props}) => {
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (txt) {
            setList(JSON.parse(txt));
        }
    }, []);

    const defineWidth = (length) => {
        if (length < 50) return "100%";
        if (length < 100) return "200px";
        if (length < 200) return "400px";
        return "500px";
    }

    return (

        <LoadingContextProvider>
            <div className={props?.className ?? "text-center w-100"}>
                <AccionButton onClick={() => setOpen(true)} title={"Ver historial de estados"}>
                    <i className={`icon-uqai uqai-${icon ?? "ver"}`}/>
                </AccionButton>
                {open &&
                    <Modal isOpen={open} toggle={() => setOpen(false)} size="xl" centered>
                        <UqaiModalHeader toggle={() => setOpen(false)} title="Historial de Estados"/>
                        <ModalBody>
                            <div className="table-responsive">
                                <br/>
                                <table className="table table-borderless table-hover">
                                    <thead>
                                    <tr className="text-secondary">
                                        <th className="bg-white">Fecha</th>
                                        <th className="bg-white">Estado</th>
                                        <th className="bg-white">Observación</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {(list || []).map(x => (
                                        <tr key={x.estado}>
                                            <td className="w-25"
                                                style={{minWidth: "100px"}}>{moment(x.fecha).locale('moment/locale/es').local().format("DD-MM-YYYY HH:mm:ss")}</td>
                                            <td className="w-25"
                                                style={{minWidth: "100px"}}>{ESTADOS_PORTAL_LISTA.find(est => est.value === x.estado)?.label}</td>
                                            <td className="w-100"><textarea disabled style={{
                                                width: "100%",
                                                minWidth: defineWidth(x.comentario?.length)
                                            }}>{x.comentario}</textarea>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </ModalBody>
                    </Modal>
                }
            </div>
        </LoadingContextProvider>
    )
}

const fechaPrimeraFactura = (row) => {
    const fcPrimeraFactura = row?.original?.fcPrimeraFactura;
    const caducado = row?.original?.caducado;
    return (<>
            <span title={caducado ? "Siniestro caducado" : ""} className={caducado ? "siniestro-caducado" : ""}>
                    {caducado && <><i className="fas fa-circle text-danger"/>&nbsp;</>}
                {!fcPrimeraFactura ? '' : moment(fcPrimeraFactura).locale('moment/locale/es').local().format("DD/MM/YYYY")}
            </span>
        </>
    );

}