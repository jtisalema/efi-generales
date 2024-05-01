import React, {Component} from 'react';
import axios from "axios";
import {filterCaseInsensitive, routes} from "../../util/General";
import Alerts from "../../components/Alerts";
import ReactTable from "react-table";
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Row} from "reactstrap";
import {connect} from "react-redux";
import {Activo} from "../gen/polizas/parts/LookupNames";
import UqaiFormik from "../../components/UqaiFormik";
import {Form} from "formik";
import {UqaiField} from "../../components/UqaiField"

class index extends Component {

    constructor() {
        super(...arguments);
        this.alert = React.createRef();
        this.form = React.createRef();
        this.state = {
            usuarios: [],
            pages: 0,
            loading: false,
            query: {
                page: 0,
                pageSize: 1000,
                sorted: null,
                filtered: null,
                tipo: "BRK_T_ASEGURADOS_VAM_WEB" // just for make a commit
            }
        }
    };

    componentDidMount() {
    }

    onSubmit = (newValues, {setSubmitting}) => {
        setSubmitting(true);
        axios.post(routes.api + '/users', newValues).then(response => {
            let item = response.data.content;
            this.setState({usuarios: item});
            setSubmitting(false);
        }).catch(error => {
                this.alert.current.handle_error(error);
            }
        );
    };

    render() {
        return (
            <div className="content">
                <Alerts ref={this.alert}/>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center" tag="h4">Usuarios</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Container>
                                    <Row>
                                        <UqaiFormik initialValues={this.state.query} onSubmit={this.onSubmit}
                                                    enableReinitialize={true} validateOnChange={false}>
                                            {({setFieldValue, submitForm, isSubmitting}) => (
                                                <Form>
                                                    <React.Fragment>
                                                        <Row className="mb-3">
                                                            <Col xs={4}>
                                                                <label>Selecione Tipo de Usuarios:</label>
                                                            </Col>
                                                            <Col xs={6}>
                                                                <UqaiField name="tipo" component="select"
                                                                           className="form-control"
                                                                           onChange={(e) => {
                                                                              setFieldValue("tipo", e.target.value);
                                                                          }}>
                                                                    <option value="BRK_T_CLIENTES_WEB"
                                                                            label="GENERALES"/>
                                                                    <option value="BRK_T_ASEGURADOS_VAM_WEB"
                                                                            label="VAM"/>
                                                                </UqaiField>
                                                            </Col>
                                                            <Col>
                                                                <Button color="primary" disabled={isSubmitting}
                                                                        onClick={submitForm}>
                                                                    Buscar
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </React.Fragment>
                                                    <Row>
                                                        <Col md={12}>
                                                            {/*<Button color="primary"*/}
                                                            {/*        className={"mx-2"} onClick={submitForm}>*/}
                                                            {/*    Buscar*/}
                                                            {/*</Button>*/}
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            )}
                                        </UqaiFormik>
                                    </Row>
                                    {this.state.usuarios.length > 0 &&
                                    <Row>
                                        <Col>
                                            <ReactTable
                                                noDataText={"No hay datos..."}
                                                loadingText={"Cargando..."}
                                                rowsText={"filas"}
                                                ofText={"de"}
                                                previousText={"Anterior"}
                                                nextText={"Siguiente"}
                                                pageText={"Página"}
                                                columns={[
                                                    {
                                                        Header: "N.",
                                                        accessor: 'id',
                                                        Cell: row => {
                                                            return <div>{row.index + 1}</div>;
                                                        },
                                                        width: 40,
                                                        hideFilter: true,
                                                        filterable: false
                                                    },
                                                    {
                                                        Header: "Nombre",
                                                        sortable: false,
                                                        accessor: "nmAsegurado",
                                                    },
                                                    {
                                                        Header: "Apellido",
                                                        sortable: false,
                                                        accessor: "apAsegurado",
                                                    },
                                                    {
                                                        Header: "Correo",
                                                        sortable: false,
                                                        accessor: "usuario", filterable: true,
                                                    },
                                                    {
                                                        Header: "Activo",
                                                        sortable: false,
                                                        accessor: "activo",
                                                        filterable: false,
                                                        Cell: props => <Activo valor={props.value}/>
                                                    }
                                                ]}
                                                data={this.state.usuarios}
                                                loading={this.state.loading}
                                                defaultPageSize={20}
                                                filterable defaultFilterMethod={filterCaseInsensitive}
                                                className="-striped -highlight">
                                            </ReactTable>
                                        </Col>
                                    </Row>}
                                </Container>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(
    mapStateToProps,
)(index);