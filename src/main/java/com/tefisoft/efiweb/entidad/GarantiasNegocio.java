package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

/**
 * @author dacopanCM on 14/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GarantiasNegocio implements Serializable {

    private Integer cdGarantiaNegocio;
    private Integer cdRamoCotizacion;
    private Integer cdCompania;
    private Integer cdGarantia;
    private String obsGarantiaNegocio;
    private Boolean activo;
    private Date fcMaxCondicionada;
    private Date fcEfecCumplimiento;
    private String nmGarantia;
}
