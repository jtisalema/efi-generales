package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * @author dacopanCM on 13/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aclaratorios implements Serializable{

    private Integer cdAclaratorio;
    private String txtAclaratorio;
    //    private Date fcCreacion;
    private Long numAclaratorio;
    private Integer cdRamoCotizacion;
    private Boolean activo;
    //    private Date FcModificacion;
    private String tipo;
    private String cdRamoCotizacionAnexo;
}
