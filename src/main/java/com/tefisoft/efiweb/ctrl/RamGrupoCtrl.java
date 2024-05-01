package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.dto.RamGrupo;
import com.tefisoft.efiweb.srv.RamGrupoSrv;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RamGrupoCtrl {

    private final RamGrupoSrv ramGrupoSrv;

    public RamGrupoCtrl(RamGrupoSrv ramGrupoSrv) {
        this.ramGrupoSrv = ramGrupoSrv;
    }

    @GetMapping(value = "/api/ramgrupos")
    public List<RamGrupo> list() {
        return ramGrupoSrv.list();
    }
}
