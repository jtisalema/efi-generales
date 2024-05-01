package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTIncapacidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrkTIncapacidadDao extends JpaRepository<BrkTIncapacidad, Integer> {

    @Query("select b from BrkTIncapacidad b " +
            "WHERE (b.nmIncapacidad LIKE %:name%) " +
            "AND b.estado <> 'X' OR b.estado is null")
    List<BrkTIncapacidad> searchIncapacidadesByName(@Param("name") String name);

    Optional<BrkTIncapacidad> findByCdIncapacidad(Integer id);
}
