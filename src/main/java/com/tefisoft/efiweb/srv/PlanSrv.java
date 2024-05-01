package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.BrkTPlanDao;
import com.tefisoft.efiweb.entidad.BrkTPlanes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanSrv {
    private final BrkTPlanDao planDao;

    public List<BrkTPlanes> findAll() {
        return planDao.findAll();
    }

    public BrkTPlanes findByUbicacion(Integer cdUbicacion, Integer cdCompania) {
        return planDao.getPlan(cdUbicacion, cdCompania).orElse(null);
    }
}
