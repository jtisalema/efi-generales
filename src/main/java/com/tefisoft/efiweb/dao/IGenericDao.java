package com.tefisoft.efiweb.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

/**
 * clase generica de DAO para CRUD simple, usada para las tablas de mantenimiento,
 * como bancos, forma pago, etc donde no se requiere mayor control sino simple CRUD
 *
 * @author dacopanCM on 15/03/17.
 */
@NoRepositoryBean
@Transactional(readOnly = true)
public interface IGenericDao<T extends Serializable> extends JpaRepository<T, Integer> {


}
