import React, {Component} from "react";
import moment from "moment";

export class Contratante extends Component {

    constructor(props) {
        super(...arguments);
        this.state = {}
    }


    render() {
        let {poliza, item} = this.props;

        return (
            <div className="col-lg-3">
                <img src="/img/logo1.png" className="img-fluid flex-center" style={{"margin": "auto", maxWidth: 200}}
                     alt="logo"/>
                <br/><br/>
                <table className="text-left fs12">
                    <tbody>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Contratante:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{poliza.nmCliente}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Aseguradora:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{poliza.nmAseguradora}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Ramo:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{poliza.nmRamo}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Póliza:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{poliza.poliza}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Fc Desde:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{poliza.fcDesde ? moment(poliza.fcDesde).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Fc Hasta:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{poliza.fcHasta ? moment(poliza.fcHasta).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Plan:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{item.dscRubro}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}