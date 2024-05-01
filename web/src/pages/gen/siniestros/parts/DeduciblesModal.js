import React, {Component} from "react";
import {Modal, ModalBody} from "reactstrap";
import {routes} from "../../UtilsGeneral";
import axios from "axios";
import {Deducibles} from "./Deducibles";
import {UqaiModalHeader} from "../../../../components/UqaiModal";

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
                <Modal className="modal-dialog-centered modal-lg" isOpen={this.props.open}>
                    <UqaiModalHeader toggle={this.props.closeModal} title="Deducibles"/>
                    <ModalBody className={"pt-0 mt-0"}>
                        {this.state.list.map(p => (
                            <table key={p.CD_COTIZACION} className="m-auto text-left fs12">
                                <thead>
                                <tr>
                                    <td className="form-label fw-bold text-secondary fs-7">
                                        Aseguradora:
                                    </td>
                                    <td>
                                        {p.NM_ASEGURADORA}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="form-label fw-bold text-secondary fs-7">
                                        Póliza:
                                    </td>
                                    <td>
                                        {p.POLIZA}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="form-label fw-bold text-secondary fs-7">
                                        Contratante:
                                    </td>
                                    <td>
                                        {p.CLIENTE}
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                {p.items.map(d => (
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