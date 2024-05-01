package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @author dacopanCM on 01/09/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IncapSiniestro implements Serializable {

    private Integer cdIncSiniestro;
    private Integer cdReclamo;
    private Integer cdCompania;
    private String aliasCompania;
    private String numSiniestro;
    private String item;
    private Short anoSiniestro;
    private Integer cdAseguradoTit;
    private String aliasEstado;
    private String poliza;
    private String nmRamo;
    private String nmRamoAlias;
    private String nmAseg;
    private String nmAseguradora;
    private String clAsegurado;
    private String dscObjeto;
    private Integer cdIncapacidad;
    private String nmIncapacidad;
    private Date fcUltimodoc;
    private Integer dias;
    private Integer dias2;
    private String titular;
    private String tpSiniestro;
    private BigDecimal valIncurrido;
    private Date fcSiniestro;
    private Integer cdCliente;
    private String estado;
    private Integer cdAsegurado;
    private Integer cdRamo;
    private Integer cdRamoCotizacion;
}
