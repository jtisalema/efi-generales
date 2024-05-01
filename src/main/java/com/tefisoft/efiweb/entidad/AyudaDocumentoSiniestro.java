package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AyudaDocumentoSiniestro implements Serializable {

    private static final long serialVersionUID = 4429724183757069458L;

    private Integer cdAyudaDocSin;
    private Integer cdDocSiniestro;
    private Integer cdSdocSiniestro;
    private String ayuda;
    private String observaciones;
    private boolean activo;
}
