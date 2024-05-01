import {Col, Container, Row, Table} from "reactstrap";
import React from "react";

export const Beneficiario = ({beneficiario}) => {
    return (
        <Container className="text-center">
            <Row>
                <Col className={"table-responsive col-lg-12"}>
                    <Table className="table table-borderless table-hover">
                        <thead>
                        <tr className="text-secondary">
                            <th className="bg-white" scope="col">Item</th>
                            <th className="bg-white" scope="col">Beneficiario</th>
                        </tr>
                        </thead>
                        <tbody>
                        {beneficiario.length === 0 ?
                            <React.Fragment>
                                <tr>
                                    <td colSpan={4}>
                                    </td>
                                </tr>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                {beneficiario.map((item, index) => (
                                    <tr key={item}>
                                        <td>
                                            <span>{index + 1}</span>
                                        </td>
                                        <td>
                                            <span>{item}</span>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}