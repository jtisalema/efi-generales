package com.tefisoft.efiweb.dto;

import lombok.Data;

import java.sql.Date;

@Data
public class ClienteGenWeb {

    private Integer cdCliContac;
    private Integer cdCompania;
    private Integer cdAdicional;
    private Integer cdEjecutivo;
    private Integer cdCliente;
    private String cedula;
    private String nmAsegurado;
    private String apAsegurado;
    private Date fcCreacion;
    private String usuarioWeb;
    private boolean activo;
    private String nmEjecutivo;
    private String apEjecutivo;


}
