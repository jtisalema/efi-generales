drop table BRK_T_DET_BENEF_DOC_SS;
drop table BRK_T_AYUDA_DOC_SIN_SS;
drop table BRK_T_SUB_DOC_SINIESTRO_SS;
drop table BRK_T_DOC_SINIESTRO_SS;

--DOCUMENTOS SINIESTRO (BRK_T_DOC_SINIESTRO_SS) X BENEFICIOS (BRK_T_COBERTURAS (TIPO = 4 SON BENEFICIOS))
-- Create table
create table BRK_T_DOC_SINIESTRO_SS
(
    CD_DOC_SINIESTRO    NUMBER not null,
    CD_ASEGURADORA      NUMBER not null,
    CD_RAMO             NUMBER not null,
    CD_COBERTURA        NUMBER not null, --BENEFICIO
    CD_TP_DOC_SINIESTRO NUMBER not null, --DOCUMENTO DEL SINIESTRO
    TP_SINIESTROS       VARCHAR2(200),   --(tipo reclamo) --HOSPITALARIO, AMBULATORIO, EMERGENCIA, AUTORIZACION, NO DEFINIDO
    ORDEN               NUMBER DEFAULT 0,
    OBSERVACIONES       VARCHAR2(500),
    ACTIVO              NUMBER DEFAULT 1,
    -- nuevas properties
    SUBDOCUMENTO        NUMBER DEFAULT 0
);

alter table BRK_T_DOC_SINIESTRO_SS
    add OBLIGATORIO NUMBER default 0;

-- Create/Recreate primary, unique and foreign key constraints
alter table BRK_T_DOC_SINIESTRO_SS
    add constraint PK_BRK_T_DOC_SINIESTRO_SS primary key (CD_DOC_SINIESTRO);

alter table BRK_T_DOC_SINIESTRO_SS
    add constraint FK_BRK_T_DOC_SIN_ASEG foreign key (CD_ASEGURADORA)
        references BRK_T_ASEGURADORAS (CD_ASEGURADORA);

alter table BRK_T_DOC_SINIESTRO_SS
    add constraint FK_BRK_T_DOC_SIN_RAMO foreign key (CD_RAMO)
        references BRK_T_RAMOS (CD_RAMO);

alter table BRK_T_DOC_SINIESTRO_SS
    add constraint FK_BRK_T_DOC_SIN_COBER foreign key (CD_COBERTURA)
        references BRK_T_COBERTURAS (CD_COBERTURA);

alter table BRK_T_DOC_SINIESTRO_SS
    add constraint FK_BRK_T_DOC_SIN_TP_SIN foreign key (CD_TP_DOC_SINIESTRO)
        references BRK_T_TP_DOC_SINIESTRO (CD_TP_DOC_SINIESTRO);

alter table BRK_T_DOC_SINIESTRO_SS
    modify CD_COBERTURA null;
alter table BRK_T_DOC_SINIESTRO_SS
    modify CD_TP_DOC_SINIESTRO null;

--SUBDOCUMENTO SINIESTRO (BRK_T_SUB_DOC_SINIESTRO_SS) X DOCUMENTOS SINIESTRO (BRK_T_DOC_SINIESTRO_SS)
-- Create table
create table BRK_T_SUB_DOC_SINIESTRO_SS
(
    CD_SDOC_SINIESTRO   NUMBER not null,
    CD_DOC_SINIESTRO    NUMBER not null,
    CD_TP_DOC_SINIESTRO NUMBER not null, --DOCUMENTO DEL SINIESTRO
    ORDEN               NUMBER DEFAULT 0,
    OBSERVACIONES       VARCHAR2(500),
    ACTIVO              NUMBER DEFAULT 1,
    -- nuevas properties
    REQ_FECHA           NUMBER DEFAULT 0
);

alter table BRK_T_SUB_DOC_SINIESTRO_SS
    add OBLIGATORIO NUMBER default 0;
--DOCUMENTO, FACTURA, RECETA
alter table BRK_T_SUB_DOC_SINIESTRO_SS
    add TIPO VARCHAR2(20);

-- Create/Recreate primary, unique and foreign key constraints
alter table BRK_T_SUB_DOC_SINIESTRO_SS
    add constraint PK_BRK_T_SUB_DOC_SINIESTRO_SS primary key (CD_SDOC_SINIESTRO);

alter table BRK_T_SUB_DOC_SINIESTRO_SS
    add constraint FK_BRK_T_SDOC_SIN_DOC foreign key (CD_DOC_SINIESTRO)
        references BRK_T_DOC_SINIESTRO_SS (CD_DOC_SINIESTRO);

alter table BRK_T_SUB_DOC_SINIESTRO_SS
    add constraint FK_BRK_T_SDOC_SIN_TP_SIN foreign key (CD_TP_DOC_SINIESTRO)
        references BRK_T_TP_DOC_SINIESTRO (CD_TP_DOC_SINIESTRO);

