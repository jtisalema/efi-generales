import React, {useState} from "react";
import moment from "moment";
import {Modal, ModalBody} from "reactstrap";
import axios from "axios";
import {routes} from "../../../UtilsGeneral";
import {UqaiModalHeader} from "../../../../../components/UqaiModal";


export const DocsDigitales = ({alert, tipo, row}) => {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState([]);

    function getDocs(tp, cd, id, cdRamo, cdCompania, cdRamoCotizacion) {
        axios.get(routes.api + '/docs', {
            params: {
                tipo: tp,
                cdContratante: cd,
                id: id,
                cdRamo,
                cdCompania,
                cdRamoCotizacion
            }
        }).then(resp => {
            let docs = resp.data.docs;
            setList(docs);
        }).catch(error => {
                alert.current.handle_error(error);
            }
        );
    }

    return <>
        <span onClick={() => {
            let idx = row.poliza;
            if (tipo === "siniestro") {
                if (row.cdIncSiniestro) {
                    idx = row.numSiniestro + '.' + row.item + '-' + row.anoSiniestro;
                } else {
                    idx = row.numSiniestro + '-' + row.anoSiniestro;
                }
            }
            let cdRamo = row.cdRamo;
            let cdRamoCotizacion = row.cdRamoCotizacion;
            if (row.ramosCotizacion) {//sineistros generales
                cdRamo = row.ramosCotizacion.cdRamo;
                cdRamoCotizacion = row.ramosCotizacion.cdRamoCotizacion;
            }
            getDocs(tipo, row.cdCliente, idx, cdRamo, row.cdCompania, cdRamoCotizacion);
            setOpen(true);
        }} title="Ver Documentos Digitales">
                     <i className="icon-uqai uqai-ver text-secondary me-2"/>
        </span>
        <Modal isOpen={open} toggle={() => {
            setOpen(false);
            setList([]);
        }} size="xl">
            <UqaiModalHeader toggle={() => {
                setOpen(false);
                setList([]);
            }} title="Documentos Digitales"/>
            <ModalBody>
                <table className="table table-borderless table-hover">
                    {list.length > 0 ?
                        <>
                            <thead>
                            <tr className="text-secondary">
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Ver</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(list || []).map((doc, index) => (
                                <tr key={doc.id}>
                                    <td>{index + 1}</td>
                                    <td>{doc.nm}</td>
                                    <td>
                                        <a className="font-weight-bold"
                                           href={routes.api + '/doc/' + doc.id + "/" + doc.ext}
                                           target="_blank">Ver Documento</a>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </> :
                        <div className={"text-center my-2"}><h4>{"No hay documentos relacionados"}</h4></div>}
                </table>
            </ModalBody>
        </Modal>
    </>
}