package com.tefisoft.efiweb.entidad;

import com.tefisoft.efiweb.util.Ctns;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @author dacopanCM on 14/08/17.
 */
@Entity
@Table(name = "BRK_T_V_POLIZAS")
@Immutable
@NamedEntityGraphs({
        @NamedEntityGraph(name = "graph.BrkTVPolizas.basic", attributeNodes = {
                @NamedAttributeNode("ramosCotizacion"),
                @NamedAttributeNode("compania")
        })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTVPolizas implements Serializable {

    @Id
    @Column(name = "CD_RAMO_COTIZACION", nullable = false)
    private Integer cdRamoCotizacion;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_RAMO_COTIZACION", referencedColumnName = "CD_RAMO_COTIZACION", nullable = false, insertable = false, updatable = false)})
    private BrkTRamosCotizacion ramosCotizacion;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_COMPANIA", nullable = false, insertable = false, updatable = false)
    public Compania compania;

    @Column(name = "CD_COTIZACION", nullable = false)
    private Integer cdCotizacion;

    @Column(name = "CD_CLIENTE", nullable = false)
    private Integer cdCliente;

    @Column(name = "NM_ASEGURADORA", length = 80)
    private String nmAseguradora;

    @Column(name = "CD_RAMO", nullable = false)
    private Integer cdRamo;

    @Column(name = "NM_RAMO", length = 50)
    private String nmRamo;


    @Column(name = "POLIZA", length = 50)
    private String poliza;

    @Column(name = "ANEXO", length = 50)
    private String anexo;

    @Column(name = "FACT_ASEG", length = 30)
    private String factAseg;


    @Column(name = "TIPO", length = 30)
    private String tipo;

    @Temporal(TemporalType.DATE)
    @Column(name = "FC_HASTA", length = 7)
    private Date fcHasta;

//    @Column(name = "SOL_ORIGEN", nullable = false, precision = 22)
//    private Long solOrigen;

    @Column(name = "CD_ASEGURADORA", nullable = false, precision = 22)
    private Integer cdAseguradora;

    @Temporal(TemporalType.DATE)
    @Column(name = "FC_DESDE", length = 7)
    private Date fcDesde;

    @Column(name = "NUM_OPERACION", length = 30)
    private String numOperacion;

    @Column(name = "ASEGURADORA", length = 20)
    private String aseguradora;

    @Column(name = "RAMO", length = 6)
    private String ramo;

    @Column(name = "num_cotizacion", length = 50)
    private String numCotizacion;

    @Column(name = "cd_subarea", nullable = false, precision = 22)
    private Integer cdSubarea;

    @Column(name = "TOT_ASEGURADO", precision = 22)
    private BigDecimal totAsegurado;

    @Column(name = "TOT_PRIMA", precision = 22)
    private BigDecimal totPrima;

    @Column(name = "APLICACION", length = 50)
    private String numAplica;

    @Transient
    @SuppressWarnings("unused")
    public boolean isVam() {
        return nmRamo != null && (nmRamo.contains(Ctns.KEY_RAMO_VIDA) || nmRamo.contains(Ctns.KEY_RAMO_MEDICA));
    }
}
