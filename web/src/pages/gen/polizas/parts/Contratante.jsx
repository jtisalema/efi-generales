import React, {Component} from "react";
import moment from "moment";
import {DscPlan, NombreAseguradora, NombreCliente, NombreRamo} from "./LookupNames";
import {ModalPrint} from "./ModalPrint";
import Alerts from "../../../../components/Alerts";

export class Contratante extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            open: false,
            pdf: false,
            aseg: false,
            exportar: false,
            extras: false,
        }
    }

    closeModal = (val) => {
        this.setState({open: val, pdf: false, aseg: false, exportar: false, extras: false});
    }

    render() {
        let {poliza, item, user, vida, row, tipo, vista} = this.props;
        return (
            <div className="col-lg-3">
                <Alerts ref={this.alert}/>
                <img src="/img/logo1.png" className="img-fluid flex-center d-none"
                     style={{"margin": "auto", maxWidth: 200}}
                     alt="logo"/>
                <br/><br/>
                <table className="text-left fs12">
                    <tbody>
                    <tr>
                        <td className="fw-bold text-secondary fs-7" colSpan={2}>Contratante:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}><NombreCliente cod={user.cdCliente}/></td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Aseguradora:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{<NombreAseguradora cod={poliza.cdCotizacion}/>}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Ramo:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{<NombreRamo cod={poliza.cdRamo} list={this.props.ramos}/>}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Póliza:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{poliza.poliza}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Fc Desde:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}
                            className="text-uppercase">{poliza.fcDesde ? moment(poliza.fcDesde).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}</td>
                    </tr>
                    <tr>
                        <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Fc Hasta:</td>
                    </tr>
                    <tr>
                        <td colSpan={2}
                            className="text-uppercase"> {poliza.fcHasta ? moment(poliza.fcHasta).locale('moment/locale/es').local().format("DD/MMM/YYYY") : null}</td>
                    </tr>
                    {!vida &&
                        <>
                            <tr>
                                <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Val Asegurado:</td>
                            </tr>
                            <tr>
                                <td colSpan={2}>{"$ " + poliza.valAsegurado}</td>
                            </tr>
                            <tr>
                                <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Prima Total:</td>
                            </tr>
                            <tr>
                                <td colSpan={2}>$ {vida ? poliza.valPrima : item.totPrima}</td>
                            </tr>
                        </>
                    }
                    {vida ?
                        <>
                            <tr>
                                <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Plan:</td>
                            </tr>
                            <tr>
                                <td className="text-uppercase" colSpan={2}>
                                    {<DscPlan cod={item.cdUbicacion} cdCompania={item.cdCompania}/>}
                                </td>
                            </tr>
                        </> :
                        <>
                            <tr>
                                <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Tipo:</td>
                            </tr>
                            <tr>
                                <td className="text-uppercase" colSpan={2}>
                                    {item.tipo}
                                </td>
                            </tr>
                            <tr>
                                <td className="form-label fw-bold text-secondary fs-7" colSpan={2}>Anexo:</td>
                            </tr>
                            <tr>
                                <td className="text-uppercase" colSpan={2}>
                                    {item.anexo}
                                </td>
                            </tr>
                        </>
                    }
                    <br/>
                    {vista &&
                        <>
                            <tr>
                                <p className={"form-label fw-bold text-secondary fs-7"}>Reportes</p>
                            </tr>
                            <tr>
                                <small>
                                    {vida ? <>
                                            <i className={"far fa-file-pdf fa-2x mx-3 my-2 text-danger c-pointer"}
                                               onClick={() => this.setState({aseg: true, open: true, pdf: true})}
                                               title={"Asegurados Pdf"}/>
                                            <i className={"fas fa-file-excel fa-2x mx-3 text-info c-pointer"}
                                               onClick={() => this.setState({aseg: true, open: true, pdf: false})}
                                               title={"Asegurados Excel"}/>
                                        </>
                                        :
                                        <>
                                            <i className={"far fa-file-pdf fa-2x mx-3 my-2 text-danger c-pointer"}
                                               onClick={() => this.setState({aseg: false, open: true, pdf: true})}
                                               title={"Póliza Pdf"}/>
                                            <i className={"fas fa-file-excel fa-2x mx-3 text-info c-pointer"}
                                               onClick={() => this.setState({aseg: false, open: true, pdf: false})}
                                               title={"Póliza Excel"}/>
                                        </>
                                    }

                                </small>
                            </tr>
                        </>
                    }
                    </tbody>
                </table>
                <ModalPrint cdCompania={poliza.cdCompania} cdRamoCotizacion={item.cdRamoCotizacion}
                            cdCotizacion={vida ? poliza.cotizacion.cdCotizacion : item.cdCotizacion}
                            alert={this.alert.current}
                            setOpen={this.closeModal}
                            open={this.state.open} pdf={this.state.pdf} vam={vida} aseg={this.state.aseg}
                            poliza={poliza.poliza} exportar={this.state.exportar} extras={this.state.extras}
                            query1={this.props.query1} row={row} tipo={tipo} titular={this.props.titular}
                            titularu={this.props.titularu}
                            titularF={this.props.titularF} vigente={this.props.vigente} subtotal={this.props.subtotal}
                            cantidad={this.props.cantidad}/>
            </div>
        )
    }
}