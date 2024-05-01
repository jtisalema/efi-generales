package com.tefisoft.efiweb.dto;

import com.tefisoft.efiweb.interfaces.IToFindDataMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"cdReclamo", "cdCompania"})
public class IncapSiniestroPortalDTO implements Serializable, IToFindDataMessage {

    private static final long serialVersionUID = 1601038612506875824L;

    private Integer cdIncSiniestro;
    private Integer cdReclamo;
    private Integer cdCompania;
    private LocalDate fcPrimeraFactura;
    private boolean caducado;
    private Long daysFromFcPrimeraFactura;

}
