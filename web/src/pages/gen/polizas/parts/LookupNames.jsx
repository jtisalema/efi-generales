import React, {Component} from 'react';
import axios from "axios";
import {routes} from "../../../../util/General";
import {find_aseg} from "../../../../api/CacheApi";

export const Activo = (props) => {

    return (
        <React.Fragment>
            {
                (props.valor === true || props.valor === 1) ?
                    <span>SI</span>
                    :
                    <span>NO</span>
            }
        </React.Fragment>
    )
}

export class NombreAseguradora extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            nm: ''
        }
    }

    fetchData = () => {
        if (this.props.cod) {
            find_aseg(this.props.cod).then(aseg => this.setState({nm: aseg ? aseg.nmAlias : ''}));
        }
    };

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.cod !== prevProps.cod) {
            this.fetchData();
        }
    }

    render() {
        return (<span>
            {this.state.nm}
        </span>)
    }

}

export class NombreRamo extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            nm: ''
        }
    }

    fetchData = () => {
        if (this.props.cod) {
            this.loadRamo(this.props.cod);
        }
    };

    loadRamo = (cdRamo) => {
        let list = this.props.list;
        let ramo = list.find(r => r.cdRamo === cdRamo);
        this.setState({nm: ramo ? ramo.nmRamo : ''})
    };

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.cod !== prevProps.cod) {
            this.fetchData();
        }
    }

    render() {
        return (<span>
            {this.state.nm}
        </span>)
    }

}

export class NombreCliente extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            nm: ''
        }
    }

    fetchData = () => {
        if (this.props.cod) {
            this.loadCliente(this.props.cod).then(clt => this.setState({nm: clt ? clt.nmCliente + " " + clt.apCliente : ''}));
        }
    };

    loadCliente = (cdCliente) => {
        return new Promise(function (resolve, reject) {
                axios.get(routes.api + '/cliente', {params: {cdCliente}}).then(resp => {
                    resolve(resp.data);
                }).catch(error => {
                        reject(error);
                    }
                );
            }
        )
            ;
    };

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.cod !== prevProps.cod) {
            this.fetchData();
        }
    }

    render() {
        return (<span>
            {this.state.nm}
        </span>)
    }

}

export class DscPlan extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            nm: ''
        }
    }

    fetchData = () => {
        if (this.props.cod) {
            this.loadPlan(this.props.cod, this.props.cdCompania).then(plan => this.setState({nm: plan ? plan.dscPlan : ''}));
        }
    };

    loadPlan = (cdUbicacion, cdCompania) => {
        return new Promise(function (resolve, reject) {
                axios.get(routes.api + '/plan/' + cdUbicacion + '/' + cdCompania).then(resp => {
                    resolve(resp.data);
                }).catch(error => {
                        reject(error);
                    }
                );
            }
        )
            ;
    };

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.cod !== prevProps.cod) {
            this.fetchData();
        }
    }

    render() {
        return (<span>
            {this.state.nm}
        </span>)
    }

}

