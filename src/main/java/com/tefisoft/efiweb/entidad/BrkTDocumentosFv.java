package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author dacopanCM on 07/08/17.
 */
@Entity
@Table(name = "BRK_T_DOCUMENTOS_FV")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTDocumentosFv implements java.io.Serializable {

    @Id
    @Column(name = "CD_DOCUMENTO_FV", unique = true, nullable = false, precision = 22, scale = 0)
    private Integer cdDocumentoFv;


    @Column(name = "DESCRIPCION", nullable = false, length = 200)
    private String descripcion;
}
