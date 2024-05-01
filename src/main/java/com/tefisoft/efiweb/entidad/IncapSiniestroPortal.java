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
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_INCAP_SINIESTRO_SS")
@IdClass(IncapSiniestroPortal.IncapSiniestroPortalId.class)
public class IncapSiniestroPortal implements Serializable {
    private static final long serialVersionUID = -8109911471245621604L;
    @Id
    @Column(name = "CD_INC_SINIESTRO", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_seq")
    @SequenceGenerator(name = "my_seq", sequenceName = "SEQ_INCAP_SINIESTRO_PORTAL", allocationSize = 1)
    private Integer cdIncSiniestro;
    @Id
    @Column(name = "CD_COMPANIA", nullable = false)
    private Integer cdCompania;
    private Integer cdHospital;
    private Integer cdIncapacidad;
    private Integer cdObjSiniestro;
    private String tpSiniestro;
    private BigDecimal valMaxIncap;
    private BigDecimal valSaldoMax;
    private BigDecimal valDeducible;
    private BigDecimal valSaldoDed;
    private BigDecimal valLimite;
    private BigDecimal valSaldoLim;
    private BigDecimal valReembolso;
    private String obsIncapacidad;
    private String estado;
    private Integer item;
    private String dscDeducible;
    private ZonedDateTime fcLiquida;
    @Column(name = "PAGAR_A")
    private Integer pagarA;
    private String numLiquida;
    private Integer impreso;
    private Integer envio;
    private String carta;
    private ZonedDateTime fcUltimodoc;
    private ZonedDateTime fcAlcance;
    private ZonedDateTime fcRecepcionLiq;
    private String usuario;
    private Integer cerrado;
    private String zohoId;
    private String estadoPortal;
    private LocalDate fcPrimeraFactura;
    private String observacionesEstados;
    private boolean caducado;
    private boolean prevAprobado;
    private boolean liquidado;

    private ZonedDateTime fcProcedimiento;
    private BigDecimal valCirugia;
    private BigDecimal valorReclamoPortal;
    private String usuarioPortal;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class IncapSiniestroPortalId implements Serializable {
        private static final long serialVersionUID = 5345945090587797716L;
        private Integer cdCompania;
        private Integer cdIncSiniestro;
    }
}


