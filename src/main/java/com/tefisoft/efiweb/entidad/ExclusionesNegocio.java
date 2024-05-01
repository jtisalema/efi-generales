package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * @author dacopanCM on 30/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExclusionesNegocio implements Serializable {

    private Integer cdExcNegocio;
    private Integer ordImpresion;
    private String dscExclusion;
    private String obsExcNegocio;
    private Boolean aceptada;
}
