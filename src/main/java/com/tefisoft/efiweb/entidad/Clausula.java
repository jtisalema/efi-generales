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
public class Clausula implements Serializable {

    private Integer cdClausulaNegocio;
    private Integer cdClausula;
    private Integer cdRamoCotizacion;
    private Integer cdCompania;
    private Boolean activo;
    private BigDecimal valLimite;
    private String obsClausulasNegocio;
    private Integer ordImpresion;
    private String nmClausula;
    private String unidades;

}
