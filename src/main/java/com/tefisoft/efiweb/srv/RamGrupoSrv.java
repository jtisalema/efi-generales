package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.RamGrupoDao;
import com.tefisoft.efiweb.dto.RamGrupo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RamGrupoSrv {

    private final RamGrupoDao ramGrupoDao;

    public RamGrupoSrv(RamGrupoDao ramGrupoDao) {
        this.ramGrupoDao = ramGrupoDao;
    }

    public List<RamGrupo> list() {
        return ramGrupoDao.findAll();
    }
}
