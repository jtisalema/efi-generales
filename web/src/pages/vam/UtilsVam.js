import {api_url} from "../../util/General";

export const routes = {
    root: api_url(),
    base: api_url() + '/vam',
    api: api_url() + '/vam',
    gen: api_url() + '/gen'
};

export const app = {
    name: "Asistencia Médica"
};