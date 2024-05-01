package com.tefisoft.efiweb.entidad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 * @author dacopanCM on 04/07/17.
 */
@Entity
@Table(name = "BRK_T_TELEFONOS")
@IdClass(BrkTTelefonos.BrkTTelefonosId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTTelefonos implements java.io.Serializable {

    @Id
    @Column(name = "CD_COMPANIA", nullable = false, precision = 22)
    private Integer cdCompania;
    @Id
    private Integer cdTelefono;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_CODIGO", referencedColumnName = "CD_EJECUTIVO", nullable = false, insertable = false, updatable = false)
    })
    private BrkTEjecutivos ejecutivo;

    @Temporal(TemporalType.DATE)
    @Column(name = "FC_VALIDO", length = 7)
    private Date fcValido;


    @Column(name = "TP_TELEFONO", length = 20)
    private String tpTelefono;


    @Column(name = "NUM_TELEFONO", length = 20)
    private String numTelefono;


    @Column(name = "CD_TABLA", nullable = false, precision = 22)
    private Integer cdTabla;


    @Column(name = "ESTADO", length = 1)
    private Character estado;


    @Column(name = "MAIL", length = 50)
    private String mail;


    @Column(name = "PREFIJO", length = 10)
    private String prefijo;


    @Column(name = "CD_CIUDAD", precision = 12)
    private Integer cdCiudad;


    @Column(name = "RES_TELEFONO", length = 20)
    private String resTelefono;


    @Column(name = "EXTENSION", length = 100)
    private String extension;


    @Column(name = "VALIDO", precision = 1)
    private Boolean valido;


    @Column(name = "ACEPTA", precision = 1)
    private Boolean acepta;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_ACEPTA", length = 7)
    private Date fcAcepta;


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BrkTTelefonosId implements java.io.Serializable {

        private Integer cdCompania;
        private Integer cdTelefono;

        public boolean equals(Object other) {
            if ((this == other)) return true;
            if ((other == null)) return false;
            if (!(other instanceof BrkTTelefonosId)) return false;
            BrkTTelefonosId castOther = (BrkTTelefonosId) other;

            return ((this.getCdCompania() == castOther.getCdCompania()) || (this.getCdCompania() != null && castOther.getCdCompania() != null && this.getCdCompania().equals(castOther.getCdCompania())))
                    && ((this.getCdTelefono() == castOther.getCdTelefono()) || (this.getCdTelefono() != null && castOther.getCdTelefono() != null && this.getCdTelefono().equals(castOther.getCdTelefono())));
        }

        public int hashCode() {
            int result = 17;

            result = 37 * result + (getCdCompania() == null ? 0 : this.getCdCompania().hashCode());
            result = 37 * result + (getCdTelefono() == null ? 0 : this.getCdTelefono().hashCode());
            return result;
        }

    }
}


