package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

/**
 * @author dacopanCM on 25/08/17.
 */
@Entity
@Table(name = "BRK_T_SINIESTRO")
@IdClass(BrkTSiniestro.BrkTSiniestroId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraphs({
        @NamedEntityGraph(name = "graph.BrkTSiniestro.general", includeAllAttributes = true, attributeNodes = {
                @NamedAttributeNode("aseguradora"),
                @NamedAttributeNode("compania"),
                @NamedAttributeNode("asegurado"),
                @NamedAttributeNode("ramosCotizacion"),
                @NamedAttributeNode("ramo"),
                @NamedAttributeNode(value = "objeto", subgraph = "objSiniestros"),
                @NamedAttributeNode(value = "estadoActivo", subgraph = "segSiniestro"),
        }, subgraphs = {
                @NamedSubgraph(name = "objSiniestros", attributeNodes = {
                        @NamedAttributeNode(value = "objCotizacion", subgraph = "objCotizacion")
                }),
                @NamedSubgraph(name = "segSiniestro", attributeNodes = {
                        @NamedAttributeNode(value = "estSiniestro")
                }),
                @NamedSubgraph(name = "objCotizacion", attributeNodes = {
                        @NamedAttributeNode(value = "vehiculo")
                })
        })
})
public class BrkTSiniestro implements java.io.Serializable {


    @Id
    @Column(name = "CD_COMPANIA", nullable = false, precision = 22)
    private Integer cdCompania;
    @Id
    @Column(name = "CD_RECLAMO", nullable = false, precision = 22)
    private Integer cdReclamo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_ASEGURADORA")
    private BrkTAseguradoras aseguradora;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_COMPANIA", nullable = false, insertable = false, updatable = false)
    private Compania compania;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_RAMO", nullable = false)
    private BrkTRamos ramo;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_RAMO_COTIZACION", referencedColumnName = "CD_RAMO_COTIZACION", nullable = false, insertable = false, updatable = false)})
    private BrkTRamosCotizacion ramosCotizacion;


    @Column(name = "CD_CLIENTE", nullable = false, precision = 22)
    private Integer cdCliente;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_ASEGURADO", nullable = false)
    @NotFound(action = NotFoundAction.IGNORE)
    private BrkTClientes asegurado;


    @Column(name = "NUM_SINIESTRO", nullable = false, precision = 22)
    private Integer numSiniestro;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_CREACION", length = 7)
    private Date fcCreacion;


    @Column(name = "REF_AVISO", length = 30)
    private String refAviso;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_SINIESTRO", length = 7)
    private Date fcSiniestro;


    @Column(name = "CAUSA", length = 1000)
    private String causa;


    @Column(name = "OBS_SINIESTRO", length = 1000)
    private String obsSiniestro;


    @Column(name = "POLIZA", length = 30)
    private String poliza;


    @Column(name = "NUM_REP_ASEG", length = 30)
    private String numRepAseg;


    @Column(name = "NUM_ASEGURADORA", length = 30)
    private String numAseguradora;


    @Column(name = "ANEXO", length = 50)
    private String anexo;


    @Column(name = "ANO_SINIESTRO", precision = 4)
    private Integer anoSiniestro;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_RECPCION_BRK", length = 7)
    private Date fcRecpcionBrk;

    @Column(name = "FLG_AMV", precision = 1)
    private Boolean flgAmv;


    @OneToOne(fetch = FetchType.LAZY, mappedBy = "siniestro")
    private BrkTObjSiniestro objeto;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "siniestro")
    private BrkTSegSiniestro estadoActivo;// = new HashSet<>(0);


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BrkTSiniestroId implements java.io.Serializable {

        @Column(name = "CD_COMPANIA", nullable = false, precision = 22)
        private Integer cdCompania;
        @Column(name = "CD_RECLAMO", nullable = false, precision = 22)
        private Integer cdReclamo;


        public boolean equals(Object other) {
            if ((this == other)) return true;
            if ((other == null)) return false;
            if (!(other instanceof BrkTSiniestroId)) return false;
            BrkTSiniestroId castOther = (BrkTSiniestroId) other;

            return ((Objects.equals(this.getCdCompania(), castOther.getCdCompania())) || (this.getCdCompania() != null && castOther.getCdCompania() != null && this.getCdCompania().equals(castOther.getCdCompania())))
                    && ((Objects.equals(this.getCdReclamo(), castOther.getCdReclamo())) || (this.getCdReclamo() != null && castOther.getCdReclamo() != null && this.getCdReclamo().equals(castOther.getCdReclamo())));
        }

        public int hashCode() {
            int result = 17;

            result = 37 * result + (getCdCompania() == null ? 0 : this.getCdCompania().hashCode());
            result = 37 * result + (getCdReclamo() == null ? 0 : this.getCdReclamo().hashCode());
            return result;
        }

    }

}

