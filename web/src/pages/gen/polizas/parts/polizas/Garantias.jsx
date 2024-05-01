import {Col, Container, Row, Table} from "reactstrap";
import React from "react";
import {JedaiCalendarioViewText} from "../../../../../components/UqaiCalendario";

export const Garantias = ({garantias}) => {
    return (
        <Container className="text-center">
            <Row>
                <Col className={"table-responsive col-lg-12"}>
                    <React.Fragment>
                        <Table className="table table-borderless table-hover">
                            <thead>
                            <tr className="text-secondary">
                                <th className="bg-white" scope="col">Item</th>
                                <th className="bg-white" scope="col">Descripción</th>
                                <th className="bg-white" scope="col">Fc Efec Cump</th>
                                <th className="bg-white" scope="col">Fc Max Cond</th>
                                <th className="bg-white" scope="col">Observaciones</th>
                                <th className="bg-white" scope="col">Activo</th>
                            </tr>
                            </thead>
                            <tbody>
                            {garantias.length === 0 ?
                                <React.Fragment>
                                    <tr>
                                        <td colSpan={4}>
                                        </td>
                                    </tr>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {garantias.map((item, index) => (
                                        <tr key={item.cdDeducible}>
                                            <td>
                                                <span>{index + 1}</span>
                                            </td>
                                            <td className="text-center" style={{maxWidth: 220}}>
                                                <span>{item.nmGarantia}</span>
                                            </td>
                                            <td className="text-center" style={{maxWidth: 120}}>
                                                <JedaiCalendarioViewText value={item.fcEfecCumplimiento}/>
                                            </td>
                                            <td className="text-center" style={{maxWidth: 120}}>
                                                <JedaiCalendarioViewText value={item.fcMaxCondicionada}/>
                                            </td>
                                            <td className="text-left" style={{maxWidth: 180}}>
                                                <span>{item.obsGarantiaNegocio}</span>
                                            </td>
                                            <td className="text-center" style={{maxWidth: 180}}>
                                                <span>{item.activo ? "SI" : "NO"}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            }
                            </tbody>
                        </Table>
                    </React.Fragment>
                </Col>
            </Row>
        </Container>
    );
}