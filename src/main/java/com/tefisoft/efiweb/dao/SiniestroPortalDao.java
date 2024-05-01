package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTSiniestroPortal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SiniestroPortalDao extends JpaRepository<BrkTSiniestroPortal, BrkTSiniestroPortal.SiniestroPortalId> {
    Optional<BrkTSiniestroPortal> findByCdCompaniaAndCdReclamo(Integer cdComp, Integer cdReclamo);
}
