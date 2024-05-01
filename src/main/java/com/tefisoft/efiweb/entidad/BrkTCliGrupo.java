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
@Table(name = "BRK_T_CLI_GRUPO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTCliGrupo implements java.io.Serializable {

    @Id
    @Column(name = "CD_CLI_GRUPO", unique = true, nullable = false, precision = 22)
    private Integer cdCliGrupo;


    @Column(name = "NM_CLI_GRUPO", length = 50)
    private String nmCliGrupo;


    @Column(name = "CATEGORIA", length = 2)
    private String categoria;

}