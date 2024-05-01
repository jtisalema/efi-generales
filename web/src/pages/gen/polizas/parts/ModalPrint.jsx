import React, {useEffect, useState} from 'react';
import {Modal, ModalBody, ModalFooter} from "reactstrap";
import axios from "axios";
import {routes} from "../../UtilsGeneral";
import {UqaiModalHeader} from "../../../../components/UqaiModal";

export const ModalPrint = ({
                               alert,
                               open,
                               setOpen,
                               cdCompania,
                               cdCotizacion,
                               cdRamoCotizacion,
                               vam,
                               pdf,
                               aseg,
                               poliza,
                               exportar,
                               extras,
                               query1,
                               row,
                               tipo,
                               titular,
                               titularu,
                               titularF,
                               subtotal,
                               vigente,
                               cantidad
                           }) => {
    const [linkPdf, setLinkPdf] = useState("");
    const [error, setError] = useState(false);
    const [msm, setMsm] = useState("Generando... Por favor espere...");

    useEffect(() => {
        if (open) {
            setError(null);

            if (linkPdf) {
                window.URL.revokeObjectURL(linkPdf);
            }
            if (exportar) {
                exportarList(aseg, extras, query1, row);
            } else {
                getPdf(cdCompania, cdCotizacion, cdRamoCotizacion, vam, pdf, aseg, poliza, titular, titularu, titularF, subtotal, vigente, cantidad);
                console.log(titular)
            }
        } else {
            window.URL.revokeObjectURL(linkPdf);
            setLinkPdf(null);
        }
        return () => {
            if (linkPdf) {
                window.URL.revokeObjectURL(linkPdf);
            }
        };
    }, [open, cdCotizacion, cdCotizacion, vam, pdf, aseg, poliza, exportar])

    function getPdf(cdCompania, cdCotizacion, cdRamoCotizacion, vam, pdf, aseg, poliza, titular, titularu, titularF, subtotal, vigente, cantidad) {
        axios.get(routes.api + "/poliza/reporte/print", {
            params: {
                cdCompania,
                cdCotizacion,
                cdRamoCotizacion,
                vam,
                pdf,
                aseg,
                poliza,
                titular,
                titularu,
                titularF,
                subtotal,
                vigente,
                cantidad
            }, responseType: 'arraybuffer'
        }).then((res) => {
            let blob = new Blob([res.data], {type: pdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            let linkPdf = window.URL.createObjectURL(blob);
            window.open(linkPdf);
            setTimeout(() => {
                setOpen(false)
            }, 2000);
        }).catch(error => {
            setError(true);
            alert.handle_error(error);
        });

    }

    function exportarList(aseg, extras, query1, row) {
        let body = {
            aseg: aseg,
            extras: extras,
            query1: query1,
            cdCompania: row?.cdCompania,
            cdObjetoCotizacion: row?.cdObjCotizacion,
            tipo: tipo
        }
        let q = Object.assign({}, body);
        let nm = "Export_" + (aseg ? "Asegurados_" : "Detalles_") + (extras ? "Dependientes_" : "") + poliza + ".xlsx"
        axios.post(routes.api + "/poliza/exports/excel", q, {responseType: 'arraybuffer'}).then((resp) => {
            let blob = new Blob([resp.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            let linkExcel = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = linkExcel;
            link.setAttribute('download', nm);
            document.body.appendChild(link);
            link.click();
            setMsm("Se ha exportado con éxito, revise su carpeta de Descargas")
            setTimeout(() => {
                setLinkPdf(linkPdf);
                setOpen(false)
            }, 4000);
        }).catch(error => {
            alert.handle_error(error)
        })

    }

    return (
        <Modal className="text-center modal-print" isOpen={open}>
            <UqaiModalHeader toggle={() => setOpen(false)}/>
            <ModalBody className="py-1">
                <div className="d-flex flex-column">
                    <div className="text-center mb-2"><i className="icon-uqai uqai-pregunta fs-1 text-primary"></i>
                    </div>
                    <h4 className="text-secondary text-center mb-3 fw-bold">{exportar ? "Exportar" : "Reporte"}</h4>
                    <p className="m-0 text-center">
                        {linkPdf &&
                            <iframe title="iframe" className="w-100" src={linkPdf}
                                    style={{height: 'calc(100vh - 300px)'}}/>}

                        {!linkPdf && !error && <div>
                            {msm}
                        </div>}
                        {error && <span>Error al generar contacte con soporte.</span>}
                    </p>
                </div>
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-primary"
                        onClick={() => {
                            setOpen(false);
                            setMsm("Generando... Por favor espere...");
                            setLinkPdf("");
                        }}>
                    Cerrar
                </button>
            </ModalFooter>
        </Modal>

    )
}