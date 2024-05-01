package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.BrkTUbicacionDAO;
import com.tefisoft.efiweb.entidad.BrkTUbicacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UbicacionSrv {

    private final BrkTUbicacionDAO ubicacionDao;

    public List<BrkTUbicacion> findByCompAndRamoCoti(Integer cdCompania, Integer cdRamoCotizacion) {
        return ubicacionDao.findVAMGrp(cdRamoCotizacion, cdCompania);
    }

    public BrkTUbicacion findByRamoCoti(Integer cdRamoCotizacion, Integer cdCompania) {
        return ubicacionDao.findByCdRamoCotizacionAndCdCompania(cdRamoCotizacion, cdCompania).orElse(null);
    }

}
