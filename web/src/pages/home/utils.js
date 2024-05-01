import {MSM_REQUIRED} from "../../util/General";
import * as yup from "yup";

export const ListTipos = {
    IMAGEN: {value: 'IMAGEN', label: 'Imagen'},
    VIDEO: {value: 'VIDEO', label: 'Video'}
};
export const ListTiposNotificacion = [
    {value: 'SINIESTRO_CREADO', label: 'Creación de siniestro', name: 'nuevo'},
    {value: 'CAMBIO_ESTADO', label: 'Cambio de estado siniestro', name: 'cambio'},
    {value: 'RECETA_CADUCAR', label: 'Receta próxima a caducar', name: 'receta'},
    {value: 'SINIESTRO_CADUCIDAD', label: 'Estado de caducidad del siniestro', name: 'siniestro-caducidad'},
];

export const searchTpNotificacion = id => {
    return ListTiposNotificacion.find(x => x.name === id).value ?? '';
};

export const v_home = yup.object().shape({
    tipo: yup.string().required(MSM_REQUIRED),
    url: yup.string().required(MSM_REQUIRED).url('Ingrese una URL válida'),
    urlTemplate: yup.string().required(MSM_REQUIRED).url('Ingrese una URL válida'),
    templates: yup.array(yup.object().shape({
        tipo: yup.string().required(MSM_REQUIRED),
        idTemplate: yup.string().required(MSM_REQUIRED),
    })),
});

export const getDefaultHome = () => {
    return {
        tipo: Object.values(ListTipos)[0].value,
        url: '',
        urlTemplate: '',
        templates: [],
        sendWhatsapp: false,
        sendSms: false,
    }
}