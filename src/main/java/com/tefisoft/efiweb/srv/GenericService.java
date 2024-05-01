package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.dao.IGenericDao;
import com.tefisoft.efiweb.exc.CustomException;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

/**
 * Clase abstracta con CRUD simple como servicio cuando no se requiere mayor validaciones;
 * por ejemplo para las tablas de mantenimiento
 *
 * @author dacopanCM on 15/03/17.
 */
@Transactional(readOnly = true)
public abstract class GenericService<T extends Serializable, D extends IGenericDao<T>> implements Serializable {

    protected D dao;

    GenericService(D dao) {
        this.dao = dao;
    }

    @Transactional
    public void save(T item) throws CustomException {
        try {
            dao.save(item);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), ex.getCause());
        }
    }

    public List<T> getAll() {
        return dao.findAll();
    }

    //public void delete(Long id) {
    //    dao.delete(id);
    //}

    public T findById(Integer id) {
        return dao.findById(id).orElse(null);
    }

}
