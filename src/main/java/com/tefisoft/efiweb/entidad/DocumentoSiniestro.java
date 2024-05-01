package com.tefisoft.efiweb.entidad;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tefisoft.efiweb.dto.DocumentoSiniestroCommon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.List;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_DOC_SINIESTRO_SS")
public class DocumentoSiniestro extends DocumentoSiniestroCommon {

    private static final long serialVersionUID = -4094959453586424180L;

    @Id
    private Integer cdDocSiniestro;
    private Integer cdAseguradora;
    private Integer cdRamo;
    private Integer cdCobertura;
    private String tpSiniestros; // tipo de reclamo
    private Boolean subdocumento;
    @Transient
    @JsonProperty
    private List<SubdocumentoSiniestro> subdocumentosEstructura;
    @Transient
    @JsonProperty
    private Map<Integer, List<DocumentoDigital>> subdocumentosItems;
}
