package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTRamos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author dacopanCM on 08/08/17.
 */
@Repository
public interface BrkTRamosDAO extends JpaRepository<BrkTRamos, Integer> {
    @Query("select b from BrkTRamos b " +
            "WHERE (?1 IS NULL OR b.nmRamo LIKE ?1%) ")
    Page<BrkTRamos> searchRamos(String nmRamo, Pageable pageable);

    Optional<BrkTRamos> findByCdRamo(Integer cdRamo);

    @Query("select r from BrkTRamos r " +
            "WHERE r.cdRamo = (select rc.ramo.cdRamo from BrkTRamosCotizacion rc where rc.cdRamoCotizacion = ?1 and rc.cdCompania =?2)")
    Optional<BrkTRamos> findByCdRamoCotizacion(Integer cdRamoCotizacion, Integer cdCompania);
}
