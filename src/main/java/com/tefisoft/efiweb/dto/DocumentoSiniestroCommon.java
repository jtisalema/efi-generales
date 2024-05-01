package com.tefisoft.efiweb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tefisoft.efiweb.entidad.DocumentoDigital;
import com.tefisoft.efiweb.interfaces.IWithOrden;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import java.io.Serializable;

@Data
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
public class DocumentoSiniestroCommon implements Serializable, IWithOrden {

    private static final long serialVersionUID = 5506197862960466936L;

    private Integer cdTpDocSiniestro; // documento del siniestro
    private Integer orden;
    private String observaciones;
    private Boolean activo;
    private Boolean obligatorio;
    // properties fuera de la entidad
    private String nmCobertura;
    private String nmDocumento;
    private String ayuda;
    private Integer cdDetBenefDoc;
    @Transient
    @JsonProperty
    private DocumentoDigital documentoDigital;

}
