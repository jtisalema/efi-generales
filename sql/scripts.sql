-- Create table
create table BRK_T_SINIESTRO_SS
(
    NUM_SINIESTRO      NUMBER not null,
    CD_RECLAMO         NUMBER not null,
    CD_TAB_RUBRO       NUMBER,
    CD_ASEGURADORA     NUMBER,
    CD_RAMO            NUMBER not null,
    CD_COMPANIA        NUMBER not null,
    CD_RAMO_COTIZACION NUMBER,
    FC_CREACION        DATE,
    REF_AVISO          VARCHAR2(30),
    CD_ASEGURADO       NUMBER,
    FC_SINIESTRO       DATE,
    CAUSA              VARCHAR2(1000),
    OBS_SINIESTRO      VARCHAR2(1000),
    POLIZA             VARCHAR2(30),
    CD_USUARIO         VARCHAR2(30),
    NUM_REP_ASEG       VARCHAR2(30),
    NUM_ASEGURADORA    VARCHAR2(30),
    CD_CLIENTE         NUMBER,
    ANEXO              VARCHAR2(50),
    ESTADO             VARCHAR2(100),
    BLOQUEO            NUMBER(4),
    ANO_SINIESTRO      NUMBER(4),
    ENVIO              NUMBER(4),
    IMPRESO            NUMBER(4),
    FLG_AMV            NUMBER(4),
    CD_ASEGURADO_TIT   NUMBER,
    CD_AGENTE_SINIES   NUMBER,
    FC_RECPCION_BRK    DATE,
    ENVIO_APERTURA     INTEGER,
    ENVIO_CIERRE       INTEGER,
    TOMO_ENCUESTA      INTEGER,
    SOL_ORIGEN         NUMBER,
    RUC_CED_BENEF      VARCHAR2(20),
    NM_BENEFICIARIO    VARCHAR2(200),
    FC_NAC_BENEF       DATE,
    FC_NOTIFICACION    DATE
);

-- Create/Recreate primary, unique and foreign key constraints
alter table BRK_T_SINIESTRO_SS
    add constraint PK_BRK_T_SINIESTRO_SS primary key (CD_COMPANIA, CD_RECLAMO);

alter table BRK_T_SINIESTRO_SS
    add constraint FK_SINES_SS_RAMO foreign key (CD_RAMO)
        references BRK_T_RAMOS (CD_RAMO);

alter table BRK_T_SINIESTRO_SS
    add constraint FK_SINIES_SS_ASEG foreign key (CD_ASEGURADORA)
        references BRK_T_ASEGURADORAS (CD_ASEGURADORA);

alter table BRK_T_SINIESTRO_SS
    add constraint FK_SINIES_SS_COMP foreign key (CD_COMPANIA)
        references BRK_T_COMPANIA (CD_COMPANIA);

alter table BRK_T_SINIESTRO_SS
    add constraint FK_SINIES_SS_RAMCOTI foreign key (CD_COMPANIA, CD_RAMO_COTIZACION)
        references BRK_T_RAMOS_COTIZACION (CD_COMPANIA, CD_RAMO_COTIZACION);

alter table BRK_T_SINIESTRO_SS
    add constraint FK_SINIES_SS_TABRUB foreign key (CD_COMPANIA, CD_TAB_RUBRO)
        references BRK_T_TABLAS_RUBRO (CD_COMPANIA, CD_TAB_RUBRO)
            disable;

-- Create/Recreate indexes
create index CLAVE_BRK_T_SINIESTRO_SS on BRK_T_SINIESTRO_SS (CD_COMPANIA, NUM_SINIESTRO, ANO_SINIESTRO);

create index IDX_BRK_T_SINIESTRO_SS_ASEG on BRK_T_SINIESTRO_SS (CD_ASEGURADORA);

create index IDX_BRK_T_SINIESTRO_SS_ASEGDO on BRK_T_SINIESTRO_SS (CD_ASEGURADO_TIT);

create index IDX_BRK_T_SINIESTRO_SS_RAMO on BRK_T_SINIESTRO_SS (CD_RAMO);

