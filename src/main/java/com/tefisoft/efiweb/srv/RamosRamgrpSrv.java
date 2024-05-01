package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.RamosRamgrpDao;
import com.tefisoft.efiweb.dto.RamosRamgrp;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RamosRamgrpSrv {

    private final RamosRamgrpDao ramosRamgrpDao;

    public RamosRamgrpSrv(RamosRamgrpDao ramosRamgrpDao) {
        this.ramosRamgrpDao = ramosRamgrpDao;
    }

    public List<RamosRamgrp> list() {
        return ramosRamgrpDao.findAll();
    }
}
