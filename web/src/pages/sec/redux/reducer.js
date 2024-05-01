import ACTIONS from './actions'

const loginReducer = (state = {username: null, id: null, menu: [], ap: '', nm: ''}, action) => {
    switch (action.type) {
        case ACTIONS.ON_LOGIN:
            return action.payload;
        case ACTIONS.ON_LOGOUT:
            return {username: null, id: null, menu: [], ap: '', nm: ''};
        default:
            return state;
    }
};

export default loginReducer;