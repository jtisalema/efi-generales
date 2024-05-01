package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.IncapSiniestroPortal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncapSiniestroPortalDao extends JpaRepository<IncapSiniestroPortal, IncapSiniestroPortal.IncapSiniestroPortalId> {
}
