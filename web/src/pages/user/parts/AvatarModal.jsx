import {useFormikContext} from "formik";
import {Modal, ModalBody, ModalFooter} from "reactstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {routes} from "../../../util/General";
import {UqaiModalHeader} from "../../../components/UqaiModal";
import {do_login} from "../../sec/redux/actions";
import {useDispatch, useSelector} from "react-redux";


export const AvatarModal = ({open, handleModal, alert, cdAdicional, generarRamdom}) => {
    const [list, setList] = useState([]);
    const [actual, setActual] = useState('');
    const {setFieldValue} = useFormikContext();
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    useEffect(() => {
        if (open) {
            deleteTmp();
            getAvatars();
        }
    }, [open, cdAdicional]);

    const getAvatars = () => {
        axios.get(routes.api + '/user/avatars').then(resp => {
            let list = resp.data;
            let newList = list?.map(x => ({name: x, style: 'img-avatar'}));
            setList(newList);
        }).catch(error => {
            alert.current.handle_error(error);
        });
    }

    const deleteTmp = () => {
        setFieldValue('foto', undefined)
    }

    const saveAvatar = () => {
        axios.post(routes.api + '/user/avatar-save', {}, {
            params: {
                cdAdicional,
                avatar: actual
            }
        }).then(() => {
            alert.current.show_info('Guardado con éxito');
            generarRamdom();
            handleModal();
            let usuario = JSON.parse(JSON.stringify(user));
            usuario.fcModifica = new Date();
            dispatch(do_login({...usuario}))
        }).catch(error => {
                alert.current.handle_error(error);
            }
        );
    }

    const setFoto = (imagen) => {
        deleteTmp();
        let act = actual;
        setActual(imagen);

        let newList = list.map(x => {
            let avatarClass = (act === imagen) ? 'img-avatar' : 'img-no-select';
            if (act === imagen) {//desmarca
                setActual('');
            }
            return {name: x.name, style: x.name === imagen ? 'img-select' : avatarClass}
        })
        setList(newList);
    }

    return (
        <Modal className="text-center modal-xl mx-auto" isOpen={open}>
            <UqaiModalHeader toggle={handleModal} title="Seleccionar Avatar"/>
            <ModalBody>
                <div className={"container"}>
                    <div className={"row"}>
                        <div className={"col-md-12"}>
                            {(list || []).map((img) => (
                                <ViewImg image={img} setFoto={setFoto} key={img.name}/>
                            ))}
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className="d-flex justify-content-center gap-2">
                <button className={"btn btn-primary"} disabled={actual === ''}
                        onClick={saveAvatar}>Guardar
                </button>
            </ModalFooter>
        </Modal>
    )
}

const ViewImg = ({image, setFoto}) => {
    const data = `${routes.api}/user/avatar/${image?.name}`;

    return (
        <img className={image.style} src={data} alt={"Avatar " + image?.name}
             onClick={() => setFoto(image?.name)} id={image?.name}/>
    )

}