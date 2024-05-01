package com.tefisoft.efiweb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultIncapSiniestroPortal implements Serializable {

    private static final long serialVersionUID = 8547729230127685643L;

    private Integer cdCompania;
    private Integer cdReclamo;
    private String numSiniestro;
    private String contratante;
    private String asegurado;
    private String paciente;
    private Date fcCreacion;
    private String tpReclamo;
    private Date fcIncurrencia;
    private Date fcPrimeraFactura;
    private BigDecimal valorReclamoPortal;
    private String estadoPortal;
    private String obsSiniestro;
    private String poliza;
    private String nmIncapacidad;
    private String nmRamo;
    private Integer cdEjecutivo;
    private Integer item;
    private Integer cdIncSiniestro;
    private boolean caducado;
}
