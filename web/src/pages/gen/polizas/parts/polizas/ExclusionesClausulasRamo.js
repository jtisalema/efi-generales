import {Col, Container, Row, Table} from "reactstrap";
import React from "react";

export const ExclusionesClausulasRamo = ({exclusiones, exclusionesCobertura}) => {
    return (
        <Container className="text-center">
            <Row>
                <Col className={"table-responsive col-lg-12"}>
                    <Table className="table table-borderless table-hover">
                        <thead>
                        <tr className="text-secondary">
                            <th className="bg-white" scope="col">#</th>
                            <th className="bg-white" scope="col">Exclusión</th>
                            <th className="bg-white" scope="col">Observaciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {exclusiones?.map((item, index) => (
                            <tr key={item.cdExcNegocio}>
                                <td>
                                    <span>{index + 1}</span>
                                </td>
                                <td>
                                    <span>{item.dscExclusion}</span>
                                </td>
                                <td>
                                    <span>{item.obsExcNegocio}</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col className={"table-responsive col-lg-12"}>
                    <h4 className="font-weight-lighter text-left">Exclusiones - Cobertura</h4>
                    <Table className="table table-borderless table-hover">
                        <thead>
                        <tr className="text-secondary">
                            <th className="bg-white" scope="col">#</th>
                            <th className="bg-white" scope="col">Cobertura</th>
                            <th className="bg-white" scope="col">Exclusión</th>
                            <th className="bg-white" scope="col">Observaciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {exclusionesCobertura?.map((item, index) => (
                            <tr key={item.cdExcNegocio}>
                                <td>
                                    <span>{index + 1}</span>
                                </td>
                                <td>
                                    <span>{item.nmCobertura}</span>
                                </td>
                                <td>
                                    <span>{item.dscExclusion}</span>
                                </td>
                                <td>
                                    <span>{item.obsExcNegocio}</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}