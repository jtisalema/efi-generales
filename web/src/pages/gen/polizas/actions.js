export const COTI_A = {
    ON_SELECT: 'COTI_EDIT_SELECT'
};

export default COTI_A;

export const on_select = content => {
    return {
        type: COTI_A.ON_SELECT,
        payload: content
    }
};