package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.entidad.Compania;
import com.tefisoft.efiweb.srv.CompaniaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CompaniaCtrl {

    private CompaniaService companiaSrv;

    public CompaniaCtrl(CompaniaService companiaSrv) {
        this.companiaSrv = companiaSrv;
    }

    @GetMapping("/api/compania")
    public List<Compania> findAll() {
        return companiaSrv.getAllCompanias();

    }

}
