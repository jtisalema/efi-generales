package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.dao.IGenericDao;
import com.tefisoft.efiweb.srv.GenericService;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;

/**
 * clase generica de Bean para CRUD simple, usada para las tablas de mantenimiento,
 * como bancos, forma pago, etc usada simplemente para estandarizar y simplificar, debe implementarse sus metodos
 *
 * @author dacopanCM on 15/03/17.
 */
@Getter
@Setter
public abstract class GenericAdminBean<T extends Serializable, D extends IGenericDao<T>, S extends GenericService<T, D>> {
    protected T item;
    protected List<T> list;
    protected S service;


    GenericAdminBean(S service) {
        this.service = service;
    }


    protected void loadList(boolean forceLoad) {

        if (list == null || forceLoad) {
            list = service.getAll();
        }
    }

    /**
     * LLama a {@link GenericAdminBean#save()}, para guardar en la base y mostrar un mensaje,
     * usar este metodo desde los Controller de amntenimiento puesto que al guardar
     * no necesitan, retornar a una pagina sino quedarse en la misma <br/><br/>
     * POR EJEMPLO EN {@link GenericAdminBean#toggleEstado()}
     */
    @SuppressWarnings("unused")
    public void doSave() {
        save();
        loadList(true);
    }

    //overribles

    /**
     * Gurda en la BD el item, y muestra un mensaje de exito o error segun sea el caso
     *
     * @return {@code true} si se guardó con éxito, false caso contrario
     */
    private boolean save() {
        try {
            if (isAdding()) {
                service.save(item);
            } else {
                service.save(item);
            }
            // showInfo(Ctns.SAVE, Ctns.SAVE_SUCCESS);
            return true;
        } catch (Exception ex) {
            //showError(Ctns.ERROR, ex.getMessage());
        }
        return false;
    }

    @SuppressWarnings("unused")
    public void cancel() {
        if (!isAdding()) {
            item = service.findById(getItemId());
        }
        //showInfo(isAdding() ? Ctns.NEW : Ctns.EDIT, Ctns.CANCEL);
    }

    HashMap<String, String> getParams() {
        return new HashMap<>();
    }

    //abstract
    public abstract boolean isAdding();

    public abstract Integer getItemId();

    @SuppressWarnings("unused")
    public abstract void toggleEstado();
}
