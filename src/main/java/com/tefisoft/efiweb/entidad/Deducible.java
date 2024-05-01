package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @author dacopanCM on 10/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Deducible implements Serializable {

    private Integer cdDeducible;
    private Integer cdCobNegocio;
    private Integer cdCompania;
    private BigDecimal pctVAseg;
    private BigDecimal pctReclamo;
    private BigDecimal valMinimo;
    private String obsDeducible;
    private Integer cdRamoCotizacion;
    private String nmCobertura;
    private BigDecimal valFijo;
    private Boolean activo;
}
