package com.tefisoft.efiweb.dto;

import lombok.Data;

@Data
public class Ejecutivo {
    private Integer cdEjecutivo;
    private String nmAgente;
    private String apAgente;
    private String cedula;
    private String mail;
    private String tpPersAdm;
    private String direccion;
    private String estado;
    private Integer cdCompania;
    private String tpEjecutivo;
    private String cargo;
    private boolean seleccionado;
    private Integer usuarioweb;
    private Integer rnum;
}
