import {FiltrosSiniestros} from "../../../../components/FiltrosSiniestros";
import {ENDPOINT_VAM} from "../../../../constants/modules.constant";
import {useSelector} from "react-redux";

export const ExportedSiniestrosVam = () => {

    const user = useSelector(state => state.user);

    const moduleEndpoints = ENDPOINT_VAM;
    const userIdentificationModule = user.cedula;

    const newSiniestro = "/vam/reportar-siniestro/new/new";
    const searchSiniestro = "/vam/reportar-siniestro";

    return (
        <FiltrosSiniestros moduleEndpoints={moduleEndpoints}
                           userIdentificationModule={userIdentificationModule} newSiniestro={newSiniestro}
                           searchSiniestro={searchSiniestro}/>
    )

}