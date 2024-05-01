package com.tefisoft.efiweb.dto;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(
        name = "BRK_T_RAM_GRUPO"
)
@Data
public class RamGrupo implements Serializable {
    @Id
    @Column(
            name = "CD_RAM_GRUPO",
            unique = true,
            nullable = false,
            precision = 22,
            scale = 0
    )
    private Integer cdRamGrupo;
    @Column(
            name = "CD_COMPANIA",
            precision = 22,
            scale = 0
    )
    private Integer cdCompania;
    @Column(
            name = "NM_RAM_GRUPO",
            length = 50
    )
    private String nmRamGrupo;
    @Column(
            name = "AC_RAM_GRUPO",
            length = 1
    )
    private String acRamGrupo;
    @Column(
            name = "NM_ALIAS",
            length = 4
    )
    private String nmAlias;
    @Column(
            name = "NUM_DIAS_GARANTIAS",
            precision = 22,
            scale = 0
    )
    private Integer numDiasGarantias;
    @Column(
            name = "ORDEN",
            precision = 22,
            scale = 0
    )
    private Integer orden;

    public RamGrupo() {
    }

}
