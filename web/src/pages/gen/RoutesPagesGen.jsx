import Polizas from "./polizas/Polizas";
import SiniestroGEN from "./siniestros/SiniestroGEN";
import Siniestros from "./siniestros/Siniestros";
import {GestorUsuario} from "../user/GestorUsuario";
import React from "react";
import {Route, Switch} from "react-router-dom";
import AdminPolizas from "./polizas/AdminPolizas";
import VisorUsuarios from "../user/VisorUser";
import {RoutesPagesVam} from "../vam/RoutesPagesVam";
import {Perfil} from "../user/Perfil";
import {Home} from "../home/Home";
import {CreateSiniestro} from "../../components/CreateSiniestro";
import {ExportedSiniestrosGen} from "./siniestros/parts/ExportedSiniestrosGen";

export const RoutesPagesGen = () => {

    return (
        <Switch>
            <Route path="/gen/home" exact component={Home}/>
            <Route exact path="/gen/perfil" component={Perfil} title={"Datos del Contratante"}/>

            <Route exact path="/gen/polizas" component={Polizas}
                   title={"Pólizas de Seguros"}/>
            <Route exact path="/gen/siniestros-gen" component={SiniestroGEN}
                   title={"Consulta Siniestros Generales"}/>
            <Route exact path="/gen/siniestros-vam" component={Siniestros}
                   title={"Consulta Siniestros VAM"}/>
            <Route exact path="/gen/admin" component={AdminPolizas} title={"Administrador selección"}/>
            <Route exact path="/gen/visor" component={VisorUsuarios} title={"Usuarios"}/>
            <Route exact path="/gen/usuarios-gestor" component={GestorUsuario} title={"Creación de Usuarios"}/>
            <Route exact path="/gen/reportar-siniestro/:cdComp/:cdReclamo/:cdIncSiniestro?" component={CreateSiniestro}
                   title={"Portal Siniestros"}/>
            <Route exact path="/gen/siniestros-reportados" component={ExportedSiniestrosGen}
                   title={"Siniestros Reportados"}/>
            <RoutesPagesVam/>
        </Switch>
    )
}