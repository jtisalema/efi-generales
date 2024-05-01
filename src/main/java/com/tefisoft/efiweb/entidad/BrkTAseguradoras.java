package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Table(name = "BRK_T_ASEGURADORAS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrkTAseguradoras implements java.io.Serializable {

    private static final long serialVersionUID = -167009367022158296L;
    @Id
    @Column(nullable = false, precision = 22)
    private Integer cdAseguradora;
    @Column(nullable = false, length = 80)
    private String nmAseguradora;
    @Column(nullable = false, length = 80)
    private String nmAlias;
    private String estado;
    private Long diasVigFact;
}
