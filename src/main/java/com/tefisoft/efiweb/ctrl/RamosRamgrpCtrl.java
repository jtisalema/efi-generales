package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.dto.RamosRamgrp;
import com.tefisoft.efiweb.srv.RamosRamgrpSrv;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RamosRamgrpCtrl {

    private final RamosRamgrpSrv ramosRamgrpSrv;

    public RamosRamgrpCtrl(RamosRamgrpSrv ramosRamgrpSrv) {
        this.ramosRamgrpSrv = ramosRamgrpSrv;
    }

    @GetMapping(value = "/api/ramosramgrp")
    public List<RamosRamgrp> list() {
        return ramosRamgrpSrv.list();
    }

}
