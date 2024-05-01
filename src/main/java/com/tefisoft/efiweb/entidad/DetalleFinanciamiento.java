package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @author dacopanCM on 01/09/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleFinanciamiento {

    private String factAseg;
    private String cdCompania;
    private String obsDocFinanciamiento;
    private BigDecimal valor;
    private Date fcVencimiento;
    private Boolean pagoFact;
}
