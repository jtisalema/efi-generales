package com.tefisoft.efiweb.dao;


import com.tefisoft.efiweb.entidad.BrkTCiudades;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <> by enlil on 15/03/17.
 */
@Repository
public interface BrkTCiudadesDAO extends IGenericDao<BrkTCiudades> {

    @Query("from BrkTCiudades c where c.cdProvincia=?1")
    List<BrkTCiudades> findByProvinciaId(Integer cdProvincia);

    @Query("select distinct c from BrkTCiudades c where c.cdProvincia IN (select distinct p.cdProvincia from BrkTCiudades p)")
    List<BrkTCiudades> findAllProvincias();

}
