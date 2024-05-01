package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @author private String copanCM on 25/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CobDedSiniestro implements Serializable {

    private Integer cdCobDedSiniestro;
    private String nmCobertura;
    private BigDecimal valLimite;
    private String aceptado;
    private BigDecimal pctReclamo;
    private BigDecimal pctVAseg;
    private BigDecimal valMinimo;
    private BigDecimal valFijo;
    private String observaciones;
    private Integer cdCompania;
    private Integer cdReclamo;

    private BigDecimal valSiniestro;
    private BigDecimal valExceso;
    private BigDecimal valNoelegible;
    private BigDecimal valTotal;
    private BigDecimal valDeducible;
    private BigDecimal valMontoCoa;

}
