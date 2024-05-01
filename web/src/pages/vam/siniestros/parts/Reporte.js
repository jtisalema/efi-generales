import React, {Component} from "react";
import axios from "axios";
import {routes} from "../../../gen/UtilsGeneral";
import connect from "react-redux/es/connect/connect";
import {on_select} from "../../polizas/actions";

class Reporte extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {}
    }

    imprimir = (pdf) => {
        axios.get(routes.apiVam + '/siniestro/imprimir', {
            params: {
                cdIncSiniestro: this.props.siniestro.cdIncSiniestro,
                cdReclamo: this.props.siniestro.cdReclamo,
                cdCompania: this.props.siniestro.cdCompania,
                pdf: pdf,
                vam: true
            }, responseType: 'arraybuffer'
        }).then(response => {
            let blob = new Blob([response.data], {type: pdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            let url = window.URL.createObjectURL(blob);
            window.open(url);
            this.props.alert.show_info('Generado con éxito');
        }).catch(error => {
                this.props.alert.handle_error('Error al generar PDF. Consulte con el administrador del sistema.');
                console.log(error);
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
                           <i className="icon-uqai uqai-documentos text-secondary me-2"
                                title={"Siniestro Pdf"}/>
                        </span>

                        </div>
                    </td>
                </tr>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    auth: state.auth
});

const mapDispatchToProps = {
    on_select
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Reporte);