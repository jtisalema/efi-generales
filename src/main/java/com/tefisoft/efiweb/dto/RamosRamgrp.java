package com.tefisoft.efiweb.dto;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(
        name = "BRK_T_RAMOS_RAMGRP"
)
@Data
public class RamosRamgrp implements Serializable {
    @Id
    @Column(
            name = "CD_RAMOS_RAMGRP",
            unique = true,
            nullable = false,
            precision = 22,
            scale = 0
    )
    private Integer cdRamosRamGrupo;
    @Column(
            name = "CD_COMPANIA",
            precision = 22,
            scale = 0
    )
    private Integer cdCompania;
    @Column(
            name = "CD_RAMO",
            precision = 22,
            scale = 0
    )
    private Integer cdRamo;
    @Column(
            name = "CD_RAM_GRUPO",
            unique = true,
            nullable = false,
            precision = 22,
            scale = 0
    )
    private Integer cdRamGrupo;
    @Column(
            name = "ACTIVO",
            precision = 1,
            scale = 0
    )
    private Boolean activo;

    public RamosRamgrp() {
    }

}
