package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.NamedEntityGraphs;
import javax.persistence.NamedSubgraph;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

/**
 * @author dacopanCM on 07/08/17.
 */
@Entity
@Table(name = "BRK_T_RAMOS_COTIZACION")
@IdClass(BrkTRamosCotizacion.BrkTRamosCotizacionId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraphs({
        @NamedEntityGraph(name = "graph.RamosCotizacion.basic", attributeNodes = {
                @NamedAttributeNode("grupo"),
                @NamedAttributeNode(value = "cotizacion", subgraph = "cotizacion"),
                @NamedAttributeNode("ramo"),
        }, subgraphs = {
                @NamedSubgraph(name = "cotizacion", attributeNodes = {
                        @NamedAttributeNode(value = "aseguradora"),
                        @NamedAttributeNode(value = "aseguradora")
                })
        })
})
public class BrkTRamosCotizacion implements java.io.Serializable {


    @Id
    private Integer cdCompania;
    @Id
    private Integer cdRamoCotizacion;


    @Column(name = "CD_CLIENTE", nullable = false, precision = 22)
    private Integer cdCliente;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CD_CLI_GRUPO")
    private BrkTCliGrupo grupo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_COTIZACION", referencedColumnName = "CD_COTIZACION", nullable = false, insertable = false, updatable = false)})
    private BrkTCotizaciones cotizacion;

//    private Integer cdRamo; //este campo ahora se lo obtiene directamente del objeto ramo

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_RAMO", nullable = false)
    private BrkTRamos ramo;


    private BigDecimal valAsegurado;


    @Column(name = "VAL_PRIMA", precision = 15)
    private BigDecimal valPrima;


    @Column(name = "PCT_COM_BROKER", precision = 15)
    private BigDecimal pctComBroker;


    @Column(name = "VAL_COM_BROKER", precision = 15)
    private BigDecimal valComBroker;


    @Column(name = "PCT_COM_AGENTE", precision = 15)
    private BigDecimal pctComAgente;


    @Column(name = "VAL_COM_AGENTE", precision = 15)
    private BigDecimal valComAgente;


    @Column(name = "TOT_ASEGURADO", precision = 15)
    private BigDecimal totAsegurado;


    @Column(name = "SAL_ASEGURADORA", precision = 15)
    private BigDecimal salAseguradora;


    @Column(name = "TOT_PRIMA", precision = 15)
    private BigDecimal totPrima;


    @Column(name = "CON_SUPER_BAN", precision = 15)
    private BigDecimal conSuperBan;


    @Column(name = "DERE_EMISION", precision = 15)
    private BigDecimal dereEmision;


    @Column(name = "VAL_IVA", precision = 15)
    private BigDecimal valIva;


    @Column(name = "ACEPTA_CLI", length = 1)
    private String aceptaCli;


    @Column(name = "ORD_EMISION", precision = 22)
    private BigDecimal ordEmision;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_ORD_EMISION", length = 7)
    private Date fcOrdEmision;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_DESDE", length = 7)
    private Date fcDesde;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_HASTA", length = 7)
    private Date fcHasta;

    @Temporal(TemporalType.DATE)
    @Column(name = "fc_vence_mst", length = 7)
    private Date fcVenceMst;


    @Column(name = "DIAS_VIGENCIA", precision = 22)
    private BigDecimal diasVigencia;


    @Column(name = "POLIZA", length = 50)
    private String poliza;


    @Column(name = "ANEXO", length = 50)
    private String anexo;


    @Column(name = "FACT_ASEG", length = 30)
    private String factAseg;


    @Column(name = "FLG_PAGO_COM", length = 1)
    private String flgPagoCom;


    @Column(name = "TOT_ASE_ACTUAL", precision = 15)
    private BigDecimal totAseActual;


    @Column(name = "TOT_PRI_ACTUAL", precision = 15)
    private BigDecimal totPriActual;


    @Column(name = "CD_RAM_COT_ACTUAL", precision = 22)
    private Integer cdRamCotActual;

    @Column(name = "MOD_VIDA", length = 10)
    private String modVida;


    @Column(name = "CD_RAM_COT_ORI", precision = 22)
    private Integer cdRamCotOri;


    @Column(name = "ITEM", precision = 6)
    private Integer item;


    @Column(name = "OBS_RAMO_COTIZA", length = 4000)
    private String obsRamoCotiza;


    @Column(name = "TIPO_POL", length = 1)
    private Character tipoPol;


    @Column(name = "NUM_OPERACION", length = 30)
    private String numOperacion;


    @Column(name = "NUM_APLICA", length = 20)
    private String numAplica;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_RENOVA_FAC", length = 7)
    private Date fcRenovaFac;


    @Column(name = "COD_CIERRE", length = 15)
    private String codCierre;


    @Temporal(TemporalType.DATE)
    @Column(name = "FC_TERMINOS_RENOVA", length = 7)
    private Date fcTerminosRenova;


    @Column(name = "AXA", precision = 1)
    private Boolean axa;


    @Column(name = "PRIMA_AXA", precision = 15)
    private BigDecimal primaAxa;


    @Column(name = "NUM_RENOVA", precision = 22)
    private BigDecimal numRenova;


    private Integer cdEjecutivo;
    private Integer cdAgente;

    //    @Transient
//    public boolean isVam() {
//        String nmRamo = ramo == null ? null : ramo.getNmRamo();
//        boolean tmp=nmRamo != null && (nmRamo.contains(Ctns.KEY_RAMO_VIDA) || nmRamo.contains(Ctns.KEY_RAMO_MEDICA));
//        return tmp;
//    }
//    @Transient
//    public boolean isVam() {
//        System.out.println("isVam" + ramo.getNmAlias());
//        return false;
//    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BrkTRamosCotizacionId implements java.io.Serializable {

        @Column(name = "CD_COMPANIA", nullable = false, precision = 22)
        private Integer cdCompania;
        @Column(name = "CD_RAMO_COTIZACION", nullable = false, precision = 22)
        private Integer cdRamoCotizacion;

        public boolean equals(Object other) {
            if ((this == other)) return true;
            if ((other == null)) return false;
            if (!(other instanceof BrkTRamosCotizacionId)) return false;
            BrkTRamosCotizacionId castOther = (BrkTRamosCotizacionId) other;

            return ((Objects.equals(this.getCdCompania(), castOther.getCdCompania())) || (this.getCdCompania() != null && castOther.getCdCompania() != null && this.getCdCompania().equals(castOther.getCdCompania())))
                    && ((Objects.equals(this.getCdRamoCotizacion(), castOther.getCdRamoCotizacion())) || (this.getCdRamoCotizacion() != null && castOther.getCdRamoCotizacion() != null && this.getCdRamoCotizacion().equals(castOther.getCdRamoCotizacion())));
        }

        public int hashCode() {
            int result = 17;

            result = 37 * result + (getCdCompania() == null ? 0 : this.getCdCompania().hashCode());
            result = 37 * result + (getCdRamoCotizacion() == null ? 0 : this.getCdRamoCotizacion().hashCode());
            return result;
        }

    }

    public Integer getCdRamo() {
        return ramo.getCdRamo();
    }
}

