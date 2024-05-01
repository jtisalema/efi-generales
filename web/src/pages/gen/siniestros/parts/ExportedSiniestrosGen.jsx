import {FiltrosSiniestros} from "../../../../components/FiltrosSiniestros";
import {ENDPOINT_GEN} from "../../../../constants/modules.constant";
import {useSelector} from "react-redux";

export const ExportedSiniestrosGen = () => {

    const user = useSelector(state => state.user);

    const moduleEndpoints = ENDPOINT_GEN;
    const userIdentificationModule = user.cdCliente;
    const newSiniestro = "/gen/reportar-siniestro/new/new";
    const searchSiniestro = "/gen/reportar-siniestro"

    return (
        <FiltrosSiniestros moduleEndpoints={moduleEndpoints}
                           userIdentificationModule={userIdentificationModule} newSiniestro={newSiniestro}
                           searchSiniestro={searchSiniestro}/>
    )

}