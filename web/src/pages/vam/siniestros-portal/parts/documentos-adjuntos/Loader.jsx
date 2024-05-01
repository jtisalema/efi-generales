import {CardGeneral} from "../../../../../components/card/CardGeneral";

export const Loader = ({message = "Cargando"}) => {
    return (
        <CardGeneral>
            <div className={"d-flex h-100 w-100 justify-content-center align-items-center"}>
                <h2 className={"text-secondary"}>
                    {message}&nbsp;<i className={"icon-uqai uqai-carga icon-uqai-is-spinning"}/>
                </h2>
            </div>
        </CardGeneral>
    )
}