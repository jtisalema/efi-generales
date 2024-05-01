import React, {Component} from 'react';
import {routes} from "../util/General";
import {connect} from "react-redux";
import {do_logout} from "../pages/sec/redux/actions";
import JedaiNotificationAlert from "./JedaiNotificationAlert";

class Alerts extends Component {

    constructor(props) {
        super(props);
        this.notificationAlert = React.createRef();
        this.handle_error = this.handle_error.bind(this);
        this.show_error = this.show_error.bind(this);
        this.show_info = this.show_info.bind(this);
        this.clear = this.clear.bind(this);
    }

    create_ops = (type, icon, msg) => {
        return {
            place: 'tr',
            message: (
                <span>
                    {msg}
                </span>
            ),
            type: type,
            icon: icon,
            autoDismiss: 10
        };

    };

    show_error = (msg) => {
        msg = estandarize(msg);
        this.clearAll();
        this.notificationAlert.current.notificationAlert(this.create_ops('danger', 'fas fa-exclamation-triangle me-1', msg));
    };

    show_info = (msg) => {
        msg = estandarize(msg);
        this.clearAll();
        this.notificationAlert.current.notificationAlert(this.create_ops('info', '', msg));
    };

    clear = () => {
        this.notificationAlert.current.clear();
    };

    clearAll = () => {
        this.notificationAlert.current?.clearAll();
    };

    handle_error = (error) => {
        this.clearAll();
        let msg = handleError(error) + '';
        let show = true;
        let redirect = false;
        try {
            if (msg.toLowerCase().indexOf('sesi') >= 0 && msg.toLowerCase().indexOf('caduc') >= 0) {
                redirect = true;
            }
        } catch (e) {
            console.log(e);
        }
        if (show) {
            this.show_error(msg);
        }
        if (redirect) {
            // sesion caducada cambio a login
            setTimeout(() => {
                this.props.do_logout();
            }, 600);
        }

        return msg;
    };

    render() {
        return <JedaiNotificationAlert ref={this.notificationAlert}/>
    }
}

const mapStateToProps = (state) => ({
    emp: state.emp
});

const mapDispatchToProps = {
    do_logout
};

export default connect(
    mapStateToProps,
    mapDispatchToProps, null, {forwardRef: true}
)(Alerts);

export const handleError = (error) => {
    if (routes.debug) {
        console.log(JSON.stringify(error));
    }

    let msg = (error.response && error.response.data) || false;

    if (msg && !(msg instanceof ArrayBuffer)) {
        msg = msg.message || msg;
        return msg + '';
    }
    if (msg && (msg instanceof ArrayBuffer)) {
        let decodedString = String.fromCharCode.apply(null, new Uint8Array(msg));
        let obj = JSON.parse(decodedString);
        msg = obj.message || obj;
        return msg;
    } else {
        return 'Error desconocido';
    }
};

const estandarize = msg => {
    let msg2 = (msg || '').toString();
    return msg2.endsWith('') ? msg2 : (msg2 + '');
}