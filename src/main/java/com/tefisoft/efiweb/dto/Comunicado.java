package com.tefisoft.efiweb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comunicado implements Serializable {
    private static final long serialVersionUID = -1584263897230288533L;
    private Integer cdTabRubro;
    private Integer cdCompania;
    private String dscRubro;
}
