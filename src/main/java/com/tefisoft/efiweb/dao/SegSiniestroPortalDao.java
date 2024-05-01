package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTSegSiniestroPortal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SegSiniestroPortalDao extends JpaRepository<BrkTSegSiniestroPortal, BrkTSegSiniestroPortal.SiniestroSegPortalId> {
    List<BrkTSegSiniestroPortal> findByCdReclamoAndCdIncSiniestro(Integer cdReclamo, Integer cdIncSiniestro);
}
