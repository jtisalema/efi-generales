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
@Table(name = "BRK_T_CLI_SECTOR")
@IdClass(BrkTCliSectorId.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrkTCliSector implements java.io.Serializable {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CD_CIUDAD", nullable = false, insertable = false, updatable = false)
    private BrkTCiudades ciudad;

    @Id
    private Integer cdCiudad;

    @Id
    private String sector;
}


