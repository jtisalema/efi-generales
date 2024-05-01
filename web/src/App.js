import React, {useEffect} from 'react';
import {Route, Switch} from "react-router-dom";
import {useSelector} from "react-redux";
import {Login} from "./pages/sec/Login";
import {Recuperar} from "./pages/sec/Recuperar";
import Cambiar from "./pages/user/CambiarPass";
import {Home} from "./pages/home/Home"
import {RoutesPagesGen} from "./pages/gen/RoutesPagesGen";
import {AdminHome} from "./pages/home/AdminHome";
import {GestorEjecutivo} from "./pages/gen/GestorEjecutivo";
import {DemoCards, DemoLogin, DemoPage} from "./layouts/Demo"
import {JedaiIdle} from "./components/JedaiIdle";
import {app} from "./util/General";

function App() {
    const user = useSelector(state => state.user);
    const isAdmin = user.isAdmin;
    const isEjecutivo = user.isEjecutivo;

    const conexionGoogleA = () => {
        if (app.prod && (isAdmin === false) && (isEjecutivo === false)) {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = 'https://www.googletagmanager.com/gtag/js?id=G-NC71NBSJ4B';
            document.body.appendChild(s);

            const s2 = document.createElement('script');
            s2.type = 'text/javascript';
            s2.innerHTML = "window.dataLayer = window.dataLayer || [];\n" +
                "                        function gtag(){dataLayer.push(arguments);}\n" +
                "                        gtag('js', new Date());\n" +
                "\n" +
                "                         gtag('config', 'G-NC71NBSJ4B',{ 'debug_mode':true });";
            document.body.appendChild(s2);
        }
    }

    useEffect(() => {
        conexionGoogleA();
    }, [user]);


    return (
        user.id ?
            <>
                <JedaiIdle/>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/home" exact component={Home}/>
                    <Route exact path="/demo" component={DemoPage}/>
                    <Route exact path="/demo-cards" component={DemoCards}/>

                    <Route exact path="/cambiar" component={Cambiar}/>
                    {isAdmin &&
                        <Route exact path="/home-adm" component={AdminHome}/>}
                    {isAdmin &&
                        <Route exact path="/gestor-ejecutivo" component={GestorEjecutivo}/>}
                    <RoutesPagesGen/>
                </Switch>
            </>
            :
            <Switch>
                <Route exact path="/demo" component={DemoPage}/>
                <Route exact path="/demo-cards" component={DemoCards}/>
                <Route exact path="/demo-login" component={DemoLogin}/>
                <Route exact path="/login/:hash" component={Login}/>
                <Route exact path="/recuperar" component={Recuperar}/>
                <Route component={Login}/>
            </Switch>
    );
}

export default App;