create index IDX_BRK_T_SIN_RAMO_SS_COT on BRK_T_SINIESTRO_SS (CD_COMPANIA, CD_RAMO_COTIZACION);


-- Create table
create table BRK_T_OBJ_SINIESTRO_SS
(
    CD_OBJ_SINIESTRO  NUMBER not null,
    CD_RECLAMO        NUMBER not null,
    DSC_OBJETO        VARCHAR2(200),
    CD_COMPANIA       NUMBER not null,
    CD_OBJETO         NUMBER,
    VAL_ASEGURADO     NUMBER(16, 2),
    ACEPTADO          NUMBER(4),
    CL_ASEGURADO      VARCHAR2(25),
    CD_ASEGURADO      NUMBER,
    CD_UBICACION      NUMBER,
    CD_PLAN           NUMBER,
    FLG_DEDANOPOL     NUMBER(5),
    CD_OBJ_ORIGEN     NUMBER,
    CD_RAM_COT_ORIGEN NUMBER,
    DOC_FIJO          NUMBER(3) default 0
);

-- Create/Recreate primary, unique and foreign key constraints
alter table BRK_T_OBJ_SINIESTRO_SS
    add constraint PK_BRK_T_OBJ_SINIESTRO_SS primary key (CD_COMPANIA, CD_OBJ_SINIESTRO);

alter table BRK_T_OBJ_SINIESTRO_SS
    add constraint FK_OBJSINES_SS_SINIES foreign key (CD_COMPANIA, CD_RECLAMO)
        references BRK_T_SINIESTRO_SS (CD_COMPANIA, CD_RECLAMO) on delete cascade;

alter table BRK_T_OBJ_SINIESTRO_SS
    add constraint FK_OBJSINIES_SS_COMP foreign key (CD_COMPANIA)
        references BRK_T_COMPANIA (CD_COMPANIA);

-- Create/Recreate indexes
create index CLV_BRK_T_OBJ_SINIESTRO_SS_P on BRK_T_OBJ_SINIESTRO_SS (CD_COMPANIA, CD_RECLAMO);


-- Create table
create table BRK_T_INCAP_SINIESTRO_SS
(
    CD_INC_SINIESTRO   NUMBER not null,
    CD_HOSPITAL        NUMBER,
    CD_INCAPACIDAD     NUMBER,
    CD_COMPANIA        NUMBER not null,
    CD_OBJ_SINIESTRO   NUMBER,
    TP_SINIESTRO       VARCHAR2(25),
    VAL_MAX_INCAP      NUMBER(17, 2),
    VAL_SALDO_MAX      NUMBER(17, 2),
    VAL_DEDUCIBLE      NUMBER(17, 2),
    VAL_SALDO_DED      NUMBER(17, 2),
    VAL_LIMITE         NUMBER(17, 2),
    VAL_SALDO_LIM      NUMBER(17, 2),
    VAL_REEMBOLSO      NUMBER(17, 2),
    OBS_INCAPACIDAD    VARCHAR2(200),
    ESTADO             CHAR(1),
    ITEM               NUMBER(4),
    DSC_DEDUCIBLE      VARCHAR2(255),
    FC_LIQUIDA         DATE,
    PAGAR_A            NUMBER(4),
    NUM_LIQUIDA        VARCHAR2(20),
    IMPRESO            NUMBER(5),
    ENVIO              NUMBER(5),
    CARTA              VARCHAR2(30),
    FC_ULTIMODOC       DATE,
    FC_ALCANCE         DATE,
    FC_RECEPCION_LIQ   DATE,
    USUARIO            VARCHAR2(100),
    CERRADO            NUMBER(1) default 0,
    ZOHO_ID            VARCHAR2(100),
    ESTADO_PORTAL      VARCHAR2(50),
    FC_PRIMERA_FACTURA DATE,
    OBSERVACIONES_ESTADOS VARCHAR2(4000)
);

-- Create/Recreate primary, unique and foreign key constraints
alter table BRK_T_INCAP_SINIESTRO_SS
    add constraint PK_BRK_T_INCAP_SINIE_SS primary key (CD_COMPANIA, CD_INC_SINIESTRO);

