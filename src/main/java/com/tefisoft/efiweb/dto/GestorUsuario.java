package com.tefisoft.efiweb.dto;

import lombok.Data;

import java.sql.Date;

@Data
public class GestorUsuario {

    private Integer rnum;
    private Integer cdCliente;
    private String rucCed;
    private String nmCliente;
    private String apCliente;
    private Integer cdEjecutivo;
    private String nmEjecutivo;
    private String apEjecutivo;
    private String rucCedE; // ejecutivos
    private String cargo;
    private Date fcNacimiento;
    private Integer usuarioweb; // ejecutivos
    private String titulo;
    private String mail;
    private Integer usuarioWebT; // telefonos
    private Integer valido;
    private Integer selecciona;
    private Integer desactiva;

}
