import React, {Component} from "react";
import axios from "axios";
import {routes} from "../../UtilsGeneral";
import reporte from "../../../../assets/images/reporte.png"

export class Reportes extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {}
    }

    imprimir = (pdf) => {
        axios.get(routes.api + '/siniestros-vam/imprimir', {
            params: {
                pdf: pdf,
                vam: this.props.vam,
                cdIncSiniestro: this.props.siniestro.cdIncSiniestro ? this.props.siniestro.cdIncSiniestro : this.props.siniestro.numSiniestro,
                cdReclamo: this.props.siniestro.cdReclamo,
                cdCompania: this.props.siniestro.cdCompania
            }, responseType: 'arraybuffer'
        }).then(response => {
            let blob = new Blob([response.data], {type: pdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            let url = window.URL.createObjectURL(blob);
            window.open(url);
            this.props.alert.show_info('Generado con éxito');
        }).catch(error => {
                this.props.alert.handle_error('Error al generar PDF. Consulte con el administrador del sistema.');

            }
        );
    };

    render() {
        return (
            <>
                <tr key={"reporte"}>
                    <td>
                        <div className="text-left">
                         <span className="text-primary option px-2 c-pointer" title="Ver reportes"
                               onClick={() => this.imprimir(true)}>
                            <img src={reporte} className={"my-lg-n1 st-50 "}
                                 width={40} title={"Siniestro Pdf"}/>
                        </span>

                        </div>
                    </td>
                </tr>
            </>
        )
    }
}