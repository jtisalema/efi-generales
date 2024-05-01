package com.tefisoft.efiweb.entidad;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BRK_T_DOC_DIGITAL")
public class DocDigital implements Serializable {
    @Id
    private Integer cdDocDigital;
    private Integer cdRamo;
    private Integer aplicaSubcarpeta;
    private String nomenclatura;
    private String observaciones;
    private Integer activo;
}
