export const NoDataResult = ({first}) => {
    if (first) return null;

    return <p>No se han encontrado resultados</p>
}