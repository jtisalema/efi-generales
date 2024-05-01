import React, {Component} from "react";
import moment from "moment";

export class ContratanteGEN extends Component {

    constructor(props) {
        super(...arguments);
        this.state = {}
    }


    render() {
        let {siniestro, cliente} = this.props;
        let veh = siniestro.objeto?.objCotizacion?.vehiculo;

        return (
            <div className="col-lg-3">
                <table className="m-auto text-left fs12">
                    <tbody>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>No. Siniestro:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro?.numSiniestro}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Causa:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro?.causa}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Des Objeto:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.objeto?.dscObjeto}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Fc.Siniestro:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}> {siniestro.fcSiniestro ? moment(siniestro.fcSiniestro).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>No. Repor Aseg:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro?.numRepAseg}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Observación - Referencias
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro?.obsSiniestro}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Estado:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.estadoActivo.estSiniestro?.dscEstado}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Fc Estado:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.estadoActivo?.fcSeguimiento}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Póliza:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.poliza}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Ramo:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.ramo?.nmRamo}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Aseguradora:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.aseguradora?.nmAseguradora}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Contratante:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{cliente?.titular}</td>
                    </tr>
                    {veh &&
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Vehiculo:</td>
                    </tr>
                    }
                    {veh &&
                    <tr>
                        <td colSpan={2}>
                            {`${veh.placa} ${veh.marca} ${veh.anioDeFabricacion} ${veh.color} ${veh.noDeMotor}
                            ${veh.modelo} ${veh.noDeChasis}`}
                        </td>
                    </tr>
                    }
                    <tr>
                        <td colSpan={2}> {siniestro.tpSiniestro}</td>
                    </tr>
                    <br/>
                    </tbody>
                </table>
            </div>
        )
    }
}