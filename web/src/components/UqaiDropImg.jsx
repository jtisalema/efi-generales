import React, {Component} from "react";
import Dropzone from 'react-dropzone';
import Humanize from 'humanize-plus';
import Alerts from "./Alerts";

const dropzoneStyle = {
    width: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    cursor: "pointer",
    lineHeight: "1.5",
    borderStyle: "dashed"
};

const thumb = {
    border: '1px solid #eaeaea',
    borderRadius: 2,
    boxSizing: 'border-box',
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "#fefefe",
};

const activeStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: '#6c6',
};
const rejectStyle = {
    borderColor: '#c66',
};

const img = {
    objectFit: "contain",
    maxHeight: 300,
    width: "100%",
};

class UqaiDropImg extends Component {

    constructor(props) {
        super(props);
        this.alert = React.createRef();
        this.state = {
            preview: null,
            error: "",
            tam: 0
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data && this.props.data !== prevProps.data) {
            this.setState({preview: this.props.data});
        }
    }

    componentDidMount() {
        if (this.props.data) {
            this.setState({preview: this.props.data});
        }
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            // imageBase64Data
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = event.target.result;
                this.setState({preview, nombre: file.name, error: null});
            };
            if (this.props.form) {
                this.props.form.setFieldValue(this.props.field.name, file);
            }
            reader.readAsDataURL(file);
        }
        if (rejectedFiles.length > 0) {
            let file = rejectedFiles[0].file;
            if (file.size > this.props.maxSize && file.type === this.props.accept) {
                this.setState({tam: file.size});
            } else {
                this.setState({tam: 0});
            }
        }
    };

    onDropRejected = (size) => {
        let tam = this.state.tam;
        if (tam > 0) {
            this.alert.current.show_error(`Seleccione un archivo válido - Máximo admitido ${this.props.maxSize ? `${Humanize.fileSize(this.props.maxSize)}` : ""}`);
            // this.setState({error: `El tamaño supera lo admitido ${this.props.maxSize ? `(máximo ${Humanize.fileSize(this.props.maxSize)})` : ""}`});
        } else {
            this.alert.current.show_error('Seleccione un archivo válido - Formato permitido PNG');
            // this.setState({error: 'Archivo no permitido'});
        }
    };

    onBlur = () => {
        if (this.props.form) {
            this.props.form.setFieldTouched(this.props.field.name, true);
        }
    };

    onDelete = () => {
        this.setState({preview: undefined});
        if (this.props.form) {
            this.props.form.setFieldValue(this.props.field.name, null);
        }
    };

    onError = () => {
        this.setState({preview: undefined});
    };

    render() {
        return (
            <div className={this.props.className}>
                <Alerts ref={this.alert}/>

                {this.state.preview &&
                <div style={thumb}>
                    <img src={this.state.preview}
                         alt={"Imagen"}
                         style={{...img, ...(this.props.imgStyle ?? {})}}
                         onError={this.onError.bind(this)}
                    />
                </div>
                }
                <Dropzone
                    accept={this.props.accept}
                    multiple={false}
                    maxSize={this.props.maxSize}
                    onDropRejected={this.onDropRejected}
                    onDrop={this.onDrop.bind(this)}
                    onBlur={this.onBlur.bind(this)}>
                    {({
                          getRootProps,
                          getInputProps,
                          isDragActive,
                          isDragReject,
                          isDragAccept
                      }) => {
                        const style = {
                            ...dropzoneStyle,
                            ...(isDragActive ? activeStyle : {}),
                            ...(isDragAccept ? acceptStyle : {}),
                            ...(isDragReject ? rejectStyle : {})
                        };

                        const message = (
                            <span>
                                {isDragAccept && "Todos los archivos serán aceptados"}
                                {isDragReject && "Algunos archivos serán rechazados"}
                                {!isDragActive && "Seleccionar archivo" + this.props.maxSize ? ` (máximo ${Humanize.fileSize(this.props.maxSize)})` : ""}
                            </span>
                        );

                        return (
                            <>
                                <div style={{display: "flex"}}>
                                    <input {...getInputProps()} />
                                    <div {...getRootProps({style, className: "form-control"})}>
                                        <>
                                            {this.state.error ?
                                                <span className="text-danger">{this.state.error}</span>
                                                :
                                                (message)}
                                        </>
                                    </div>
                                </div>
                                <div>
                                    {(this.state.nombre ?? '')}
                                </div>
                            </>

                        )
                    }}
                </Dropzone>
            </div>
        )
    }
}

export default UqaiDropImg