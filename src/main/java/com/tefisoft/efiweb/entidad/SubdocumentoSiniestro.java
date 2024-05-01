package com.tefisoft.efiweb.entidad;

import com.tefisoft.efiweb.dto.DocumentoSiniestroCommon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_SUB_DOC_SINIESTRO_SS")
public class SubdocumentoSiniestro extends DocumentoSiniestroCommon {

    private static final long serialVersionUID = 2851423701480999370L;

    @Id
    private Integer cdSdocSiniestro;
    private Integer cdDocSiniestro;
    private String tipo;
    private Boolean reqFecha;

}
