package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @author dacopanCM on 08/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cobertura implements Serializable {

    private Integer cdCobNegocio;
    private Integer ordImpresion;
    private String nmCobertura;
    private BigDecimal valLimite;
    private BigDecimal tasa;
    private String factor;
    private BigDecimal valPrima;
    private String dscRubro;
    private String obsCobNegocio;
    private String adicionalRamo;
}
