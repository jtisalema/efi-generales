import {useLocation} from 'react-router-dom';

export const getSearchParam = (parameter = '', location = {}) => {
    const params = new URLSearchParams(location.search);

    return params.get(parameter) || null;
};

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that gets
 * a search parameter from a URL and calls a provided setter function with
 * the corresponding value.
 *
 * @kind function
 *
 * @param {Object} parameter name

 */
export const useSearchParam = parameter => {
    const location = useLocation();
    return getSearchParam(parameter, location);
};