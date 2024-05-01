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
 * @author dacopanCM on 25/08/17.
 */
@Entity
@Table(name = "BRK_T_EST_SINIESTRO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTEstSiniestro implements Serializable {

    @Column(name = "CD_EST_SINIESTRO", unique = true, nullable = false, precision = 5)
    @Id
    private int cdEstSiniestro;

    @Column(name = "DSC_ESTADO", length = 60)
    private String dscEstado;
    @Column(name = "TIPO", length = 20)
    private String tipo;
}
