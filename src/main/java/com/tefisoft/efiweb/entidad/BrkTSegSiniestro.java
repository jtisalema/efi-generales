package com.tefisoft.efiweb.entidad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

/**
 * @author dacopanCM on 25/08/17.
 */
@Entity
@Table(name = "BRK_T_SEG_SINIESTRO")
@IdClass(BrkTSegSiniestro.BrkTSegSiniestroId.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrkTSegSiniestro implements Serializable {

    @Id
    @Column(name = "CD_COMPANIA", nullable = false, precision = 22)
    private Integer cdCompania;

    @Column(name = "CD_SEG_SINIESTRO", nullable = false, precision = 22)
    @Id
    private Integer cdSegSiniestro;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_EST_SINIESTRO")
    public BrkTEstSiniestro estSiniestro;

    @Temporal(TemporalType.DATE)
    @Column(name = "FC_SEGUIMIENTO", length = 7)
    private Date fcSeguimiento;

    @Column(name = "ACTIVO", precision = 1)
    private Boolean activo;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_RECLAMO", referencedColumnName = "CD_RECLAMO", nullable = false, insertable = false, updatable = false)})
    public BrkTSiniestro siniestro;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BrkTSegSiniestroId implements java.io.Serializable {

        @Column(name = "CD_COMPANIA", nullable = false, precision = 22)
        private Integer cdCompania;
        @Column(name = "CD_SEG_SINIESTRO", nullable = false, precision = 22)
        private Integer cdSegSiniestro;


        public boolean equals(Object other) {
            if ((this == other)) return true;
            if ((other == null)) return false;
            if (!(other instanceof BrkTSegSiniestroId)) return false;
            BrkTSegSiniestroId castOther = (BrkTSegSiniestroId) other;

            return ((Objects.equals(this.getCdCompania(), castOther.getCdCompania())) || (this.getCdCompania() != null && castOther.getCdCompania() != null && this.getCdCompania().equals(castOther.getCdCompania())))
                    && ((Objects.equals(this.getCdSegSiniestro(), castOther.getCdSegSiniestro())) || (this.getCdSegSiniestro() != null && castOther.getCdSegSiniestro() != null && this.getCdSegSiniestro().equals(castOther.getCdSegSiniestro())));
        }

        public int hashCode() {
            int result = 17;

            result = 37 * result + (getCdCompania() == null ? 0 : this.getCdCompania().hashCode());
            result = 37 * result + (getCdSegSiniestro() == null ? 0 : this.getCdSegSiniestro().hashCode());
            return result;
        }


    }

}
