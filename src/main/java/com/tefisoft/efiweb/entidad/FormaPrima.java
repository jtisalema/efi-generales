package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @author dacopanCM on 30/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FormaPrima implements Serializable {

    private Integer cdFormaPrima;
    private String dscRubro;
    private BigDecimal valFormaPrima;
    private Integer periodo;
    private BigDecimal valTarjeta;
}
