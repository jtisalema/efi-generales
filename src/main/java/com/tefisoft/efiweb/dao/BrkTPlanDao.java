package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTPlanes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BrkTPlanDao extends JpaRepository<BrkTPlanes, Integer> {

    @Query("select p from BrkTPlanes p " +
            "where p.cdPlan = (select b.plan.cdPlan from BrkTUbicacion b where (b.cdUbicacion=?1) AND (b.cdCompania=?2))")
    Optional<BrkTPlanes> getPlan(Integer cdUbicacion, Integer cdCompania);
}
