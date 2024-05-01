package com.tefisoft.efiweb.entidad;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * @author dacopanCM on 07/08/17.
 */
@Entity
@Table(name = "BRK_T_FVINCULACION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraphs({
        @NamedEntityGraph(name = "graph.Fvinculacion.basic", attributeNodes = {
                @NamedAttributeNode("aseguradora")
        }),
        @NamedEntityGraph(name = "graph.Fvinculacion.allNodes",
                attributeNodes = {
                        @NamedAttributeNode("aseguradora"),
                        @NamedAttributeNode(value = "detFvinculacion", subgraph = "detFvinculacion")
                },
                subgraphs = {
                        @NamedSubgraph(name = "detFvinculacion", attributeNodes = {
                                @NamedAttributeNode(value = "documento")
                        })
                })
})
public class BrkTFvinculacion implements java.io.Serializable {

    @Id
    //@Column(name = "CD_FVINCULACION", unique = true, nullable = false, precision = 22)
    private Integer cdFvinculacion;


    @ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "CD_ASEGURADORA", nullable = false)
    private BrkTAseguradoras aseguradora;


    //@Column(name = "CD_CLIENTE", nullable = false, precision = 22)
    private Integer cdCliente;


    //@Column(name = "CD_COMPANIA", nullable = false, precision = 22)
    private Integer cdCompania;


    //@Temporal(TemporalType.DATE)
    private Date fcDesde;


    //@Temporal(TemporalType.DATE)
    private Date fcHasta;


    //@Column(name = "COMPLETO", precision = 22)
    private Boolean completo;


    //@Column(name = "DIAS_VIGENCIA", precision = 22)
    private Integer diasVigencia;


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "fvinculacion")
    private Set<BrkTDetFvinculacion> detFvinculacion = new HashSet<>(0);

}


