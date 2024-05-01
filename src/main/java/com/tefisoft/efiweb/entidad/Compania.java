package com.tefisoft.efiweb.entidad;
// Generated 23/06/2017 11:02:27 by Hibernate Tools 4.3.1


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/**
 * @author dacopanCM on 23/06/17.
 */
@Entity
@Table(name = "BRK_T_COMPANIA", uniqueConstraints = @UniqueConstraint(columnNames = "NOMBRE"))
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Compania implements java.io.Serializable {

    @Id
    @Column(name = "CD_COMPANIA", unique = true, nullable = false, precision = 22)
    private Integer cdCompania;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_CIUDAD", nullable = false)
    private BrkTCiudades ciudad;


    @Column(name = "NOMBRE", unique = true, nullable = false, length = 100)
    private String nombre;


    @Column(name = "RUC", nullable = false, length = 15)
    private String ruc;


    @Column(name = "DIRECCION", length = 100)
    private String direccion;


    @Column(name = "PAIS", length = 50)
    private String pais;


    @Column(name = "TP_COMPANIA", length = 20)
    private String tpCompania;

    @Column(name = "ALIAS_COMPANIA", length = 100)
    private String aliasCompania;


    @Column(name = "RAZON_SOCIAL", length = 100)
    private String razonSocial;


    @Column(name = "CORREO", length = 50)
    private String correo;

    @Column(name = "REF_MATRIZ", length = 30)
    private Long refMatriz;

}


