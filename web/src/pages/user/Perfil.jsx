import {
    Button,
    CardBody,
    CardHeader,
    Col,
    Form,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Modal,
    ModalBody,
    Row
} from "reactstrap";
import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {routes} from "../gen/UtilsGeneral";
import {DatosContratante} from "../gen/DatosContratante";
import {DatosAsegurado} from "../vam/DatosAsegurado";
import axios from "axios";
import UqaiFormik from "../../components/UqaiFormik";
import JedaiDropImg from "../../components/UqaiDropImg";
import {UqaiField} from "../../components/UqaiField";
import {getRandomF, image_profile_size} from "../../util/General";
import {useSearchParam} from "../../hooks/useLocation";
import {AvatarModal} from "./parts/AvatarModal";
import Alerts from "../../components/Alerts";
import {useCurrentModule} from "../../hooks/useModules";
import Pages from "../../layouts/Pages";
import {UqaiModalHeader} from "../../components/UqaiModal";
import {do_login} from "../sec/redux/actions";

export const Perfil = () => {

    const user = useSelector(state => state.user);
    const mod = useCurrentModule();
    const alert = useRef();
    const [rnd, setRnd] = useState(getRandomF());
    const [cliente, setCliente] = useState({});
    const [open, setOpen] = useState(false);
    const showPass = user.isEjecutivo;
    const dispatch = useDispatch()

    function onSubmit(newValues, actions) {
        let foto = newValues.foto;
        let formData = new FormData();
        newValues.foto = undefined;
        formData.append("foto", foto);

        axios.post(routes.api + "/user/" + newValues.id, formData).then(() => {
            alert.current.show_info('Guardado con éxito');
            setRnd(getRandomF());
            let usuario = JSON.parse(JSON.stringify(user));
            usuario.fcModifica = new Date();
            dispatch(do_login({...usuario}))
        }).catch(error => {
            alert.current.handle_error(error);
        }).then(() => actions.setSubmitting(false))
    }

    function handleModal() {
        setOpen(!open);
        setRnd(getRandomF());
    }

    return (<Pages title={"Perfil"}>
        <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
            <div className="container-fluid">
                <Alerts ref={alert}/>
                <div className={"card shadow"}>
                    <CardHeader className="d-flex align-items-center border-bottom border-primary">
                        <h5 className="my-0 fw-bold">Mi Perfil</h5>
                    </CardHeader>
                    <CardBody>
                        <p className="text-secondary fw-bold fs-5">
                            Datos del {mod === 'vam' ? 'Asegurado' : 'Contratante'}
                        </p>
                        <div className="container-fluid">
                            <div className={"row"}>
                                {mod === 'vam' && <DatosAsegurado/>}
                                {mod === 'gen' && <DatosContratante setCliente={setCliente} item={cliente}/>}
                                <div className={"col-md-4"}>
                                    <UqaiFormik initialValues={user} onSubmit={onSubmit}
                                                enableReinitialize={true} validateOnChange={false}>
                                        {({values, submitForm, dirty}) => (<>
                                            <Row>
                                                <div className="form-group col-lg-12">
                                                    <Label
                                                        className={"form-label fw-bold text-secondary fs-6"}>Fotografía</Label>
                                                    <UqaiField name="foto"
                                                               accept="image/png"
                                                               data={`${routes.api}/user/img/${values.id}?vrd=${rnd}`}
                                                               maxSize={image_profile_size}
                                                               className="col-md-9 px-0"
                                                               imgStyle={{maxHeight: "10rem"}}
                                                               component={JedaiDropImg}/>
                                                </div>
                                                <div className="form-group col-lg-12">

                                                    <button className={"btn btn-primary"}
                                                            onClick={handleModal}>
                                                        Seleccionar Avatar
                                                    </button>
                                                    <AvatarModal open={open}
                                                                 handleModal={handleModal} alert={alert}
                                                                 cdAdicional={values?.id}
                                                                 generarRamdom={() => setRnd(getRandomF())}/>
                                                    <br/>
                                                    {dirty && <Button color="primary" className="mb-3"
                                                                      onClick={submitForm}>Guardar Foto</Button>}
                                                </div>
                                            </Row>
                                        </>)}
                                    </UqaiFormik>
                                    <br/>
                                    {showPass && <CambiarPassword/>}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </div>
            </div>
        </section>
    </Pages>)
}

export const CambiarPassword = () => {

    const iris = useSearchParam('iris');
    const [open, setOpen] = useState(!!iris);
    const user = useSelector(state => state.user);
    const alert = React.useRef(null);

    const onRequestAuth = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        let body = {
            current: data.get('current'), passwd1: data.get('passwd1'), passwd2: data.get('passwd2'), id: user.id
        };

        axios.post(routes.api + '/usuario/cambiar', body).then(() => {
            alert.current.show_info("Su contraseña se ha cambiado con éxito.");
            setOpen(false)
        }).catch(error => {
            alert.current.handle_error(error);
        });
    }
    return <>
        <Alerts ref={alert}/>
        <Button color="primary" onClick={() => setOpen(true)}>
            <i className={"fa fa-key"}/> Cambiar Contraseña
        </Button>
        <Modal className="text-center modal-xl" isOpen={open} toggle={() => setOpen(false)}>

            <UqaiModalHeader toggle={() => setOpen(false)} title="Cambio de Contraseña"/>
            <Form onSubmit={onRequestAuth}>
                <ModalBody className={"pt-2 mb-3"}>
                    <Row>
                        <Col md={3}>
                        </Col>
                        <Col md={6}>
                            <div>
                                <InputGroup className={"input-group no-border form-control-lg"}>
                                    <div className={"input-group-prepend"}>
                                        <InputGroupText className={"input-group-text"}>
                                            <i className="icon-uqai uqai-check me-1"></i>
                                        </InputGroupText>
                                    </div>
                                    <Input className="form-control" type="password"
                                           placeholder="Contraseña actual" required
                                           name="current"/>
                                </InputGroup>

                                <InputGroup className={"input-group no-border form-control-lg"}>
                                    <div className={"input-group-prepend"}>
                                        <InputGroupText className={"input-group-text"}>
                                            <i className="icon-uqai uqai-contrasena me-1"></i>
                                        </InputGroupText>
                                    </div>
                                    <Input className="form-control" type="password"
                                           placeholder="Nueva Contraseña" required
                                           name="passwd1"/>
                                </InputGroup>

                                <InputGroup className={"input-group no-border form-control-lg"}>
                                    <div className={"input-group-prepend"}>
                                        <InputGroupText className={"input-group-text"}>
                                            <i className="icon-uqai uqai-contrasena me-1"></i>
                                        </InputGroupText>
                                    </div>
                                    <Input className="form-control" type="password"
                                           placeholder="Verificar contraseña" required
                                           name="passwd2"/>
                                </InputGroup>
                            </div>
                            <div className="text-center">
                                <Button color="primary" size="lg"
                                        className="mb-3">
                                    Guardar
                                </Button>
                            </div>
                        </Col>
                    </Row>

                </ModalBody>
            </Form>
        </Modal>
    </>
}