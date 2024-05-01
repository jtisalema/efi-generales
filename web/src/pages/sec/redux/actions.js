const ACTIONS = {
    ON_AUTH: 'ON_AUTH',
    ON_LOGIN: 'ON_LOGIN',
    ON_LOGOUT: 'ON_LOGOUT',
};

export default ACTIONS;

export const do_auth = content => {
    return {
        type: ACTIONS.ON_AUTH,
        payload: content
    }
};

export const do_login = content => {
    return {
        type: ACTIONS.ON_LOGIN,
        payload: content
    }
};

export const do_logout = () => {
    return {
        type: ACTIONS.ON_LOGOUT,
        payload: null
    }
};