package com.tefisoft.efiweb.entidad;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * @author dacopanCM on 15/08/17.
 */
@Entity
@Table(name = "BRK_T_UBICACION")
@IdClass(BrkTUbicacion.BrkTUbicacionId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraphs({
        @NamedEntityGraph(name = "graph.BrkTUbicacion.vam", attributeNodes = {
                @NamedAttributeNode("plan"),

        })
})
public class BrkTUbicacion implements Serializable {

    @Id
    @Column(name = "CD_COMPANIA", nullable = false)
    private Integer cdCompania;
    @Id
    @Column(name = "CD_UBICACION", nullable = false)
    private Integer cdUbicacion;

    @Column(name = "CD_RAMO_COTIZACION", nullable = false)
    private Integer cdRamoCotizacion;


    @Column(name = "DSC_UBICACION", nullable = false, length = 500)
    private String dscUbicacion;

    @Column(name = "ITEM", precision = 6)
    private Integer item;

    @Column(name = "TOT_PRI_ACTUAL", precision = 15)
    private BigDecimal totPriActual;

    @Column(name = "ACTIVO", precision = 1)
    private Boolean activo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_PLAN", nullable = false, insertable = false, updatable = false)
    private BrkTPlanes plan;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class BrkTUbicacionId implements java.io.Serializable {

        @Column(name = "CD_COMPANIA", nullable = false)
        private Integer cdCompania;
        @Column(name = "CD_UBICACION", nullable = false)
        private Integer cdUbicacion;

        public boolean equals(Object other) {
            if ((this == other)) return true;
            if ((other == null)) return false;
            if (!(other instanceof BrkTUbicacionId)) return false;
            BrkTUbicacionId castOther = (BrkTUbicacionId) other;

            return ((Objects.equals(this.getCdCompania(), castOther.getCdCompania())) || (this.getCdCompania() != null && castOther.getCdCompania() != null && this.getCdCompania().equals(castOther.getCdCompania())))
                    && ((Objects.equals(this.getCdUbicacion(), castOther.getCdUbicacion())) || (this.getCdUbicacion() != null && castOther.getCdUbicacion() != null && this.getCdUbicacion().equals(castOther.getCdUbicacion())));
        }

        public int hashCode() {
            int result = 17;

            result = 37 * result + (getCdCompania() == null ? 0 : this.getCdCompania().hashCode());
            result = 37 * result + (getCdUbicacion() == null ? 0 : this.getCdUbicacion().hashCode());
            return result;
        }

    }

}
