create table BROKER.BRK_T_DOCUMENTO_DIGITAL
(
    CD_ARCHIVO           NUMBER not null
        constraint BRK_T_DOCUMENTO_DIGITAL_PK
            primary key,
    CD_CLIENTE           NUMBER,
    CD_COMPANIA          NUMBER,
    CD_RAMO              NUMBER,
    CD_RECLAMO           NUMBER,
    CD_INC_SINIESTRO     NUMBER,
    TIPO                 VARCHAR2(100),
    UUID                 VARCHAR2(100),
    NOMBRE               VARCHAR2(100),
    MIME                 VARCHAR2(100),
    TAMANIO              NUMBER,
    METADATO             VARCHAR2(400),
    ACTIVO               NUMBER default 1,
    POLIZA               VARCHAR2(50),
    CD_DOC_SINIESTRO     NUMBER,
    CD_SDOC_SINIESTRO    NUMBER,
    NUM_GRUPO            NUMBER,      -- 0, 1, 2...
    ORDEN                NUMBER,      -- 0, 1, 2...
    PATH_FILE            VARCHAR(200),
    ESTADO               VARCHAR(25), -- EN_ESPERA, POR_REVISAR, DEVUELTO, INGRESADO, RECHAZADO
    ID_USUARIO_EJECUTIVO NUMBER,
    OBSERVACIONES        VARCHAR2(500)
);

--secuencial
CREATE SEQUENCE SEQ_DOCUMENTO_DIGITAL
    INCREMENT BY 1
    START WITH 1
    MINVALUE 1
    MAXVALUE 1000000
    CYCLE CACHE 2;