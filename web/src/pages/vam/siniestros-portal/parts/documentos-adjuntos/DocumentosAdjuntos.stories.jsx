import {DocumentosAdjuntos} from "./DocumentosAdjuntos";
import UqaiFormik from "../../../../../components/UqaiFormik";

export default {
    title: "UQAI/Documentos Adjuntos",
    component: DocumentosAdjuntos,
}

const Template = (args) => (<UqaiFormik initialValues={{}} onSubmit={null}>
        <DocumentosAdjuntos {...args}/>
    </UqaiFormik>
);

export const Default = Template.bind({});
Default.args = {
    adjuntos: [
        {
            "idDocumento": 12345,
            "subdocumento": false,
            "orden": 1,
            "activo": 1,
            "cdCobertura": 123,
            "obligatorio": true,
            "docNombre": "Documentito 1",
            "nombreTabla": "BRK_T_TABLA",
            "help": "Texto de tooltip",
            "subdocumentos": []
        },
        {
            "idDocumento": 12345,
            "subdocumento": true,
            "orden": 2,
            "activo": true,
            "cdCobertura": 12345,
            "obligatorio": false,
            "docNombre": "Subdocumentito nombre",
            "nombreTabla": "BRK_T_TABLA",
            "help": "Texto de tooltip",
            "subdocumentos": [
                {
                    "idDocumento": 12345,
                    "orden": 2,
                    "activo": true,
                    "cdCobertura": 123,
                    "obligatorio": false,
                    "docNombre": "Subdocumentito 2",
                    "nombreTabla": "BRK_T_TABLA",
                    "help": "Texto de tooltip",
                    "tipo": "FACTURA",
                    "subdocumentos": []
                },
                {
                    "idDocumento": 12345,
                    "orden": 3,
                    "activo": true,
                    "cdCobertura": 123,
                    "obligatorio": false,
                    "docNombre": "Subdocumentito 3",
                    "nombreTabla": "BRK_T_TABLA",
                    "help": "Texto de tooltip",
                    "tipo": "DOCUMENTO",
                    "subdocumentos": []
                },
                {
                    "idDocumento": 12345,
                    "orden": 1,
                    "activo": true,
                    "cdCobertura": 123,
                    "obligatorio": false,
                    "docNombre": "Subdocumentito 1",
                    "nombreTabla": "BRK_T_TABLA",
                    "help": "Texto de tooltip",
                    "tipo": "RECETA",
                    "subdocumentos": []
                },
                {
                    "idDocumento": 12345,
                    "orden": 4,
                    "activo": true,
                    "cdCobertura": 123,
                    "obligatorio": false,
                    "docNombre": "Subdocumentito 4",
                    "nombreTabla": "BRK_T_TABLA",
                    "help": "Texto de tooltip",
                    "tipo": "FACTURA",
                    "subdocumentos": []
                },
            ]
        },
        {
            "idDocumento": 12345,
            "subdocumento": false,
            "orden": 3,
            "activo": true,
            "cdCobertura": 123,
            "obligatorio": false,
            "docNombre": "Documentito 3",
            "nombreTabla": "BRK_T_TABLA",
            "help": "Texto de tooltip",
            "subdocumentos": []
        }
    ]
}