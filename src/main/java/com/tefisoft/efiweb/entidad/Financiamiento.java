package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @author dacopanCM on 18/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Financiamiento implements Serializable {

    private Integer cdFinanciamiento;
    private Integer cdFormaPago;
    private Integer ordinal;
    private Long numAseguradora;
    private String frmFinanciamiento;
    private BigDecimal valor;
    private BigDecimal saldo;
    private Integer cdCompania;
    private String numDocumento;
    private Date fcVencimiento;
    private BigDecimal saldoPago;
    private String observaciones;
    private String factAseg;
    private String letras;
    private String flgPago;
    private Date fcIngresoFactura;
    private Date fcDesde;
    private Date fcHasta;
    private Date fcRecepcionFactura;
    private Boolean detalles;
}
