package com.tefisoft.efiweb.entidad;
// Generated 23/06/2017 11:02:27 by Hibernate Tools 4.3.1


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author dacopanCM on 23/06/17.
 */
@Entity
@Table(name = "BRK_T_CIUDADES")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrkTCiudades implements java.io.Serializable {

    @Id
    @Column(name = "CD_CIUDAD", unique = true, nullable = false, precision = 12)
    private Integer cdCiudad;

    @Column(name = "NM_CIUDAD", length = 100)
    private String nmCiudad;

    @Column(name = "NM_ALIAS", length = 3)
    private String nmAlias;

    @Column(name = "CD_PROVINCIA", precision = 22)
    private Integer cdProvincia;

    @Column(name = "NM_PROVINCIA", length = 100)
    private String nmProvincia;

    @Column(name = "PREFIJO", length = 10)
    private String prefijo;

}


