package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @author dacopanCM on 30/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subobjetos implements Serializable {

    private Integer cdSubobjeto;
    private String dscSubobjeto;
    private Date fcNacimiento;
    private String obsSubobjeto;
    private BigDecimal beneficio;
    private Boolean activo;
    private String cedulaS;
    private BigDecimal totAseActual;
    private BigDecimal totPriActual;
    private BigDecimal tasa;
    private BigDecimal cdCompania;
    private BigDecimal cdAsegurado;
}
