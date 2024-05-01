import React, {Component} from "react";
import moment from "moment";

export class Contratante extends Component {

    constructor(props) {
        super(...arguments);
        this.state = {}
    }


    render() {
        let {siniestro, cliente} = this.props;

        return (
            <div className="col-lg-3">
                <img src="/img/logo1.png" className="img-fluid flex-center" style={{"margin": "auto", maxWidth: 200}}
                     alt="logo"/>
                <br/><br/>
                <table className="m-auto text-left fs12">
                    <tbody>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>No. Siniestro</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.numSiniestro}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Incapacidad:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}> {siniestro.nmIncapacidad}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Fc.Recepción:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.fcSiniestro ? moment(siniestro.fcSiniestro).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Titular:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.titular}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Reclamante:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}> {siniestro.dscObjeto}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Estado:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.aliasEstado}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Tipo Sin:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}> {siniestro.tpSiniestro}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Póliza:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.poliza}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Ramo:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.nmRamo}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Aseguradora:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.nmAseguradora}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Contratante:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{cliente.titular}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Alcance:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{siniestro.item}</td>
                    </tr>
                    <br/>
                    </tbody>
                </table>
            </div>
        )
    }
}