package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTAseguradoras;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * @author dacopanCM on 08/08/17.
 */
public interface BrkTAseguradorasDAO extends IGenericDao<BrkTAseguradoras> {
    @Query("select c from BrkTAseguradoras c " +
            "where c.cdAseguradora = (select b.aseguradora.cdAseguradora from BrkTCotizaciones b where b.cdCotizacion = ?1 and (b.cdCompania= ?2))")
    Optional<BrkTAseguradoras> getAseguradora(Integer cdCotizacion, Integer cdCompania);

    List<BrkTAseguradoras> findAllByNmAseguradoraStartingWithIgnoreCase(String name);

    List<BrkTAseguradoras> findAllByDiasVigFactGreaterThanEqual(long daysToNotify);
}
