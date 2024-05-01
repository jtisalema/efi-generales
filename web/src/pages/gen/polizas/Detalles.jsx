import React, {Component} from "react";
import {routes} from "../UtilsGeneral";
import axios from "axios";
import "moment/locale/es"
import {Modal, ModalBody} from "reactstrap";
import {Contratante} from "./parts/Contratante";
import ReactTable from "react-table";
import {UqaiModalHeader} from "../../../components/UqaiModal";

export class Detalles extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            list: [],
            dependientes: [],
            pages: -1,
            vista: true,
            page: 0,
            loading: false,
            tipo: 1,//por defecto vehiculo
            columns: [],
            selected: -1,
            row: null,
            query1: {},
        };
    }

    componentDidMount() {
        let {open} = this.props;
        if (open) {
            this.fetchData();
        }
    }

    componentDidUpdate(prevProps) {
        let {open} = this.props;
        let openOld = prevProps.open;

        if (open !== openOld) {
            if (open) {
                this.fetchData();
                this.tipoContenido();
            } else {
                this.setState({item: {}});
            }
        }
    }

    tipoContenido() {
        let item = this.props.item;
        axios.get(routes.api + '/polizas/tipo-contenido', {
            params: {
                cdRamoCotizacion: item.cdRamoCotizacion,
                cdCompania: item.compania.cdCompania
            }
        }).then(resp => {
            let ramo = resp.data;
            let tipo;
            if (ramo != null && (ramo.nmRamo.includes('VIDA') || ramo.nmRamo.includes('MEDICA'))) {
                tipo = 2;
            } else if (ramo != null && ramo.nmRamo.includes('VEHICULO')) {
                tipo = 1;
            } else {
                tipo = 0;
            }
            this.setState({tipo: tipo, columns: this.generateColumns(tipo)});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    }

    fetchData() {
        let {item, poliza} = this.props;
        let query1 = {
            cdRamoCotizacion: item.cdRamoCotizacion,
            cdRamo: poliza.cdRamo,
            cdCompania: item.compania.cdCompania,
            cdUbicacion: item.cdRamoCotizacion,//busco ubicacion x ramoCotizacion
            dscObjeto: '',
            cedulaO: '',
            page: 0,
            pageSize: 10,
            sorted: [],
            vehiculo: {
                marca: '',
                modelo: '',
                placa: '',
                noDeMotor: '',
                noDeChasis: '',
            }
        };
        axios.post(routes.api + '/polizas/subObjeto', query1).then(resp => {
            let list = resp.data;
            this.setState({
                list: list.content,
                pages: list.totalPages,
                loading: false,
                query1: query1
            });
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    }


    getObjetos(item) {
        axios.get(routes.api + '/polizas/subobjetos', {
            params: {
                cdCompania: item.cdCompania,
                cdObjetoCotizacion: item.cdObjCotizacion
            }
        }).then(resp => {
            let list = resp.data;
            this.setState({dependientes: list});
        }).catch(error => {
                alert('Error al consultar' + error);
            }
        );
    }

    closeModal = () => {
        this.props.toggleModal(false);
        this.setState({list: [], row: null});
    };

    generateColumns(tipo) {
        if (tipo === 1) {
            return [
                {
                    Header: "Item",
                    minResizeWidth: 50,
                    width: 140,
                    sortable: false,
                    accessor: "item"
                },
                {
                    Header: "Objeto Asegurado",
                    minResizeWidth: 50,
                    width: 200,
                    sortable: false,
                    accessor: "dscObjeto"
                },
                {
                    Header: "Val Aseg($)",
                    accessor: "totAseActual",
                    sortable: false,
                    minResizeWidth: 10,
                    width: 100,
                },
                {
                    Header: "Tasa",
                    accessor: "tasa",
                    sortable: false,
                    minResizeWidth: 10,
                    width: 100
                },
                {
                    Header: "Prima ($)",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "totPriActual",
                    width: 140,
                },
                {
                    Header: "Extras",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "cantidad",
                    width: 160,
                },
                {
                    Header: "Marca",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "vehiculo.marca",
                    width: 140
                },
                {
                    Header: "Modelo",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "vehiculo.modelo"
                },
                {
                    Header: "Año",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "vehiculo.anioDeFabricacion"
                },
                {
                    Header: "Placa",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "vehiculo.placa"
                },
                {
                    Header: "Motor",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "vehiculo.noDeMotor"
                }
                , {
                    Header: "Chasis",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "vehiculo.noDeChasis"
                }, {
                    Header: "Color",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "vehiculo.color"
                }, {
                    Header: "Observaciones",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "obsObjeto"
                }
            ]
        } else {
            return [
                {
                    Header: "Item",
                    minResizeWidth: 50,
                    width: 140,
                    sortable: false,
                    accessor: "item"
                },
                {
                    Header: "Ubicación",
                    minResizeWidth: 50,
                    width: 200,
                    sortable: false,
                    accessor: "ubicacion.dscUbicacion"
                },
                {
                    Header: "Objeto Asegurado",
                    minResizeWidth: 50,
                    width: 200,
                    sortable: false,
                    accessor: "dscObjeto"
                },
                {
                    Header: "Embarque",
                    accessor: "trayecto",
                    sortable: false,
                    minResizeWidth: 10,
                    width: 100,
                },
                {
                    Header: "Destino",
                    accessor: "trHasta",
                    sortable: false,
                    minResizeWidth: 10,
                    width: 100
                },
                {
                    Header: "Val Asegurado ($)",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "totAseActual",
                    width: 140,
                },
                {
                    Header: "Tasa",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "tasa",
                    width: 160,
                },
                {
                    Header: "Prima ($)",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "totPriActual",
                    width: 140
                },
                {
                    Header: "Observaciones",
                    minResizeWidth: 10,
                    sortable: false,
                    accessor: "obsObjeto"
                }
            ]
        }

    }

    render() {
        let {columns, row, query1, tipo} = this.state;
        let ramos = this.props.ramos;

        return (
            <Modal className="modal-xl mx-auto" isOpen={this.props.open}>
                <UqaiModalHeader toggle={() => {
                    this.closeModal();
                    this.setState({dependientes: []})
                }} title="Detalle Póliza - Objetos Asegurados"/>
                <ModalBody>
                    <div className="row">
                        <Contratante poliza={this.props.poliza} item={this.props.item} user={this.props.user}
                                     vida={this.props.vida} ramos={ramos} row={row}
                                     rowSize={this.state.list.length} objSize={this.state.dependientes.length}
                                     query1={query1} tipo={tipo} vista={this.state.vista}/>
                        <div className="col-lg-9">
                            <div className={"row"}>
                                <div className="table-responsive">
                                    <ReactTable
                                        noDataText={"No se han encontrado ítems"}
                                        previousText={"Anterior"}
                                        nextText={"Siguiente"}
                                        pageText={"Página"}
                                        rowsText={"filas"}
                                        ofText={"de"}
                                        columns={columns}
                                        getTdProps={(state, rowInfo) => {
                                            if (rowInfo && rowInfo.row) {
                                                return {
                                                    onClick: (e, handleOriginal) => {
                                                        this.getObjetos(rowInfo.original);
                                                        this.setState({selected: rowInfo.index, row: rowInfo.original});
                                                        if (handleOriginal) {
                                                            handleOriginal();
                                                        }
                                                    },
                                                    style: {
                                                        cursor: "pointer",
                                                        backgroundColor: rowInfo.index === this.state.selected ? '#00BCEA' : 'rgba(238,245,246,0.15)',
                                                        color: rowInfo.index === this.state.selected ? 'white' : 'black',
                                                        //height: 90,
                                                    }
                                                }
                                            } else {
                                                return []
                                            }
                                        }}
                                        manual
                                        data={this.state.list}
                                        pages={this.state.pages}
                                        loading={this.state.loading}
                                        defaultPageSize={5}
                                        className="-highlight"
                                        showPaginationTop
                                        showPaginationBottom={false}
                                        page={this.state.page}
                                        pageSize={this.state.pageSize}
                                        onPageChange={page => this.setState({page})}
                                        onPageSizeChange={(pageSize, page) =>
                                            this.setState({page, pageSize})}>
                                    </ReactTable>

                                </div>
                            </div>

                            <div className={"row my-2"}>
                                <h4>{"Extras"}</h4>
                                <div className="table-responsive">
                                    <table className="table table-borderless table-hover">
                                        <thead>
                                        <tr className="text-secondary">
                                            <th className="bg-white" scope="col">Item</th>
                                            <th className="bg-white" scope="col">Valor Asegurado($)</th>
                                            <th className="bg-white" scope="col">Tasa</th>
                                            <th className="bg-white" scope="col">Prima($)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.dependientes.length === 0 ?
                                            <React.Fragment>
                                                <tr>
                                                    <td colSpan={4}>
                                                    </td>
                                                </tr>
                                            </React.Fragment> :
                                            <React.Fragment>
                                                {this.state.dependientes.map((item, index) => (
                                                    <tr key={item.cdSubObjeto}
                                                        onClick={() => this.setState({obj: item})}>
                                                        <td>
                                                            <span>{item.dscSubobjeto}</span>
                                                        </td>
                                                        <td>
                                                            <span>{item.totAseActual}</span>
                                                        </td>
                                                        <td>
                                                            <span>{item.tasa}</span>
                                                        </td>
                                                        <td>
                                                            <span>{item.totPriActual}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}