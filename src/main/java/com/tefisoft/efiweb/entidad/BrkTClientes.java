package com.tefisoft.efiweb.entidad;
// Generated 23/06/2017 11:02:27 by Hibernate Tools 4.3.1

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * @author dacopanCM on 23/06/17.
 */
@Entity
@Table(name = "BRK_T_CLIENTES")
@NamedEntityGraphs({
        @NamedEntityGraph(name = "graph.Cliente.allNodes",
                attributeNodes = {
                        @NamedAttributeNode(value = "direcciones", subgraph = "direcciones")
                },
                subgraphs = {
                        @NamedSubgraph(name = "direcciones", attributeNodes = {
                                @NamedAttributeNode(value = "sector", subgraph = "sector")
                        }),
                        @NamedSubgraph(name = "sector", attributeNodes = {
                                @NamedAttributeNode(value = "ciudad", subgraph = "ciudad")
                        })
                },
                includeAllAttributes = true)
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrkTClientes implements java.io.Serializable {

    @Id
    @Column(name = "CD_CLIENTE", unique = true, nullable = false, precision = 22)
    private Integer cdCliente;

    private String rucCed;
    private String nmCliente;
    private String apCliente;
    private String tpCliente;
    private Character estado;
    private String direccion;
    private ZonedDateTime fcNacimiento;
    private String tpDocumento;
    private Short tpPersona;
    private String referencia;
    private String clase;
    private String actividad;
    private String categoria;
    private Integer cdSucursal;
    private ZonedDateTime fcEtiqueta;
    private ZonedDateTime fcCreacion;
    private String giroNegocioCli;
    private BigDecimal referido;
    private String calificacion;
    private String calificacionComis;
    private BigDecimal primaNeta;
    private BigDecimal comision;
    private String titulo;
    private String codigoCliente;
    private String tipoIdentificacion;
    private String digitoVerificador;
    private String nmConyuge;
    private String apConyuge;
    private String estadoCivil;
    private BigDecimal ingManual;
    private String usrocdgo;
    private String observaciones;
    private Character genero;


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cliente")
    private Set<BrkTEjecutivos> ejecutivos = new HashSet<>(0);


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cliente")
    private Set<BrkTDirecciones> direcciones = new HashSet<>(0);


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cliente")
    private Set<BrkTCliTelefonos> telefonos = new HashSet<>(0);

    public BrkTClientes(Integer cdCliente) {
        this.cdCliente = cdCliente;
    }
}
