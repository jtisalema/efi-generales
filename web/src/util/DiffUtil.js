import {detailedDiff, diff} from 'deep-object-diff';

export const hasChanged = (value, newValue) => {
    let changes = diff(value, newValue);
    return Object.keys(changes).length > 0;
};

const group_by = (list, prop) => {
    return list.reduce(function (groups, item) {
        const val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups
    }, {})
};

const get_updated_deleted = (value, modificados, id) => {
    let res = {deleted: [], update: []};

    // ordeno las listas por ID
    let modificadoSort = modificados.slice().sort((a, b) => a[id] < b[id]);
    let valueSort = value.slice().sort((a, b) => a[id] < b[id]);

    // determino los eliminados
    res.deleted = valueSort.slice(modificadoSort.length, (valueSort.length - modificadoSort.length));

    // ahora en (valueSort) estan ya solo los elementos modificados

    // comparo la lista original(sin eliminados) con la lista de modificados(sin eliminados, ni agregados)
    let diff = detailedDiff(valueSort, modificadoSort);

    Object.keys(diff.updated).forEach(v => {
        res.update.push(modificadoSort[v]);
    });

    return res;

};

export const diff_crud = (value, newValue, id, group = false) => {
    let res = {add: [], deleted: [], update: []};
    let modificados = [];

    newValue.forEach(v => {
        if (v[id] == null) {
            res.add.push(v);// compruebo los q tiene ID: null, significa q esos son los nuevos
        } else {
            modificados.push(v);// pongo solo los q no son nuevos
        }
    });

    // cuando los q se elimino en realidad fueron de la compania 2
    if (group) {
        let valueGrouped = group_by(value, group); // agrupo los valores originales por el KEY
        let modificadosGrouped = group_by(modificados, group);// agrupo los valores modificados (sin los nuevos) por el KEY
        let groups = [...Object.keys(valueGrouped), ...Object.keys(modificadosGrouped)];// calculo los valores unicos de KEY

        groups.forEach(v => {
            let resultado = get_updated_deleted(valueGrouped[v], modificadosGrouped[v], id);
            res.deleted = [...res.deleted, ...resultado.deleted];
            res.update = [...res.update, ...resultado.update];
        });

    } else {
        let resultado = get_updated_deleted(value, modificados, id);
        res.deleted = resultado.deleted;
        res.update = resultado.update;
    }

    return res;
};