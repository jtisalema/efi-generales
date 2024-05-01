package com.tefisoft.efiweb.entidad;
// Generated 27/06/2017 18:17:37 by Hibernate Tools 4.3.1


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * BrkTEjecutivosAdm generated by hbm2java
 */
@Entity
@Table(name = "BRK_T_EJECUTIVOS_ADM")
@IdClass(EjecutivosAdm.EjecutivosAdmId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EjecutivosAdm implements java.io.Serializable {

    @Id
    @Column(name = "CD_COMPANIA", nullable = false, precision = 22, scale = 0)
    private Integer cdCompania;

    @Id
    @Column(name = "CD_EJECUTIVO", nullable = false, precision = 15, scale = 0)
    private Integer cdEjecutivo;

    @Column(name = "NM_AGENTE", nullable = false, length = 50)
    private String nmAgente;

    @Column(name = "AP_AGENTE", nullable = false, length = 50)
    private String apAgente;

    @Column(name = "DIRECCION", length = 200)
    private String direccion;

    @Column(name = "CEDULA", nullable = false, length = 20)
    private String cedula;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "FC_CREACION", nullable = false)
    private Date fcCreacion;

    @Column(name = "ESTADO", length = 1)
    private Character estado;

    @Column(name = "TP_DOCUMENTO", length = 15)
    private String tpDocumento;

    @Column(name = "TP_EJECUTIVO", length = 20)
    private String tpEjecutivo;

    @Column(name = "USUARIO", length = 20)
    private String usuario;

    @Column(name = "CD_EJE_GRUPO", nullable = false, length = 50)
    private Integer cdEjeGrupo;

    @Column(name = "CD_RAM_GRUPO", length = 50)
    private Integer cdRamGrupo;

    @Column(name = "TEMP", precision = 22, scale = 0)
    private Integer temp;

    @Column(name = "CD_EJE_DPTO", length = 50)
    private Integer cdDpto;

    @Column(name = "TIPO_EJE", precision = 22, scale = 0)
    private Integer tipoEje;

    @Column(name = "EJECUTIVOWEB", precision = 1, scale = 0)
    private Boolean ejecutivoweb;

    @Column(name = "CARGO", length = 50)
    private String cargo;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EjecutivosAdmId implements Serializable {
        private Integer cdCompania;
        private Integer cdEjecutivo;
    }
}


