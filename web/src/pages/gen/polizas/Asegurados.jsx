import React, {Component} from "react";
import {routes} from "../UtilsGeneral";
import axios from "axios";
import moment from "moment";
import "moment/locale/es"
import {Modal, ModalBody} from "reactstrap";
import {Contratante} from "./parts/Contratante";
import ReactTable from "react-table";
import {UqaiModalHeader} from "../../../components/UqaiModal";

export class Asegurados extends Component {

    constructor(props) {
        super(...arguments);
        this.alert = React.createRef();
        this.state = {
            list: [],
            dependientes: [],
            pages: -1,
            page: 0,
            loading: false,
            selected: -1,
            row: null,
            query1: {},
            subtotal: 0,
            titular: 0,
            titularF: 0,
            titularu: 0,
            vigente: 0,
            cantidad: 0

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
            } else {
                this.setState({item: {}});
            }
        }
    }

    fetchData() {
        let {item, poliza} = this.props;
        let query1 = {
            cdRamoCotizacion: item.cdRamoCotizacion,
            cdRamo: poliza.cdRamo,
            cdCompania: item.cdCompania,
            cdUbicacion: item.cdUbicacion,
            dscObjeto: '',
            cedulaO: '',
            page: 0,
            pageSize: 500,
            sorted: [],
        };
        axios.post(routes.api + '/polizas/subObjeto', query1).then(resp => {
            let list = resp.data;
            this.setState({list: list.content, query1: query1});

            let titular = 0;
            let titular1 = 0;
            let titularF = 0;
            {
                this.state.list.map((dato) => {
                        if (dato.cantidad === 0 && dato.exclusion === 0) {
                            titular = titular + 1;
                        } else if (dato.cantidad === 1 && dato.exclusion === 0) {
                            titular1 = titular1 + 1;
                        } else if (dato.cantidad > 1 && dato.exclusion === 0) {
                            titularF = titularF + 1;
                        }
                    }
                )
            }
            let vigente = 0;
            {
                this.state.list.map((dato) => {
                        if (dato.exclusion === 0) {
                            vigente = vigente + 1;
                        }
                    }
                )
            }
            let cantidad = this.state.list.length;
            let subtotal = titularF + titular1 + titular;
            this.setState({
                titular: titular,
                titularu: titular1,
                titularF: titularF,
                subtotal: subtotal,
                vigente: vigente,
                cantidad: cantidad
            })
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
        this.setState({list: []});
    };

    calcularEdad = (fecha) => {

        //dar formato a las fecha
        fecha = moment(fecha).locale('moment/locale/es').local().format("DD-MM-YYYY");

        let values = fecha.split("-");
        let dia = parseInt(values[0]);
        let mes = parseInt(values[1]);
        let ano = parseInt(values[2]);

        // cogemos los valores actuales
        let fecha_hoy = new Date();
        let ahora_ano = fecha_hoy.getYear();
        let ahora_mes = fecha_hoy.getMonth() + 1;
        let ahora_dia = fecha_hoy.getDate();

        // realizamos el calculo
        let edad = (ahora_ano + 1900) - ano;
        if (ahora_mes < mes) {
            edad--;
        }
        if ((mes === ahora_mes) && (ahora_dia < dia)) {
            edad--;
        }
        if (edad > 1900) {
            edad -= 1900;
        }

        // calculamos los meses
        let meses = 0;

        if (ahora_mes > mes && dia > ahora_dia)
            meses = ahora_mes - mes - 1;
        else if (ahora_mes > mes)
            meses = ahora_mes - mes;
        if (ahora_mes < mes && dia < ahora_dia)
            meses = 12 - (mes - ahora_mes);
        else if (ahora_mes < mes)
            meses = 12 - (mes - ahora_mes + 1);
        if (ahora_mes === mes && dia > ahora_dia)
            meses = 11;

        // calculamos los dias
        let dias = 0;
        if (ahora_dia > dia)
            dias = ahora_dia - dia;
        if (ahora_dia < dia) {
            let ultimoDiaMes = new Date(ahora_ano, ahora_mes - 1, 0);
            dias = ultimoDiaMes.getDate() - (dia - ahora_dia);
        }

        return edad + "a " + meses + "m " + dias + "d";
    };


    render() {
        let {row, dependientes, query1} = this.state;
        let ramos = this.props.ramos;
        return (
            <Modal className="modal-xl mx-auto" isOpen={this.props.open}>
                <UqaiModalHeader toggle={() => {
                    this.closeModal();
                    this.setState({dependientes: []})
                }} title="Detalle Póliza"/>
                <ModalBody>
                    <div className="row">
                        <Contratante poliza={this.props.poliza} item={this.props.item} user={this.props.user}
                                     vida={this.props.vida} ramos={ramos} row={row} rowSize={this.state.list.length}
                                     objSize={dependientes.length} query1={query1} tipo={0} vista={true}
                                     titular={this.state.titular}
                                     titularu={this.state.titularu} titularF={this.state.titularF}
                                     vigente={this.state.vigente} subtotal={this.state.subtotal}
                                     cantidad={this.state.cantidad}/>
                        <div className="col-lg-9">
                            <div className={"row"}>
                                <div className="table-responsive table-sm">
                                    <br/>
                                    <ReactTable
                                        noDataText={"No se han encontrado pólizas"}
                                        previousText={"Anterior"}
                                        nextText={"Siguiente"}
                                        pageText={"Página"}
                                        rowsText={"filas"}
                                        ofText={"de"}

                                        columns={[
                                            {
                                                Header: "Item",
                                                width: 50,
                                                sortable: false,
                                                accessor: "item",
                                            },
                                            {
                                                Header: "Cédula",
                                                sortable: false,
                                                accessor: "cedulaO",
                                            },
                                            {
                                                Header: "Apellidos y Nombres",
                                                width: 250,
                                                sortable: false,
                                                accessor: "dscObjeto",
                                            },
                                            {
                                                id: "fcDesde",
                                                Header: "Fc Nacimiento",
                                                minwidth: 140,
                                                sortable: false,
                                                accessor: d => {
                                                    return moment(d.fcDesde).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                }
                                            },
                                            {
                                                id: "fcNacimiento",
                                                Header: "Edad",
                                                sortable: false,
                                                accessor: f => {
                                                    return this.calcularEdad(f.fcNacimiento)
                                                }
                                            },
                                            {
                                                id: "cantidad",
                                                Header: "Forma Prima",
                                                width: 120,
                                                sortable: false,
                                                accessor: d => {
                                                    return (d.cantidad === 0 ? 'Titular Solo' : (d.cantidad === 1 ? 'Titular mas uno' : 'Titular mas Familia'))
                                                }
                                            },
                                            {
                                                id: "totPriActual",
                                                Header: "Prima",
                                                sortable: false,
                                                accessor: p => {
                                                    return p.totPriActual ? p.totPriActual : "-"
                                                },
                                            }, {
                                                id: "inclusion",
                                                Header: "Inclusión",
                                                Width: 40,
                                                // minwidth: 140,
                                                sortable: false,
                                                accessor: d => {
                                                    return (d.inclusion) ? 'SI' : 'NO'
                                                }
                                            },
                                            {
                                                id: "exclusion",
                                                Header: "Exclusión",
                                                Width: 40,
                                                // minwidth: 140,
                                                sortable: false,
                                                accessor: d => {
                                                    return (d.exclusion) ? 'SI' : 'NO'
                                                }
                                            },
                                            {
                                                id: "fcInicio",
                                                Header: "Fc Desde",
                                                minResizeWidth: 50,
                                                // minwidth: 140,
                                                sortable: false,
                                                accessor: d => {
                                                    return moment(d.fcInicio).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                }
                                            },
                                            {
                                                id: "fcFin",
                                                Header: "Fc Hasta",
                                                minResizeWidth: 50,
                                                // minwidth: 140,
                                                sortable: false,
                                                accessor: d => {
                                                    return moment(d.fcFin).locale('moment/locale/es').local().format("DD/MM/YYYY")
                                                }
                                            }

                                        ]}
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
                                                        fontSize: 11
                                                    }
                                                }
                                            } else {
                                                return []
                                            }

                                        }}
                                        data={this.state.list}
                                        loading={this.state.loading}
                                        defaultPageSize={10}
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
                            <div className={"container text-justify my-3"}>
                                <span className="form-label fw-bold text-secondary fs-6">No. Personas:</span>
                                <span className="text-verde option mx-2 me-3">{this.state.list.length}</span>
                                <span className="form-label fw-bold text-secondary fs-6">No. Personas Vigentes:</span>
                                <span className="text-verde option mx-2 me-3">{this.state.vigente}</span>
                                <br/>
                                <span className="form-label fw-bold text-secondary fs-6">Titular Solo:</span>
                                <span className="text-verde option mx-2 me-3">{this.state.titular}</span>
                                <span className="form-label fw-bold text-secondary fs-6">Titular más Uno:</span>
                                <span className="text-verde option mx-2 me-3">{this.state.titularu}</span>
                                <span className="form-label fw-bold text-secondary fs-6">Titular más Familia:</span>
                                <span className="text-verde option mx-2 me-3">{this.state.titularF}</span>
                                <span className="form-label fw-bold text-secondary fs-6">Subtotal:</span>
                                <span className="text-verde option mx-2 me-3">{this.state.subtotal}</span>
                            </div>
                            <div className={"row"}>
                                <h4 className="font-weight-lighter text-left">{"Dependientes"}</h4>
                                <div className="table-responsive">
                                    <table className="table table-borderless table-hover">
                                        <thead>
                                        <tr className="text-secondary">
                                            <th className="bg-white" scope="col" style={{color: "#9a9a9a"}}>Item</th>
                                            <th className="bg-white" scope="col" style={{color: "#9a9a9a"}}>Deducible
                                            </th>
                                            <th className="bg-white" scope="col" style={{color: "#9a9a9a"}}>Cédula</th>
                                            <th className="bg-white" scope="col"
                                                style={{color: "#9a9a9a"}}>Dependiente/Beneficiario
                                            </th>
                                            <th className="bg-white" scope="col" style={{color: "#9a9a9a"}}>Fc
                                                Nacimiento
                                            </th>
                                            <th className="bg-white" scope="col" style={{color: "#9a9a9a"}}>Edad</th>
                                            <th className="bg-white" scope="col"
                                                style={{color: "#9a9a9a"}}>Parentesco/Relación
                                            </th>
                                            <th className="bg-white" scope="col" style={{color: "#9a9a9a"}}>%Ben(Vida)
                                            </th>
                                            <th className="bg-white" scope="col" style={{color: "#9a9a9a"}}>Activo</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dependientes.length === 0 ?
                                            <React.Fragment>
                                                <tr>
                                                </tr>
                                            </React.Fragment> :
                                            <React.Fragment>
                                                {dependientes.map((item, index) => (
                                                    <tr key={item.cdSubObjeto}>
                                                        <td style={{fontSize: 11}}>
                                                            <span>{index + 1}</span>
                                                        </td>

                                                        <td style={{fontSize: 11}}>
                                                            <span>{item.deducible}</span>
                                                        </td>
                                                        <td style={{fontSize: 11}}>
                                                            <span>{item.cedulaS}</span>
                                                        </td>
                                                        <td style={{fontSize: 11}}>
                                                            <span>{item.dscSubobjeto}</span>
                                                        </td>
                                                        <td style={{fontSize: 11}}>
                                                            <span>{moment(item.fcNacimiento).local().format("DD/MM/YYYY")}</span>
                                                        </td>
                                                        <td style={{fontSize: 11}}>
                                                            <span>{this.calcularEdad(item.fcNacimiento)}</span>
                                                        </td>
                                                        <td style={{fontSize: 11}}>
                                                            <span>{item.obsSubobjeto}</span>
                                                        </td>
                                                        <td style={{fontSize: 11}}>
                                                            <span>{item.beneficio}</span>
                                                        </td>
                                                        <td style={{fontSize: 11}}>
                                                            <span>{item.activo ? "SI" : "NO"}</span>
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