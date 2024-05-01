export const api_url = () => {
    let protocol = window.location.protocol + '//';
    window.prod = false;
    let hostname = window.location.hostname;
    if (hostname.includes('ui.localhost')) {
        return 'https://ss.jedai.group/efi';
    } else if (hostname.includes('localhost')) {
        return 'http://localhost:8080/efi';
    } else {
        window.prod = !hostname.includes('jedai');
        return protocol + window.location.hostname + '/efi';
    }
};

export const REQUERIDO = 'Campo requerido.';
export const routes = {
    base: api_url() + '/gen',
    api: api_url() + '/gen',
    root: api_url()
};

export const app = {
    name: "Asistencia Médica",
    prod: window.prod
};

export const image_profile_size = 300 * 1024; // 300KB
export const image_file_size = 5 * 1024 * 1024; // 5MB
export const MSM_REQUIRED = 'Campo requerido';

export const pos = (text, pattern) => {
    return text.indexOf(pattern);
};

export const isMobile = () => {
    try {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    } catch (e) {
        return false;
    }
};

export const filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    return (
        row[id] ?
            slugify(String(row[id].toLowerCase())).indexOf(slugify(filter.value.toLowerCase())) >= 0
            :
            true
    );
};

const slugify = (str) => {
    let map = {
        '-': '',
        'a': 'á|à|ã|â|À|Á|Ã|Â',
        'e': 'é|è|ê|É|È|Ê',
        'i': 'í|ì|î|Í|Ì|Î',
        'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
        'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        'c': 'ç|Ç',
        'n': 'ñ|Ñ'
    };

    str = str.toLowerCase();

    for (let pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    }

    return str;
};

export const getRandom = () => {
    return Math.floor(Math.random() * (17 - 1)) + 1;
}

export const getRandomF = () => {
    return Math.floor(Math.random() * (1000 - 1)) + 1;
}

export const metricasGoogle = (user, name, categoria, label) => {
    if (app.prod && (user.isAdmin === false) && (user.isEjecutivo === false)) {
        window.gtag("event", name, {
            "event_category": categoria,
            "event_label": label,
            'user_id': user.id,
            'user_ci': user.cedula ? user.cedula : ""
        });

    }
}

const sessionStorageFallback = {
    setItem(key, value) {
        window['ss_' + key] = value;
    },
    getItem(key) {
        return window['ss_' + key];
    }
}
export const storeInSession = (key, val) => {
    const storage = sessionStorage || sessionStorageFallback;
    storage.setItem(key, val);
}

export const getFromSession = (key) => {
    const storage = sessionStorage || sessionStorageFallback;
    return storage.getItem(key);
}