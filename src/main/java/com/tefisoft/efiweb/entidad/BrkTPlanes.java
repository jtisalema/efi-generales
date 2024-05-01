package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * @author dacopanCM on 29/08/17.
 */
@Entity
@Table(name = "BRK_T_PLANES")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTPlanes implements Serializable {

    @Id
    @Column(name = "CD_PLAN", unique = true, nullable = false, precision = 22)
    private Integer cdPlan;

    @Column(name = "CD_COMPANIA", unique = true, nullable = false, precision = 22)
    private Integer cdCompania;

    @Column(name = "DSC_PLAN")
    private String dscPlan;

    @Column(name = "ESTADO", length = 1)
    private String estado;

    @Column(name = "CD_RAMO", precision = 22, scale = 0)
    private Integer cdRamo;

    @Column(name = "TIPO_MP", length = 1)
    private Character tipoMp;
}
