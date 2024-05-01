package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.srv.EjecutivoAdmService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class EjecutivosCtrl {

    private final EjecutivoAdmService ejecutivosAdmSrv;

    public EjecutivosCtrl(EjecutivoAdmService ejecutivosAdmSrv) {
        this.ejecutivosAdmSrv = ejecutivosAdmSrv;
    }

    @GetMapping(value = "/api/ejecutivoAdm", params = {"cdEjecutivo", "cdCompania"})
    public Map<String, Object> getOne(@RequestParam Integer cdEjecutivo, @RequestParam Integer cdCompania) {
        return ejecutivosAdmSrv.findDatos(cdEjecutivo, cdCompania);
    }

    @PostMapping("/api/ejecutivo-search")
    public ObjectNode searchEjecutivo(@RequestBody ObjectNode item) {
        return ejecutivosAdmSrv.searchEjecutivo(item);
    }

    @PostMapping("/api/ejecutivosSubagente-crear")
    public String crearEjecutivoSubagente(@RequestBody List<ObjectNode> items) {
        return ejecutivosAdmSrv.crearEjecutivoSubAgenteWeb(items, false);
    }

    @PostMapping("/api/ejecutivoDesactivar")
    public String desactivarEjecutivo(@RequestBody List<ObjectNode> items) {
        return ejecutivosAdmSrv.desactivarEjecutivoSubAgenteWeb(items, false);
    }

}
