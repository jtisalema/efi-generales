package com.tefisoft.efiweb.entidad;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author dacopanCM on 07/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTNotificaciones implements java.io.Serializable {

    private byte cdNotific;
    private String dscNotific;
    private Integer orden;
    private String abrev;
    private Boolean activa;
    private Integer cdCompania;
    private Integer cdEjecutivo;
}

