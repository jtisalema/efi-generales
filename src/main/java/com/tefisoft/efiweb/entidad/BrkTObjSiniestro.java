package com.tefisoft.efiweb.entidad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @author dacopanCM on 25/08/17.
 */
@Entity
@Table(name = "BRK_T_OBJ_SINIESTRO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTObjSiniestro implements Serializable {

    @Column(name = "CD_COMPANIA", nullable = false, precision = 22)
    private Integer cdCompania;
    @Id
    @Column(name = "CD_OBJ_SINIESTRO", nullable = false, precision = 22)
    private Integer cdObjSiniestro;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_RECLAMO", referencedColumnName = "CD_RECLAMO", nullable = false, insertable = false, updatable = false)})
    public BrkTSiniestro siniestro;

    @Column(name = "DSC_OBJETO", length = 200)
    private String dscObjeto;


    @Column(name = "VAL_ASEGURADO", precision = 15)
    private BigDecimal valAsegurado;


    @Column(name = "CD_OBJETO", nullable = false, precision = 22)
    private Integer cdObjeto;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "CD_COMPANIA", referencedColumnName = "CD_COMPANIA", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "CD_OBJETO", referencedColumnName = "CD_OBJ_COTIZACION", nullable = false, insertable = false, updatable = false)})
    BrkTObjCotizacion objCotizacion;

}
