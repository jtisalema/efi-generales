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
public class GastosVam implements Serializable {

    private Integer cdGastosVam;
    private Integer cdReclamo;
    private String numRecibo;
    private Date fcGasto;
    private String detalle;
    private BigDecimal valor;
    private BigDecimal valNoCubierto;
    private BigDecimal valorAPagar;
    private Boolean aprobado;
    private String envio;
    private String obsGastoVam;
    private Short item;
    private Short tipo;
    private String carta;
    private Date fcUltimodoc;
    private Boolean impreso;
    private BigDecimal valorPagado;
    private Long bloqueo;
    private Integer cdCobertura;
    private String nmCobertura;
    private Boolean docAdic;
    private Boolean adicional;
}
