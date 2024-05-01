package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumenGastosLiquidacion implements Serializable {

    private Integer cdCompania;
    private Integer cdPreliqSiniestro;
    private Integer cdReclamo;
    private BigDecimal valPerdida;
    private BigDecimal valDepreciacion;
    private BigDecimal valDeducible;
    private BigDecimal valIndemnizacion;
    private BigDecimal indemnizacion;
    private BigDecimal valRasa;
    private BigDecimal valPagoParcial;
    private BigDecimal valSalvamento;
    private BigDecimal valOtros;
    private BigDecimal valRecibir;
    private String observaciones;
    private BigDecimal actRasa;
    private Date fcSeguimiento;
    private Date numCartaSeg;
    private String notaDebito;
    private BigDecimal valPagoProvOtros;
    private Integer pagoNd;


}
