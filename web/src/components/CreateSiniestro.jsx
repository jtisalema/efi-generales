import React, {useEffect, useRef, useState} from "react";
import {MODULES, useCurrentModule} from "../hooks/useModules";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import axios from "axios";
import {routes} from "../pages/gen/UtilsGeneral";
import {defaultSiniestro} from "../pages/vam/siniestros-portal/utils";
import {
    defaultEstadoSiniestro,
    isEjecutivoOrAdminAbleToEditByEstadoSiniestro
} from "../pages/vam/siniestros-portal/estados_edicion";
import {SiniestroPortalEdit} from "../pages/vam/siniestros-portal/SiniestroPortalEdit";
import {routes as routesVam} from "../pages/vam/UtilsVam";
import {ENDPOINT_GEN, ENDPOINT_VAM} from "../constants/modules.constant";


export const CreateSiniestro = () => {

    const user = useSelector(state => state.user);
    const params = useParams();
    const alert = useRef(null);

    const [item, setItem] = useState(defaultSiniestro());
    const [isEdit, setIsEdit] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [incapacidad, setIncapacidad] = useState(null);
    const [comentario, setComentario] = useState({});
    const [matrix, setMatrix] = useState([]);
    const [aseguradoras, setAseguradoras] = useState([]);
    const [ramos, setRamos] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [titulares, setTitulares] = useState([]);
    const [polizaData, setPolizaData] = useState({aseguradora: "", plan: "", ramo: ""});

    const isGen = useCurrentModule() === MODULES.GEN;
    const moduleEnpoint = isGen ? ENDPOINT_GEN : ENDPOINT_VAM;
    const pathSiniestrosReported = `${isGen ? "/gen" : "/vam"}/siniestros-reportados`;

    useEffect(() => {
        if (params?.cdComp === "new") {
            getDataMatrix(isGen ? user?.cdCliente : user?.cedula)
            setComentario(defaultEstadoSiniestro('POR_REVISAR', user, 'Creación de siniestro en portal'));
            setIsOpen(true)
        } else {
            getSiniestroPortalItem(params?.cdComp, params?.cdReclamo, params?.cdIncSiniestro);
        }
    }, [params?.cdReclamo, user?.cdCliente, user?.cedula])

    const getDataMatrix = (userIdentification) => {
        if (userIdentification) {
            getMatrix(userIdentification).then(aseguradorasList => {
                setMatrix(aseguradorasList);
                if (aseguradorasList.length > 0) {
                    const aseguradorasTemporal = (aseguradorasList || []).map(aseguradora => ({
                        value: aseguradora.CD_ASEGURADORA,
                        cdCotizacion: aseguradora.CD_COTIZACION,
                        label: aseguradora.NM_ASEGURADORA
                    }));
                    const hash = new Set();
                    const aseguradorasDistinct = aseguradorasTemporal.filter(aseguradora => {
                        if (hash.has(aseguradora.value)) return false;
                        hash.add(aseguradora.value);
                        return true;
                    });
                    aseguradorasDistinct.sort((aseguradoraA, aseguradoraB) => aseguradoraA.label.localeCompare(aseguradoraB.label))
                    setAseguradoras(aseguradorasDistinct);
                }
            }).catch((error) => alert.current?.handle_error(error));
        }
    }

    const getMatrix = async (userIdentification) => {
        const params = {
            caducada: false,
            cedula: userIdentification,
            cdCliente: userIdentification
        };
        const url = moduleEnpoint.getMatrix;
        const resp = await axios.get(url, {
                params
            }
        );
        return resp.data;
    }

    const findRamos = (cdAseguradora) => {
        const ramosTemporal = (matrix || []).filter(ramo => ramo.CD_ASEGURADORA === cdAseguradora).map(ramo => ({
            ...ramo,
            value: ramo.CD_UBICACION + '_' + ramo.CD_COMPANIA,
            cdRamo: ramo.CD_RAMO,
            cdUbicacion: ramo.CD_UBICACION,
            cdCompania: ramo.CD_COMPANIA,
            cdRamoCotizacion: ramo.CD_RAMO_COTIZACION,
            label: ramo?.NM_RAMO + ' / ' + ramo?.POLIZA + ' / ' + ramo.DSC_PLAN,
            items: ramo.items
        }));
        ramosTemporal.sort((ramoA, ramoB) => ramoA.label.localeCompare(ramoB.label))
        setRamos(ramosTemporal);
    }

    const getSiniestroPortalItem = (cdCompania, cdReclamo, cdIncSiniestro) => {
        if (cdCompania && cdReclamo) {
            axios.get(`${routesVam.api}/siniestros-portal`, {
                params: {cdCompania, cdReclamo, cdIncSiniestro}
            }).then(resp => {
                const siniestroPortalItem = resp.data;
                setItem(siniestroPortalItem);
                setComentarios(siniestroPortalItem?.observacionesEstados ? JSON.parse(siniestroPortalItem?.observacionesEstados) : []);
                getDataAdmin(siniestroPortalItem);
                setIsEdit(isEditable(siniestroPortalItem));
                getIncapacidad(siniestroPortalItem?.cdIncapacidad);
            }).catch((error) => alert.current?.handle_error(error));
        }
    }
    const getDataAdmin = (siniestro) => {
        axios.get(`${routes.api}/siniestros-portal/data`, {
            params: {
                cdAseguradora: siniestro?.cdAseguradora,
                cdRamoCotizacion: siniestro?.cdRamoCotizacion,
                cdUbicacion: siniestro?.cdUbicacion,
                cdRamo: siniestro?.cdRamo
            }
        }).then(resp => {
            setPolizaData(resp.data);
        }).catch(error =>
            alert.current.show_error('Error al guardar ' + error)
        );
    }
    const getIncapacidad = (id) => {
        axios.get(`${routes.api}/siniestros-portal/incapacidad`, {
            params: {id}
        }).then(resp => {
            const incapacidadResponse = resp.data
            setIncapacidad({
                label: incapacidadResponse?.nmIncapacidad,
                value: incapacidadResponse?.cdIncapacidad
            });
        });
    }
    const isEditable = (siniestro) => {
        return !siniestro.cdReclamo || isEjecutivoOrAdminAbleToEditByEstadoSiniestro(user, siniestro?.estadoPortal);
    }

    const findTitulares = (cdUbicacion, cdCompania) => {
        axios
            .get(`${routes.api}/siniestros-gen/titulares`, {
                params: {
                    cdUbicacion,
                    cdCompania,
                },
            })
            .then((resp) => {
                setTitulares(resp.data);
            })
            .catch((error) => {
                setTitulares([]);
                alert.current?.handle_error(error);
            });
    };

    const findPacientes = (titularAssigned, isGenerales, cdCotizacion) => {
        if (isGenerales) {
            axios.get(`${routes.api}/siniestros-gen/asegurados`, {
                params: {
                    cdCompania: titularAssigned?.cdCompania,
                    cdCotizacion,
                    cedula: titularAssigned?.cedulaO
                }
            }).then(resp => {
                setPacientes(resp.data.asegurados)
            }).catch((error) => {
                setPacientes([]);
                alert.current?.handle_error(error);
            })
        } else {
            const pacientesTemporal = titularAssigned?.items ?? [];
            pacientesTemporal.sort((pacienteA, pacienteB) => pacienteA.NOMBRES.localeCompare(pacienteB.NOMBRES));
            setPacientes(pacientesTemporal);
        }
    };

    return (
        <SiniestroPortalEdit
            open={isOpen}
            setOpen={setIsOpen}
            aseguradoras={aseguradoras}
            ramos={ramos}
            findRamos={findRamos}
            titulares={titulares}
            setTitulares={setTitulares}
            findTitulares={findTitulares}
            pacientes={pacientes}
            setPacientes={setPacientes}
            findPaciente={findPacientes}
            item={item}
            setItem={setItem}
            incapacidad={incapacidad}
            setIncapacidad={setIncapacidad}
            polizaData={polizaData}
            comentarios={comentarios}
            comentario={comentario}
            setComentario={setComentario}
            edit={isEdit}
            setEdit={setIsEdit}
            pathSiniestrosReported={pathSiniestrosReported}
            isEditable={isEditable}
        />
    );
}