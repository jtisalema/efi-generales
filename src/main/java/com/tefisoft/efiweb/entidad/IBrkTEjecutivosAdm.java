package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author dacopan on 05/11/19
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IBrkTEjecutivosAdm {

    private Integer cdCliEjeAdm;
    private Integer cdCompania;
    private String nmAgente;
    private String apAgente;
    private Integer cdEjecutivo;
    private Integer cdEjeadmRamgrp;
    private String nmRamGrupo;
    private String agente;
    private String area;
}
