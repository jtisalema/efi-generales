import React, {Component} from 'react';
import axios from 'axios';
import {connect} from "react-redux";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Col,
    Form,
    Input,
    InputGroup,
    InputGroupText,
    Row
} from "reactstrap";
import Alerts from "../../components/Alerts";
import {routes} from "../../util/General";

class CambiarPass extends Component {

    constructor(props) {
        super(props);
        this.alert = React.createRef();

        this.state = {}
    }

    onRequestAuth(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        // envio de peticion

        let body = {
            current: data.get('current'),
            passwd1: data.get('passwd1'),
            passwd2: data.get('passwd2'),
            id: this.props.user.id
        };

        axios.post(routes.api + '/usuario/cambiar', body).then(() => {
            this.setState({});
            this.alert.current.show_info("Su contraseña se ha cambiado con éxito.");
            setTimeout(() => {
                this.props.history.replace('/');
            }, 2500);
        }).catch(error => {
                this.alert.current.handle_error(error);
            }
        );
    }

    render() {
        return (
            <div className="content">
                <Alerts ref={this.alert}/>
                <Row>
                    <Col md={12} className="ml-auto mr-auto">
                        <Card className={"card-login text-center"}>
                            <CardHeader>
                                <CardTitle className="text-center" tag="h4">Cambiar Contraseña</CardTitle>
                            </CardHeader>
                            <Form onSubmit={this.onRequestAuth.bind(this)}>
                                <CardBody>
                                    <Row>
                                        <Col md={3}>
                                        </Col>
                                        <Col md={6}>
                                            <div>
                                                <InputGroup className={"input-group no-border form-control-lg"}>
                                                    <InputGroupText className={"input-group-text"}>
                                                        <i className="now-ui-icons objects_key-25"/>
                                                    </InputGroupText>
                                                    <Input className="form-control" type="password"
                                                           placeholder="Contraseña actual" required
                                                           name="current"/>
                                                </InputGroup>

                                                <InputGroup className={"input-group no-border form-control-lg"}>
                                                    <InputGroupText className={"input-group-text"}>
                                                        <i className="now-ui-icons ui-1_lock-circle-open"/>
                                                    </InputGroupText>
                                                    <Input className="form-control" type="password"
                                                           placeholder="Nueva Contraseña" required
                                                           name="passwd1"/>
                                                </InputGroup>

                                                <InputGroup className={"input-group no-border form-control-lg"}>
                                                    <InputGroupText className={"input-group-text"}>
                                                        <i className="now-ui-icons ui-1_lock-circle-open"/>
                                                    </InputGroupText>
                                                    <Input className="form-control" type="password"
                                                           placeholder="Verificar contraseña" required
                                                           name="passwd2"/>
                                                </InputGroup>
                                            </div>

                                            <CardFooter>
                                                <div className="text-center">
                                                    <Button color="primary" size="lg" className="mb-3">
                                                        Enviar
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Form>
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(
    mapStateToProps,
)(CambiarPass);

