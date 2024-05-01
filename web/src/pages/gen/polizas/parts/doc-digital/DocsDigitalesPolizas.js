import React, {Component} from "react";
import {Modal, ModalBody, Table} from "reactstrap";
import {routes} from "../../../../../util/General";
import axios from "axios";
import Alerts from "../../../../../components/Alerts";
import moment from "moment";
import {UqaiModalHeader} from "../../../../../components/UqaiModal";

export class DocsDigitalesPolizas extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            docs: []
        };
    }

    componentDidUpdate(prevProps) {
        let {open, tipo, row, vam} = this.props;
        let openOld = prevProps.open;

        if (open !== openOld) {
            if (open) {
                this.getDocs(tipo, row.cdCliente, tipo === "siniestro" ? row.cdIncSiniestro ? row.cdIncSiniestro : row.numSiniestro : row.poliza,
                    row.cdRamo, row.cdCompania, row.cdRamoCotizacion, vam);
            }
        }
    }

    getDocs = (tp, cd, id, cdRamo, cdCompania, cdRamoCotizacion, vam = false) => {
        axios.get(routes.api + '/docs', {
            params: {
                tipo: tp,
                cdContratante: cd,
                id: id,
                cdRamo,
                cdCompania,
                cdRamoCotizacion, vam
            }
        }).then(resp => {
            this.setState({docs: resp.data.docs});
        }).catch(error => {
                this.alert.current.handle_error(error);
            }
        );
    }

    closeModal = () => {
        this.props.toggleModal(false);
        this.setState({item: {}});
    };

    render() {
        let list = this.state.docs;
        return (
            <React.Fragment>
                <Alerts ref={this.alert}/>
                <Modal className="modal-dialog-centered modal-lg" isOpen={this.props.open}>
                    <UqaiModalHeader toggle={() => this.props.closeModal(false)} title="Documentos Digitales"/>
                    <ModalBody className={"pt-0 mt-0"}>
                        <Table responsive className={"table table-borderless table-hover"}>
                            {list.length > 0 ?
                                <>
                                    <thead>
                                    <tr className="text-secondary">
                                        <th className="bg-white" scope="col">#</th>
                                        <th className="bg-white" scope="col">Nombre</th>
                                        <th className="bg-white" scope="col">Ver</th>
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
                        </Table>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}