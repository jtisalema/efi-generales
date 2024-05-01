package com.tefisoft.efiweb.entidad;

import lombok.Data;

@Data
public class ExclusionCobertura {
    private Integer ordImpresion;
    private String dscExclusion;
    private String obsExcNegocio;
    private Integer activo;
    private Integer cdExcNegocio;
    private Integer cdCompania;
    private Integer cdCodNegocio;
    private String ubicacion;
    private Integer cdRamoCotizacion;
    private Integer cdSubobjeto;
    private Integer cdObjCotizacion;
    private String nmCobertura;
}
