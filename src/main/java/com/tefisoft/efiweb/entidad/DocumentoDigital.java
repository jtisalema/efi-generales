package com.tefisoft.efiweb.entidad;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.tefisoft.efiweb.interfaces.IWithOrden;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_DOCUMENTO_DIGITAL")
public class DocumentoDigital implements Serializable, IWithOrden {

    private static final long serialVersionUID = -4974319076714295811L;

    @Id
    @GeneratedValue(generator = "seq_documento_digital")
    @SequenceGenerator(name = "seq_documento_digital", sequenceName = "SEQ_DOCUMENTO_DIGITAL", allocationSize = 1)
    private Integer cdArchivo;
    private Integer cdCliente;
    private Integer cdCompania;
    private Integer cdRamo;
    private Integer cdReclamo; // BRK_T_SINIESTRO_SS
    private Integer cdIncSiniestro;
    private String poliza;
    private String tipo;
    private String uuid;
    private String nombre;
    private String mime;
    private long tamanio;
    //aqui se debe guardar un string que es un json que tenga fc; fecha del archivo, usuario que lo sube preguntar darwin o alex
    private String metadato;
    private Boolean activo;
    private Integer cdDocSiniestro;
    private Integer cdSdocSiniestro;
    private Integer numGrupo; // grupo en subdocumentosItems
    private Integer orden;  // orden en subdocumentosItems
    private String pathFile;
    private String estado;
    private String idUsuarioEjecutivo; // usuario que edita el estado del documento
    private String observaciones;
    // properties ajenas al entity :(
    @Transient
    @JsonProperty
    @Builder.Default
    private DetalleDocumentoSiniestro detalleDocumento = new DetalleDocumentoSiniestro();
    @Transient
    @JsonProperty
    private String url;
    @Transient
    @JsonProperty
    private Integer cdCobertura;

}
