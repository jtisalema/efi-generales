package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.ObjSiniestroPortal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObjSiniestroPortalDao extends JpaRepository<ObjSiniestroPortal, ObjSiniestroPortal.SiniestroObjPortalId> {
}
