import React, {Component} from "react";
import {Modal, ModalBody} from "reactstrap";
import {routes} from "../UtilsVam";
import axios from "axios";
import {Deducibles} from "./parts/Deducibles";
import {UqaiModalHeader} from "../../../components/UqaiModal";

export class DeduciblesModal extends Component {

    constructor(props) {
        super(...arguments);
        this.state = {
            list: []
        };
    }

    componentDidMount() {
        let {open} = this.props;
        if (open) {
            this.getDeducibles(this.props.cedula)
        }
    }

    componentDidUpdate(prevProps) {
        let {open} = this.props;
        let openOld = prevProps.open;

        if (open !== openOld) {
            if (open) {
                this.getDeducibles(this.props.cedula)
            }
        }
    }

    getDeducibles = (cedula) => {
        axios.get(routes.api + '/siniestro/deducible/matrix', {
            params: {
                cedula, caducada: false
            }
        }).then(resp => {
            let list = resp.data;
            // let list = [{"CD_COTIZACION":2579,"CD_COMPANIA":2,"NM_ASEGURADORA":"PAN AMERICAN LIFE DE ECUADOR COMPAÑIA DE SEGUROS S.A.","POLIZA":"79159","CLIENTE":"SEGUSUAREZ AGENCIA ASESORA DE SEGUROS  ","RUC_CED":"1891753191001","CEDULA_O":"1804772786","DSC_OBJETO":"SANTANA BARCLAY MARIA CRISTINA","CORREO":"crissant830@hotmail.com","CELULAR":null,"DSC_PLAN":"PALIG SEGUSUAREZ  VIDA 15000","items":[]},{"CD_COTIZACION":2554,"CD_COMPANIA":2,"NM_ASEGURADORA":"BMI IGUALAS MEDICAS DEL ECUADOR S.A","POLIZA":"17847","CLIENTE":"SEGUSUAREZ AGENCIA ASESORA DE SEGUROS  ","RUC_CED":"1891753191001","CEDULA_O":"1804772786","DSC_OBJETO":"SANTANA BARCLAY MARIA CRISTINA","CORREO":"crissant830@hotmail.com","CELULAR":null,"DSC_PLAN":"BMI GM $ 500 DEDUCIBLE","items":[{"CD_COMPANIA":2,"CEDULA":"1804772786","CD_COTIZACION":2554,"CD_ASEGURADO":43532,"NOMBRES":"SANTANA BARCLAY MARIA CRISTINA","TIPO":"T","FC_NACIMIENTO":"1990-08-30T05:00:00.000+0000","deducible":{"total":"5000.0","consumido":"0.0","saldo":"5000.0","desc":" año poliza"}}]},{"CD_COTIZACION":2459,"CD_COMPANIA":2,"NM_ASEGURADORA":"BMI IGUALAS MEDICAS DEL ECUADOR S.A","POLIZA":"17847","CLIENTE":"SEGUSUAREZ AGENCIA ASESORA DE SEGUROS  ","RUC_CED":"1891753191001","CEDULA_O":"1804772786","DSC_OBJETO":"SANTANA BARCLAY MARIA CRISTINA","CORREO":"crissant830@hotmail.com","CELULAR":null,"DSC_PLAN":"BMI 10 SERIE B - 2020 SUAREZ","items":[{"CD_COMPANIA":2,"CEDULA":"1804772786","CD_COTIZACION":2459,"CD_ASEGURADO":43189,"NOMBRES":"SANTANA BARCLAY MARIA CRISTINA","TIPO":"T","FC_NACIMIENTO":"1990-08-30T05:00:00.000+0000","deducible":{"total":"100.0","consumido":"0.0","saldo":"100.0","desc":" año poliza"}}]}];
            this.setState({list});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    };

    closeModal = () => {
        this.props.toggleModal(false);
        this.setState({item: {}});
    };

    render() {

        return (
            <React.Fragment>
                <Modal isOpen={this.props.open} toggle={this.props.closeModal} size="lg">
                    <UqaiModalHeader toggle={this.props.closeModal} title="Deducibles"/>
                    <ModalBody>
                        {(this.state.list || []).map(p => (
                            <table key={p.CD_COTIZACION} className="table table-borderless table-white">
                                <thead>
                                <tr>
                                    <td className="text-primary">
                                        Aseguradora:
                                    </td>
                                    <td className={"text-left"}>
                                        {p.NM_ASEGURADORA}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="text-primary">
                                        Póliza:
                                    </td>
                                    <td className={"text-left"}>
                                        {p.POLIZA}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-primary">
                                        Contratante:
                                    </td>
                                    <td className={"text-left"}>
                                        {p.CLIENTE}
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                {(p.items || []).map(d => (
                                    <tr key={d.CEDULA + '' + p.CD_COTIZACION}>
                                        <td>
                                            <small>{d.NOMBRES}</small>
                                        </td>
                                        <td>
                                            <Deducibles deducible={d.deducible} space={true}/>
                                        </td>
                                    </tr>
                                ))}

                                {(p.items || []).length === 0 && <tr>
                                    <td colSpan={2}>Sin Deducibles</td>
                                </tr>}
                                </tbody>
                            </table>
                        ))}

                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}