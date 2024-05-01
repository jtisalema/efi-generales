package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.EjecutivosAdm;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EjecutivoAdmDao extends IGenericDao<EjecutivosAdm> {

    EjecutivosAdm findByCdEjecutivoAndCdCompania(Integer cdEje, Integer cdComp);

    @Query(nativeQuery = true, value = "SELECT F_BUSCA_CORREO_EJECLI(:cdEjecutivo) FROM dual")
    String F_BUSCA_CORREO_EJECLI(@Param("cdEjecutivo") Integer cdEjecutivo);


    @Query(nativeQuery = true, value = "SELECT F_BUSCA_TELEF_EJECLI(:cdEjecutivo) FROM dual")
    String F_BUSCA_TELEF_EJECLI(@Param("cdEjecutivo") Integer cdEjecutivo);

    @Procedure(procedureName = "SP_INAC_EJE_AGENTE_PORTAL_WEB", outputParameterName = "as_resp")
    String spDesactivar(@Param("al_cd_compania") Integer cdCompania, @Param("al_cd_sucursal") Integer cdSucursal, @Param("al_cd_codigo") Integer cdEjecutivo, @Param("as_tipo_codigo") String codigo, @Param("as_correo") String correo);

    @Query(nativeQuery = true, value = "select DESCRIPCION FROM BRK_T_TP_PERS_ADMINISTRATIVO where CD_CODIGO = :cod")
    String findTpPersAdm(@Param("cod") String tpPersAdm);

    @Procedure(procedureName = "SP_CREA_EJE_AGENTE_PORTAL_WEB", outputParameterName = "as_resp")
    String spCrearEjeWeb(@Param("al_cd_compania") Integer cdCompania, @Param("al_cd_sucursal") Integer cdSucursal, @Param("al_cd_codigo") Integer cdEjecutivo, @Param("as_tipo_codigo") String codigo, @Param("as_tipo") String tipo, @Param("as_correo") String correo);

}
