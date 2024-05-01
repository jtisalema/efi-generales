package com.tefisoft.efiweb.entidad;
// Generated 23/06/2017 13:51:29 by Hibernate Tools 4.3.1


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/**
 * BrkTDirecciones generated by hbm2java
 */
@Entity
@Table(name = "BRK_T_DIRECCIONES")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrkTDirecciones implements java.io.Serializable {

    @Id
    @Column(name = "CD_DIRECCION", unique = true, nullable = false, precision = 22, scale = 0)
    private Integer cdDireccion;


    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "CD_BENEFICIARIOS")
    //private BrkTBeneficiarios brkTBeneficiarios;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_CIUDAD")
    private BrkTCiudades ciudad;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_CLIENTE")
    private BrkTClientes cliente;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_CIUDAD", referencedColumnName = "CD_CIUDAD", insertable = false, updatable = false),
            @JoinColumn(name = "SECTOR", referencedColumnName = "SECTOR", insertable = false, updatable = false)})
    private BrkTCliSector sector;

    @Column(name = "DSC_DIRECCION", length = 250)
    private String dscDireccion;


    @Column(name = "REFERENCIA", length = 50)
    private String referencia;


    @Column(name = "ENVIO", precision = 1)
    private Boolean envio;


    @Column(name = "OBSERVACIONES", length = 50)
    private String observaciones;

}

