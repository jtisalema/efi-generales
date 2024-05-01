package com.tefisoft.efiweb.entidad;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author dacopanCM on 07/08/17.
 */
@Entity
@Table(name = "BRK_T_RAMOS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrkTRamos implements java.io.Serializable {

    @Id
    private Integer cdRamo;
    private String nmRamo;
    private String nmAlias;

}