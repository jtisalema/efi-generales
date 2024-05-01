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
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_SINIESTRO_SS")
@IdClass(BrkTSiniestroPortal.SiniestroPortalId.class)
public class BrkTSiniestroPortal implements Serializable {
    private static final long serialVersionUID = 7389076998528051961L;

    @Id
    @Column(name = "CD_COMPANIA", nullable = false)
    private Integer cdCompania;
    @Id
    @Column(name = "CD_RECLAMO", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_seq")
    @SequenceGenerator(name = "my_seq", sequenceName = "SEQ_SINIESTRO_PORTAL", allocationSize = 1)
    private Integer cdReclamo;
    private Integer numSiniestro;
    private Integer cdTabRubro;
    private Integer cdAseguradora;
    private Integer cdRamo;
    private Integer cdRamoCotizacion;
    private ZonedDateTime fcCreacion;
    private String refAviso;
    private Integer cdAsegurado;
    private ZonedDateTime fcSiniestro;
    private String causa;
    private String obsSiniestro;
    private String poliza;
    private String cdUsuario;
    private String numRepAseg;
    private String numAseguradora;
    private Integer cdCliente;
    private String anexo;
    private String estado;
    private Integer bloqueo;
    private Integer anoSiniestro;
    private Integer envio;
    private Integer impreso;
    private Integer flgAmv;
    private Integer cdAseguradoTit;
    private Integer cdAgenteSinies;
    private ZonedDateTime fcRecpcionBrk;
    private Integer envioApertura;
    private Integer envioCierre;
    private Integer tomoEncuesta;
    private Integer solOrigen;
    private String rucCedBenef;
    private String nmBeneficiario;
    private ZonedDateTime fcNacBenef;
    private ZonedDateTime fcNotificacion;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SiniestroPortalId implements Serializable {
        private static final long serialVersionUID = 5345945090587797716L;
        private Integer cdCompania;
        private Integer cdReclamo;
    }
}
