package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTEjecutivos;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * @author dacopanCM on 04/07/17.
 */
@Repository
public interface EjecutivoDAO extends IGenericDao<BrkTEjecutivos> {

    @Query("select distinct e from BrkTEjecutivos e left join fetch e.telefonos t where e.cdAseguradora is null AND e.cdEjecutivo=?1")
    BrkTEjecutivos findEjecutivoByCd(Integer cdEjecutivo);
}
