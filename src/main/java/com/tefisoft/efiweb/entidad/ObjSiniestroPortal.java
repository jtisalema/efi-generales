package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_OBJ_SINIESTRO_SS")
@IdClass(ObjSiniestroPortal.SiniestroObjPortalId.class)
public class ObjSiniestroPortal implements Serializable {
    private static final long serialVersionUID = 2673225540199877010L;
    @Id
    @Column(name = "CD_OBJ_SINIESTRO", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_seq")
    @SequenceGenerator(name = "my_seq", sequenceName = "SEQ_OBJ_SINIESTRO_PORTAL", allocationSize = 1)
    private Integer cdObjSiniestro;
    @Id
    @Column(name = "CD_COMPANIA", nullable = false)
    private Integer cdCompania;
    private Integer cdReclamo;
    private String dscObjeto;
    private Integer cdObjeto;
    private BigDecimal valAsegurado;
    private Integer aceptado;
    private String clAsegurado;
    private Integer cdAsegurado;
    private Integer cdUbicacion;
    private Integer cdPlan;
    private Integer flgDedanopol;
    private Integer cdObjOrigen;
    private Integer cdRamCotOrigen;
    private Integer docFijo;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SiniestroObjPortalId implements Serializable {
        private static final long serialVersionUID = 3933185223611241385L;
        private Integer cdCompania;
        private Integer cdObjSiniestro;
    }
}