-- AYUDA DOC SINIESTROS (BRK_T_AYUDA_DOC_SIN_SS) X DOCUMENTOS SINIESTRO (BRK_T_DOC_SINIESTRO_SS) Y SUBDOCUMENTO SINIESTRO (BRK_T_SUB_DOC_SINIESTRO_SS)
-- Create table
create table BRK_T_AYUDA_DOC_SIN_SS
(
    CD_AYUDA_DOC_SIN  NUMBER not null,
    CD_DOC_SINIESTRO  NUMBER,
    CD_SDOC_SINIESTRO NUMBER,
    AYUDA             VARCHAR2(500),
    OBSERVACIONES     VARCHAR2(500),
    ACTIVO            NUMBER DEFAULT 1
);

-- Create/Recreate primary, unique and foreign key constraints
alter table BRK_T_AYUDA_DOC_SIN_SS
    add constraint PK_BRK_T_AYUDA_DOC_SIN_SS primary key (CD_AYUDA_DOC_SIN);

alter table BRK_T_AYUDA_DOC_SIN_SS
    add constraint FK_BRK_T_AYUDA_DOC_DOC foreign key (CD_DOC_SINIESTRO)
        references BRK_T_DOC_SINIESTRO_SS (CD_DOC_SINIESTRO);

-- DETALLDE BENEFICIOS/DOCUMENTOS X DOCUMENTOS SINIESTRO (BRK_T_DOC_SINIESTRO_SS) Y SUBDOCUMENTO SINIESTRO (BRK_T_SUB_DOC_SINIESTRO_SS)
-- Create table
create table BRK_T_DET_BENEF_DOC_SS
(
    CD_DET_BENEF_DOC     NUMBER not null,
    CD_COMPANIA          NUMBER not null,                   ---ESTA VIENE AL MOMENTO QUE ESCOJAN LA POLIZA
    CD_DOC_SINIESTRO     NUMBER,
    CD_SDOC_SINIESTRO    NUMBER,
    CD_COBERTURA         NUMBER not null,                   ---ESTA VIENE DEL BENEFICIO QUE SE ESCOJA
    CD_RECLAMO           NUMBER,                            ---ESTA VIENE AL MOMENTO QUE EL USUARIO CREE EL SINIESTRO (BRK_T_SINIESTRO)
    CD_RAMO_COTIZACION   NUMBER,                            ---ESTA VIENE AL MOMENTO QUE ESCOJAN LA POLIZA
    CD_INC_SINIESTRO     NUMBER,                            ---ESTA VIENE AL MOMENTO QUE EL USUARIO CREE LA INCAPACIDAD DEL SINIESTRO (BRK_T_INCAP_SINIESTRO)
    CD_COB_DED_SINIESTRO NUMBER,
    CD_GASTOS_VAM        NUMBER,
    DET_DOCUMENTO        VARCHAR2(200),
    VALOR                NUMBER(15, 2),
    NUM_DOCUMENTO        VARCHAR2(250),
    FC_DOCUMENTO         DATE,
    FC_CADUC_DOCUMENTO   DATE,
    OBSERVACIONES        VARCHAR2(500),
    ESTADO               VARCHAR2(100) DEFAULT 'EN ESPERA', --EN ESPERA, PENDIENTE, ENVIADO, APROBADO DEVUELTO
    FC_ESTADO            DATE,
    CD_ARCHIVO           NUMBER                             -- viene de BRK_T_DOCUMENTO_DIGITAL
);

alter table BRK_T_DET_BENEF_DOC_SS
    add AUTOCOMPLETADO number default 0;

-- DETALLDE BENEFICIOS/DOCUMENTOS X DOCUMENTOS SINIESTRO (BRK_T_DOC_SINIESTRO_SS) Y SUBDOCUMENTO SINIESTRO (BRK_T_SUB_DOC_SINIESTRO_SS)
-- Create table
alter table BRK_T_AYUDA_DOC_SIN_SS
    add constraint FK_BRK_T_AYUDA_SDOC_DOC foreign key (CD_SDOC_SINIESTRO)
        references BRK_T_SUB_DOC_SINIESTRO_SS (CD_SDOC_SINIESTRO);

-- Create/Recreate primary, unique and foreign key constraints
alter table BRK_T_DET_BENEF_DOC_SS
    add constraint PK_BRK_T_DET_BENEF_DOC_SS primary key (CD_DET_BENEF_DOC);

alter table BRK_T_DET_BENEF_DOC_SS
    add constraint FK_BRK_T_DET_BENEF_DOC foreign key (CD_DOC_SINIESTRO)
        references BRK_T_DOC_SINIESTRO_SS (CD_DOC_SINIESTRO);

alter table BRK_T_DET_BENEF_DOC_SS
    add constraint FK_BRK_T_DET_BENEF_SDOC foreign key (CD_SDOC_SINIESTRO)
        references BRK_T_SUB_DOC_SINIESTRO_SS (CD_SDOC_SINIESTRO);

-- create sequence
CREATE SEQUENCE SEQ_DET_BENEF_DOC_SS
    INCREMENT BY 1
    START WITH 1
    MINVALUE 1
    MAXVALUE 1000000
    CYCLE CACHE 2;