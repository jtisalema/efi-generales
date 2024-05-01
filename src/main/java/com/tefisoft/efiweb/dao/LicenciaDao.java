package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.LicenciaWeb;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author dacopanCM on 24/03/18.
 */
@Repository
public interface LicenciaDao extends JpaRepository<LicenciaWeb, Integer> {
}
