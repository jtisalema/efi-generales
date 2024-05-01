import React, {Component} from "react";
import {Col, Container} from "reactstrap";
import ReactNumeric from "../../../../components/ReactNumeric/ReactNumeric";

export class Deducibles extends Component {

    constructor(props) {
        super(...arguments);
    }

    render() {
        let {saldo, desc, total} = this.props.deducible;
        let space = this.props.space;
        let mensaje = '';
        let percent = 100 - (saldo / total * 100);
        percent = percent.toFixed(2);

        if (total < -1) {
            mensaje = `Deducible año poliza no definido correctamente!`;
        } else if (total < 0) {
            mensaje = `No se encuentra deducible año poliza.`;
        } else {
            if (saldo < 1) {
                mensaje = `Tu deducible de $${total} por ${desc} ha sido cubierto en su totalidad`;
            } else if (saldo === total) {
                mensaje = `Todavía no has cubierto tu deducible de $${total} por ${desc}`;
            } else {
                mensaje = `Te falta $${saldo} para terminar de cubrir tu deducible $${total} por ${desc}`;
            }
        }

        return (
            <Container className="text-center m-auto">
                {!space && <>
                    <br/>
                    <br/>
                    <Col sm={6}/>
                </>}
                <Col className="m-auto" sm={!space ? 6 : 12}>
                    <strong>{mensaje}</strong>
                    <br/>
                    {total > 0 &&

                        <div className="d-flex">
                            <span>$0.00 </span>
                            <div className="w3-light-grey flex-grow-1 mx-1">
                                <div className="w3-container w3-green text-center"
                                     style={{width: percent + '%'}}>{percent}%
                                </div>
                            </div>
                            <span>$</span>
                            <span><ReactNumeric valuex={total} readOnly disabled
                                                className="form-control deducible"/> </span>
                        </div>}

                    <br/>
                </Col>

            </Container>
        )
    }
}