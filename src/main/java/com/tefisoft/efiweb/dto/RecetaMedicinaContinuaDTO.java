package com.tefisoft.efiweb.dto;

import com.tefisoft.efiweb.interfaces.IToFindDataMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO utilitario para obtener las recetas a notificarse caducidad
 * como un paciente puede tener varios siniestros y c/u varios incapsiniestro
 * se usa @EqualsAndHashCode solo con cdReclamo y cdCompania
 * para solo tener q consultar a la base 1 sola vez los datos de tlfn e email
 * por paciente
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"cdReclamo", "cdCompania"})
public class RecetaMedicinaContinuaDTO implements Serializable, IToFindDataMessage {

    private static final long serialVersionUID = -8440296936938876688L;

    private String nmDocumento;
    private Integer cdAseguradora;
    private LocalDate fcCaducDocumento;
    private Integer cdReclamo;
    private Integer cdCompania;
    private Integer cdIncSiniestro;

}
