package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.entidad.BrkTRamos;
import com.tefisoft.efiweb.srv.RamoSrv;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RamoCtrl {
    private final RamoSrv ramoSrv;

    public RamoCtrl(RamoSrv ramoSrv) {
        this.ramoSrv = ramoSrv;
    }

    @GetMapping("/api/ramo")
    public List<BrkTRamos> findAll() {
        return ramoSrv.findAll();
    }

    @GetMapping("/api/ramo/{cdRamo}")
    public BrkTRamos findByCdRamo(@PathVariable Integer cdRamo) {
        return ramoSrv.findOne(cdRamo);
    }

    @PostMapping("/api/ramo/page")
    public Page<BrkTRamos> findPage(@RequestBody ObjectNode item) {
        return ramoSrv.findAllPage(item);
    }
}
