package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @author dacopanCM on 25/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagoSiniestro implements Serializable {
    private Integer cdPago;
    private Integer cdReclamo;
    private Integer cdCompania;
    private BigDecimal valorSol;
    private Date fcPagoSol;
    private String formaPago;
    private Date fcPago;
    private BigDecimal valPago;
    private Date fcDocPago;
    private String banco;
    private String cheque;
    private String ctaCte;
    private String dscRubro;
    private String obsPago;
    private Boolean finiquito;
}
