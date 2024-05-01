package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTAseguradosVam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrkTAseguradosVamDao extends JpaRepository<BrkTAseguradosVam, String> {


    @Query("select b from BrkTAseguradosVam b " +
            "WHERE (b.apCliente LIKE %:#{[0]}%) " +
            "OR (b.nmCliente LIKE %:#{[0]}%) " +
            "OR (b.cedula LIKE :ced%)")
    List<BrkTAseguradosVam> searchAseguradoCedula(@Param("ced") String ced);
}
