package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

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
import java.util.Objects;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_SEG_SINIESTRO_SS")
@IdClass(BrkTSegSiniestroPortal.SiniestroSegPortalId.class)
public class BrkTSegSiniestroPortal implements Serializable {
    private static final long serialVersionUID = -2243174150477821759L;
    @Id
    @Column(name = "CD_SEG_SINIESTRO", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_seq")
    @SequenceGenerator(name = "my_seq", sequenceName = "SEQ_SEG_SINIESTRO_PORTAL", allocationSize = 1)
    private Integer cdSegSiniestro;
    @Id
    @Column(name = "CD_COMPANIA", nullable = false)
    private Integer cdCompania;
    private Integer cdReclamo;
    private Integer cdTabRubro;
    private ZonedDateTime fcSeguimiento;
    private String observacion;
    private Integer cdEstSiniestro;
    private String carta;
    private Integer cdIncSiniestro;
    private Integer activo;
    private String envAseg;
    private String usuario;
    private Integer cdSubestado;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SiniestroSegPortalId implements Serializable {
        private static final long serialVersionUID = 3933185223611241385L;
        private Integer cdCompania;
        private Integer cdSegSiniestro;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        BrkTSegSiniestroPortal that = (BrkTSegSiniestroPortal) o;
        return getCdSegSiniestro() != null && Objects.equals(getCdSegSiniestro(), that.getCdSegSiniestro())
                && getCdCompania() != null && Objects.equals(getCdCompania(), that.getCdCompania());
    }

    @Override
    public int hashCode() {
        return Objects.hash(cdSegSiniestro, cdCompania);
    }
}