alter table BRK_T_INCAP_SINIESTRO_SS
    add constraint FK_INCPSINIES_SS_COMP foreign key (CD_COMPANIA)
        references BRK_T_COMPANIA (CD_COMPANIA);

alter table BRK_T_INCAP_SINIESTRO_SS
    add constraint FK_INCPSINIES_SS_HOSP foreign key (CD_HOSPITAL)
        references BRK_T_HOSPITALES (CD_HOSPITAL);

alter table BRK_T_INCAP_SINIESTRO_SS
    add constraint FK_INCPSINIES_SS_INCP foreign key (CD_INCAPACIDAD)
        references BRK_T_INCAPACIDADES (CD_INCAPACIDAD);

alter table BRK_T_INCAP_SINIESTRO_SS
    add constraint FK_INCPSINI_SS_OBJSINI foreign key (CD_COMPANIA, CD_OBJ_SINIESTRO)
        references BRK_T_OBJ_SINIESTRO_SS (CD_COMPANIA, CD_OBJ_SINIESTRO) on delete cascade;

-- Create/Recreate indexes
create index BRK_T_INC_SIN_SS_01 on BRK_T_INCAP_SINIESTRO_SS (CD_COMPANIA, CD_OBJ_SINIESTRO);

create index IDX_BRK_T_INC_SIN_SS_ESTADO on BRK_T_INCAP_SINIESTRO_SS (ESTADO);


-- Create table
create table BRK_T_SEG_SINIESTRO_SS
(
    CD_SEG_SINIESTRO NUMBER not null,
    CD_RECLAMO       NUMBER not null,
    CD_TAB_RUBRO     NUMBER,
    CD_COMPANIA      NUMBER not null,
    FC_SEGUIMIENTO   DATE,
    OBSERVACION      VARCHAR2(500),
    CD_EST_SINIESTRO NUMBER(5),
    CARTA            VARCHAR2(30),
    CD_INC_SINIESTRO NUMBER,
    ACTIVO           NUMBER(1),
    ENV_ASEG         VARCHAR2(1),
    USUARIO          VARCHAR2(100) default user,
    CD_SUBESTADO     NUMBER
);

-- Create/Recreate primary, unique and foreign key constraints
alter table BRK_T_SEG_SINIESTRO_SS
    add constraint PK_BRK_T_SEG_SINIESTRO_SS primary key (CD_COMPANIA, CD_SEG_SINIESTRO);

alter table BRK_T_SEG_SINIESTRO_SS
    add constraint FK_BRK_T_INCAP_SS_01 foreign key (CD_COMPANIA, CD_INC_SINIESTRO)
        references BRK_T_INCAP_SINIESTRO_SS (CD_COMPANIA, CD_INC_SINIESTRO) on delete cascade;

alter table BRK_T_SEG_SINIESTRO_SS
    add constraint FK_CD_EST_SINIESTRO_SS foreign key (CD_EST_SINIESTRO)
        references BRK_T_EST_SINIESTRO (CD_EST_SINIESTRO);

alter table BRK_T_SEG_SINIESTRO_SS
    add constraint FK_SEGSINI_SS_COMP foreign key (CD_COMPANIA)
        references BRK_T_COMPANIA (CD_COMPANIA);

alter table BRK_T_SEG_SINIESTRO_SS
    add constraint FK_SEGSINI_SS_TABRUB foreign key (CD_COMPANIA, CD_TAB_RUBRO)
        references BRK_T_TABLAS_RUBRO (CD_COMPANIA, CD_TAB_RUBRO);


-- Create/Recreate indexes
create index IDX_BRK_T_SEG_SIN_INCAP_SS_POR on BRK_T_SEG_SINIESTRO_SS (CD_COMPANIA, CD_INC_SINIESTRO);

create index IDX_BRK_T_SEG_SIN_RECLAMO_SS_P on BRK_T_SEG_SINIESTRO_SS (CD_COMPANIA, CD_RECLAMO);

----indices adicionales
create index SEG_SINIESTRO_SS_A2IX
    on BRK_T_SEG_SINIESTRO_SS (CD_EST_SINIESTRO);

