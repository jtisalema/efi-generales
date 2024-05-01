package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.entidad.BrkTObjCotizacion;
import com.tefisoft.efiweb.entidad.Subobjetos;
import com.tefisoft.efiweb.srv.PolizaContenidoService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class PolizaContenidoCtrl {

    private final PolizaContenidoService polizaContenidoService;

    @PostMapping("/api/polizas/subObjeto")
    public Page<BrkTObjCotizacion> findAll(@RequestBody ObjectNode item) {
        return polizaContenidoService.getPolizas(item);
    }

    @GetMapping("/api/polizas/subobjetos")
    public List<Subobjetos> getSubobjetosByObtCot(@RequestParam Integer cdCompania, @RequestParam Integer cdObjetoCotizacion) {
        return polizaContenidoService.getSubobjetosByObtCot(cdCompania, cdObjetoCotizacion);
    }

}
