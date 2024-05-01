import axios from "axios";
import {routes} from "../util/General";
import moment from "moment";


export const find_ciudades = () => {
    let key = 'ciudades';
    return new Promise(function (resolve, reject) {
        let value = from_cache_window(key);
        if (value == null) {
            axios.get(routes.api + '/ciudad').then(resp => {
                to_cache_window(key, resp.data.sort((a, b) => a.nmCiudad.localeCompare(b.nmCiudad)));
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const find_ramos = () => {
    let key = 'ramos';
    return new Promise(function (resolve, reject) {
        let value = from_cache_window(key);
        if (value == null) {
            axios.get(routes.api + '/ramo').then(resp => {
                to_cache_window(key, resp.data.sort((a, b) => a.nmRamo.localeCompare(b.nmRamo)));
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const find_ram_grupos = () => {
    let key = 'ramGrupos';
    return new Promise(function (resolve, reject) {
        let value = from_cache_window(key);
        if (value == null) {
            axios.get(routes.api + '/ramgrupos').then(resp => {
                to_cache_window(key, resp.data);
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const find_ramos_ramgrp = () => {
    let key = 'ramosRamGrp';
    return new Promise(function (resolve, reject) {
        let value = from_cache_window(key);
        if (value == null) {
            axios.get(routes.api + '/ramosramgrp').then(resp => {
                to_cache_window(key, resp.data);
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const find_companias = () => {
    let key = 'companias';
    return new Promise(function (resolve, reject) {
        let value = from_cache_window(key);
        if (value == null) {
            axios.get(routes.api + '/compania').then(resp => {
                to_cache_window(key, resp.data.sort((a, b) => a.nombre.localeCompare(b.nombre)));
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const find_aseguradoras = () => {
    let key = 'asegs';
    return new Promise(function (resolve, reject) {
        let value = from_cache_window(key);
        if (value == null) {
            axios.get(routes.api + '/aseguradora').then(resp => {
                to_cache_window(key, resp.data.sort((a, b) => a.nmAseguradora.localeCompare(b.nmAseguradora)));
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const find_aseg = (cdCotizacion) => {
    let key = 'aseg_' + cdCotizacion;
    return new Promise(function (resolve, reject) {
        let value = from_cache_window(key);
        if (value == null) {
            axios.get(routes.api + '/aseguradora/' + cdCotizacion).then(resp => {
                to_cache_window(key, resp.data);
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const find_sub_agentes = () => {
    let key = 'subagentes';
    return new Promise(function (resolve, reject) {
        let value = from_cache_window(key);
        if (value == null) {
            axios.get(routes.api + '/agentes').then(resp => {
                to_cache_window(key, resp.data);
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const find_sectores = (ciudad) => {
    let key = 'sectores_' + ciudad;
    return new Promise(function (resolve, reject) {
        let value = from_cache(key);
        if (value == null) {
            axios.get(routes.api + '/clisector/' + ciudad).then(resp => {
                to_cache(key, resp.data);
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const find_documents = () => {
    let key = 'documentos';
    return new Promise(function (resolve, reject) {
        let value = from_cache(key, 60);
        if (value == null) {
            axios.get(routes.apiapiAseg + '/docFv').then(resp => {
                to_cache(key, resp.data);
                resolve(resp.data);
            }).catch(error => {
                    reject(error);
                }
            );
        } else {
            resolve(value);
        }
    });
};

export const from_cache = (key, minutes = 120) => {
    let item = sessionStorage.getItem(key);
    minutes = minutes || 15;

    if (item == null) {
        return null;
    } else {
        try {
            item = JSON.parse(item);
            let now = moment(new Date()); //todays date
            let end = moment(item.fc); // another date
            let duration = moment.duration(now.diff(end));
            let diff = duration.asMinutes();
            if (diff >= minutes) {
                return null;
            }
            return item.value;
        } catch (e) {
            return null;
        }
    }
};

export const to_cache = (key, val) => {
    sessionStorage.setItem(key, JSON.stringify({value: val, fc: new Date()}));
};

export const from_cache_window = (key, minutes = 120) => {
    let storage = window.storage || {};
    window.storage = storage;
    let item = storage[key];

    if (item == null) {//no esta en storage ventana
        item = from_cache(key);
        if (item == null) { // no esta en local storage
            return null;
        } else { // si esta en local storage pero no en window
            to_cache_window(key, item); // pongo en window
            return item;
        }
    } else {
        try {
            let now = moment(new Date()); //todays date
            let end = moment(item.fc); // another date
            let duration = moment.duration(now.diff(end));
            let diff = duration.asMinutes();
            if (diff >= minutes) {
                return null;
            }
            return item.value;
        } catch (e) {
            return null;
        }
    }
};


export const to_cache_window = (key, val) => {
    let storage = window.storage || {};
    window.storage = storage;

    storage[key] = {value: val, fc: new Date()};

    to_cache(key, val);
};

export const clear_all_cache = () => {
    window.storage = null;
    sessionStorage.clear();
};