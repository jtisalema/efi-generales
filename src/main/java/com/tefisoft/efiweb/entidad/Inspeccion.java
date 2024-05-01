package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

/**
 * @author dacopanCM on 25/08/17.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inspeccion implements Serializable {
    private Integer cdInspeccion;
    private Date fcInspeccion;
    private String inspector;
    private String lugar;
    private String observaciones;
    private String estado;
}
