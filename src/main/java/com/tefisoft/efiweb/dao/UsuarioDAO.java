package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author dacopanCM on 10/03/17.
 */
@Repository
public interface UsuarioDAO extends JpaRepository<Usuario, Integer> {

    Page<Usuario> findByTipoUsuario(String tipo, Pageable pageable);

    Usuario findByUsuario(String usuario);

    @Query(value = "select distinct item_menu from BRK_T_PERMISOS_MENU_WEB where activo =1 and TP_PERS_ADM = :tp", nativeQuery = true)
    List<String> getRoles(@Param("tp") String tpPersona);

    // SP creacion y desactivacion Usuarios web
    @Procedure(procedureName = "SP_CREA_MULTI_USUARIO_WEB", outputParameterName = "as_error")
    String spCreaUsuarioWeb(@Param("al_cd_compania") Integer cdCompania, @Param("al_cd_cliente") Integer cdCliente, @Param("as_correo") String correo, @Param("al_cd_ejecutivo") Integer cdEjecutivo, @Param("as_usuario") String usuario, @Param("as_cedula") String cedula);

    @Procedure(procedureName = "SP_INACTIVA_MULTI_USUARIO_WEB", outputParameterName = "as_error")
    String spInacUsuarioWeb(@Param("al_cd_compania") Integer cdCompania, @Param("al_cd_cliente") Integer cdCliente, @Param("as_correo") String correo, @Param("al_cd_ejecutivo") Integer cdEjecutivo, @Param("as_cedula") String cedula);

    List<Usuario> findAllByCedula(String cedula);

    List<Usuario> findAllByCedulaIn(List<String> cedulas);
}
