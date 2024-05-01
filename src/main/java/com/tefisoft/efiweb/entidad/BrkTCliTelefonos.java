package com.tefisoft.efiweb.entidad;
// Generated 23/06/2017 11:02:27 by Hibernate Tools 4.3.1


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/**
 * @author dacopanCM on 23/06/17.
 */
@Entity
@Table(name = "BRK_T_CLI_TELEFONOS")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrkTCliTelefonos implements java.io.Serializable {

    @Id
    @Column(name = "CD_CLI_TELEFONO", unique = true, nullable = false, precision = 22)
    private Integer cdCliTelefono;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_CIUDAD")
    private BrkTCiudades ciudad;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_CLIENTE")
    private BrkTClientes cliente;


    @Column(name = "TP_TELEFONO", length = 25)
    private String tpTelefono;


    @Column(name = "NUM_TELEFONO", length = 50)
    private String numTelefono;


    @Column(name = "ACTIVO", precision = 1)
    private Boolean activo;


    @Column(name = "PREFIJO", length = 10)
    private String prefijo;


    @Column(name = "EXTENSION", length = 100)
    private String extension;


    @Column(name = "RES_TELEFONO", length = 50)
    private String resTelefono;


    @Column(name = "VALIDO", precision = 1)
    private Boolean valido;


    @Column(name = "ACEPTA", precision = 1)
    private Boolean acepta;

}


