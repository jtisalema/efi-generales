package com.tefisoft.efiweb.entidad;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "BRK_T_DET_BENEF_DOC_SS")
public class DetalleDocumentoSiniestro implements Serializable {

    private static final long serialVersionUID = 8497497625547585695L;

    @Id
    @GeneratedValue(generator = "seq_det_benef_doc_ss")
    @SequenceGenerator(name = "seq_det_benef_doc_ss", sequenceName = "SEQ_DET_BENEF_DOC_SS", allocationSize = 1)
    private Integer cdDetBenefDoc;
    private Integer cdCompania;
    private Integer cdDocSiniestro;
    private Integer cdSdocSiniestro;
    private Integer cdCobertura;
    private Integer cdReclamo;
    private Integer cdRamoCotizacion;
    private Integer cdIncSiniestro;
    private Integer cdCobDedSiniestro;
    private Integer cdGastosVam;
    private String detDocumento;
    private Double valor;
    private String numDocumento;
    private ZonedDateTime fcDocumento;
    private ZonedDateTime fcCaducDocumento;
    private String observaciones;
    private String estado;
    private ZonedDateTime fcEstado;
    private Integer cdArchivo;
    private boolean autocompletado;
    // ajeno a la entidad
    @Transient
    @JsonProperty
    private boolean sriError;

}
