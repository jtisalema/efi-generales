package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTUbicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BrkTUbicacionDAO extends JpaRepository<BrkTUbicacion, BrkTUbicacion.BrkTUbicacionId> {
    @Query("SELECT c from BrkTUbicacion c WHERE c.activo = 1 AND c.cdCompania = ?2 AND c.cdRamoCotizacion =?1 ORDER BY c.item")
    List<BrkTUbicacion> findVAMGrp(Integer cdRamosCotizacion, Integer cdCompania);

    Optional<BrkTUbicacion> findByCdRamoCotizacionAndCdCompania(Integer cdRamoCotizacion, Integer cdCompania);
}
