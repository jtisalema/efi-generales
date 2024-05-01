import Alerts from "../../../../components/Alerts";
import React, {useEffect, useState} from "react";
import {Col, Container, Row, Table} from "reactstrap";
import axios from "axios";
import {routes} from "../../UtilsVam";
import {CustomNumberFormat} from "../../../../components/CustomNumberFormat";
import moment from "moment/moment";

export const NotasCobranza = ({alert, cdCompania, cdIncSiniestro}) => {
    const [nota, setNota] = useState({});
    const exist = nota?.cdCredHospital;
    useEffect(() => {
        getNota(cdCompania, cdIncSiniestro)
    }, [cdCompania, cdIncSiniestro])

    const getNota = (cdCompania, cdIncSiniestro) => {
        axios.get(routes.api + '/siniestro/nota-cobranza', {
            params: {cdCompania, cdIncSiniestro}
        }).then(resp => {
            setNota(resp.data);
        }).catch(error => {
                alert.handle_error(error);
            }
        );
    };

    return (
        <div>
            <Alerts ref={alert}/>
            <Container>
                {exist ?
                    <CardNotaCobranza item={nota}/> :
                    <h4 className={"my-4"}>{"Sin nota de cobranza"}</h4>}
            </Container>
        </div>
    )
}
const formatDate = (date) => {
    return date ? moment(date).locale('moment/locale/es').local().format("DD/MM/YYYY") : ""
}
export const CardNotaCobranza = ({item}) => {
    return (
        <div>
            <Row>
                <ViewTable title={"Nota Cobranza"} item={{
                    "Val Incurrido": <CustomNumberFormat value={item?.valIncurrido ?? 0}/>,
                    "Val NO Cubierto": <CustomNumberFormat value={item?.valNoCubierto ?? 0}/>,
                    "Deducible": <CustomNumberFormat value={item?.valDeducible ?? 0}/>,
                    "Coaseguro": <CustomNumberFormat value={item?.valCoaseguro ?? 0}/>,
                    "Valor NC": <CustomNumberFormat value={item?.valNotaCob ?? 0}/>,
                    "No.Nota Cob.": item?.notaCobranza,
                    "Fc Vence": formatDate(item?.fcVence),
                    "Tansferencia/Cheque a favor de:(Datos bancarios)": item?.chequeA
                }}/>
            </Row>
            <Row>
                <ViewTable title={"Liquidación Nota de Cobranza"} item={{
                    "Forma Pago": item?.formaPago,
                    "Banco": item?.banco,
                    "No.Cuenta": item?.ctaCte,
                    "No.Cheque": item?.cheque,
                    "Valor Pago": <CustomNumberFormat value={item?.valPago ?? 0}/>,
                    "Fc Pago": formatDate(item?.fcPago),
                    "Saldo": <CustomNumberFormat value={item?.valSaldo ?? 0}/>,
                    "Liq.": (item?.liquida === null || Number(item?.liquida) === 0) ? "No" : "Si"
                }
                }/>
            </Row>
        </div>
    )
}

export const ViewTable = ({title, item}) => {
    const keys = Object.keys(item);
    return (
        <Col md={12} className={"py-3"}>
            <h5 className={"text-left"}>{title}</h5>
            <Table className="adjusttd text-center">
                <thead className={"text-primary text-center"}>
                <tr>
                    {keys.map(key => (
                        <th key={key}>{key}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                <tr>
                    {keys.map(val => (
                        <td key={val}>
                            {item[val]}
                        </td>
                    ))}
                </tr>
                </tbody>
            </Table>
        </Col>
    )
}