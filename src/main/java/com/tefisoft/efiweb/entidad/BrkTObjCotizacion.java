package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

/**
 * @author dacopanCM on 15/08/17.
 */
@Entity
@Table(name = "BRK_T_OBJ_COTIZACION")
@IdClass(BrkTObjCotizacion.BrkTObjCotizacionId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraphs({
        @NamedEntityGraph(name = "graph.ObjCotizacion.general", attributeNodes = {
                @NamedAttributeNode("ubicacion"),

        }),
        @NamedEntityGraph(name = "graph.ObjCotizacion.vehiculo", attributeNodes = {
                @NamedAttributeNode("vehiculo"),

        }),
        @NamedEntityGraph(name = "graph.ObjCotizacion.vam", attributeNodes = {
                @NamedAttributeNode(value = "ubicacion", subgraph = "ubicacion"),

        }, subgraphs = {
                @NamedSubgraph(name = "ubicacion", attributeNodes = {
                        @NamedAttributeNode(value = "plan", subgraph = "plan")
                })
        })
})
public class BrkTObjCotizacion implements Serializable {


    @Id
    @Column(name = "CD_COMPANIA", nullable = false)
    private Integer cdCompania;
    @Id
    private Integer cdObjCotizacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_RAMO_COTIZACION", referencedColumnName = "CD_RAMO_COTIZACION", nullable = false, insertable = false, updatable = false)})
    private BrkTRamosCotizacion ramosCotizacion;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_UBICACION", referencedColumnName = "CD_UBICACION", nullable = false, insertable = false, updatable = false)})
    private BrkTUbicacion ubicacion;


    private Boolean activo;
    private Integer exclusion;
    private Integer inclusion;


    @Column(name = "TASA", precision = 10, scale = 5)
    private BigDecimal tasa;


    @Column(name = "TOT_ASE_ACTUAL", precision = 15)
    private BigDecimal totAseActual;


    @Column(name = "TOT_PRI_ACTUAL", precision = 15)
    private BigDecimal totPriActual;


    @Column(name = "ITEM", precision = 6)
    private Integer item;


    @Column(name = "DSC_OBJETO", nullable = false, length = 200)
    private String dscObjeto;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_NACIMIENTO", length = 7)
    private Date fcNacimiento;

    @Temporal(TemporalType.DATE)
    @Column(name = "FC_INICIO", length = 7)
    private Date fcInicio;

    @Temporal(TemporalType.DATE)
    @Column(name = "FC_FIN", length = 7)
    private Date fcFin;


    @Column(name = "CEDULA_O", nullable = false, length = 200)
    private String cedulaO;


    @Column(name = "TRAYECTO", nullable = false, length = 500)
    private String trayecto;


    @Column(name = "TR_HASTA", nullable = false, length = 500)
    private String trHasta;

    @Column(name = "Cantidad", nullable = false, length = 500)
    private Integer cantidad;

    private String itemAseg;
    private String obsObjeto;
    private Integer cdAsegurado;


    @OneToOne(fetch = FetchType.LAZY, mappedBy = "objCotizacion")
    BrkTObjCarVehiculos vehiculo;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BrkTObjCotizacionId implements java.io.Serializable {

        @Column(name = "CD_COMPANIA", nullable = false)
        private Integer cdCompania;
        @Column(name = "CD_OBJ_COTIZACION", nullable = false)
        private Integer cdObjCotizacion;


        public boolean equals(Object other) {
            if ((this == other)) return true;
            if ((other == null)) return false;
            if (!(other instanceof BrkTObjCotizacionId)) return false;
            BrkTObjCotizacionId castOther = (BrkTObjCotizacionId) other;

            return ((Objects.equals(this.getCdCompania(), castOther.getCdCompania())) || (this.getCdCompania() != null && castOther.getCdCompania() != null && this.getCdCompania().equals(castOther.getCdCompania())))
                    && ((Objects.equals(this.getCdObjCotizacion(), castOther.getCdObjCotizacion())) || (this.getCdObjCotizacion() != null && castOther.getCdObjCotizacion() != null && this.getCdObjCotizacion().equals(castOther.getCdObjCotizacion())));
        }

        public int hashCode() {
            int result = 17;

            result = 37 * result + (getCdCompania() == null ? 0 : this.getCdCompania().hashCode());
            result = 37 * result + (getCdObjCotizacion() == null ? 0 : this.getCdObjCotizacion().hashCode());
            return result;
        }


    }


}