create index SEG_SINIESTRO_SS_A1IX
    on BRK_T_SEG_SINIESTRO_SS (CD_INC_SINIESTRO);

---nuevo campo en vista
--falta agregar columna CD_RAMO_COTIZACION en vista BRK_V_TIT_DEP_AM

---indice para buscar por cedula
create index IDX_BRK_T_ASEGURADOS_VAM_CEDULA
    on BRK_T_ASEGURADOS_VAM (CEDULA);

--secuenciales
----genera CD_RECLAMO en tabla BRK_T_SINIESTRO_SS
declare
    lastSeq number;
begin
    SELECT COALESCE(MAX(CD_RECLAMO),0)+1 INTO lastSeq FROM BRK_T_SINIESTRO_SS;
    if lastSeq IS NULL then lastSeq := 1; end if;
    execute immediate 'CREATE SEQUENCE SEQ_SINIESTRO_PORTAL
        INCREMENT BY 1
        START WITH '||lastSeq||
                      'MINVALUE 1
                          MAXVALUE 999999999
                          CYCLE
                          CACHE 2';
end;

----genera CD_OBJ_SINIESTRO en tabla BRK_T_OBJ_SINIESTRO_SS
declare
    lastSeq number;
begin
    SELECT COALESCE(MAX(CD_OBJ_SINIESTRO),0)+1 INTO lastSeq FROM BRK_T_OBJ_SINIESTRO_SS;
    if lastSeq IS NULL then lastSeq := 1; end if;
    execute immediate 'CREATE SEQUENCE SEQ_OBJ_SINIESTRO_PORTAL
        INCREMENT BY 1
        START WITH '||lastSeq||
                      'MINVALUE 1
                          MAXVALUE 999999999
                          CYCLE
                          CACHE 2';
end;

----genera CD_INC_SINIESTRO en tabla BRK_T_INCAP_SINIESTRO_SS
declare
    lastSeq number;
begin
    SELECT COALESCE(MAX(CD_INC_SINIESTRO),0)+1 INTO lastSeq FROM BRK_T_INCAP_SINIESTRO_SS;
    if lastSeq IS NULL then lastSeq := 1; end if;
    execute immediate 'CREATE SEQUENCE SEQ_INCAP_SINIESTRO_PORTAL
        INCREMENT BY 1
        START WITH '||lastSeq||
                      'MINVALUE 1
                          MAXVALUE 999999999
                          CYCLE
                          CACHE 2';
end;

----genera CD_SEG_SINIESTRO en tabla SEQ_SEG_SINIESTRO_PORTAL
declare
    lastSeq number;
begin
    SELECT COALESCE(MAX(CD_SEG_SINIESTRO),0)+1 INTO lastSeq FROM BRK_T_SEG_SINIESTRO_SS;
    if lastSeq IS NULL then lastSeq := 1; end if;
    execute immediate 'CREATE SEQUENCE SEQ_SEG_SINIESTRO_PORTAL
        INCREMENT BY 1
        START WITH ' || lastSeq ||
                      'MINVALUE 1
                          MAXVALUE 999999999
                          CYCLE
                          CACHE 2';
end;

--genera num_siniestro
declare
    lastSeq number;
begin
    SELECT COALESCE(MAX(NUM_SINIESTRO), 0) + 1 INTO lastSeq FROM BRK_T_SINIESTRO_SS;
    if lastSeq IS NULL then lastSeq := 1; end if;
    execute immediate 'CREATE SEQUENCE SEQ_NUM_SINIESTRO_PORTAL
        INCREMENT BY 1
        START WITH ' || lastSeq ||
                      'MINVALUE 1
                          MAXVALUE 999999999
                          CYCLE
                          CACHE 2';
end;


---alters para tablas de ejecutivos
alter table BRK_T_EJEADM_RAMGRP
    add TIPO VARCHAR2(100);
alter table BRK_T_EJEADM_RAMGRP
    add ESPECIFICO NUMBER(1);
alter table BRK_T_CLI_EJECUTIVOS_ADM
    add TIPO VARCHAR2(100);
alter table BRK_T_CLI_EJECUTIVOS_ADM
    add ESPECIFICO NUMBER(1);
