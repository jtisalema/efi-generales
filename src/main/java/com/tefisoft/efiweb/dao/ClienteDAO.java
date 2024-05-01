package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.BrkTClientes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * @author dacopanCM on 23/06/17.
 */
@Repository
public interface ClienteDAO extends IGenericDao<BrkTClientes> {

    BrkTClientes findByCdCliente(Integer id);

    @Query("select b from BrkTClientes b " +
            "WHERE (b.apCliente LIKE %:#{[0]}%) " +
            "OR (b.nmCliente LIKE %:#{[0]}%) " +
            "OR (b.rucCed LIKE :xx%)")
    Page<BrkTClientes> searchClientes(@Param("xx") String xx, Pageable pageable);
}
