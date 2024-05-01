CREATE OR REPLACE PACKAGE PCK_COPIA_SINIES_PORTAL AS

/**************************************************************************************************
OBJETIVO :   Obtener los valores del Siniestro del portal y realizar una copia al Siniestro completo
FECHA :      08/05/2023
AUTOR :      Washington Rosero

CONTROL DE CAMBIOS :

====================================================================================================================
Autor                        Fecha              Descripción               Líneas
====================================================================================================================
Washington Rosero         08/05/2023            Creación                  21-80

*************************************************************************************************************/

/*****************************************************************************************************
Procedimiento para copiar el Siniestro, Reclamo desde el portal BRK_T_SINIESTRO
******************************************************************************************************/
    
PROCEDURE SP_COPIA_RECLAMO (al_cd_compania_orig IN NUMBER,                /*cd_compania_org viene desde las tablas del portal*/
                            al_cd_reclamo_orig IN NUMBER,                 /*al_cd_reclamo_orig viene desde las tablas del portal*/
                            al_cd_obj_siniestro_orig IN NUMBER,           /*al_cd_obj_siniestro_orig viene desde las tablas del portal*/
                            al_cd_inc_siniestro_orig IN NUMBER,           /*al_cd_inc_siniestro_orig viene desde las tablas del portal*/
                            al_cd_gastos_vam_orig IN NUMBER,              /*al_cd_gastos_vam_orig viene desde las tablas del portal*/  
                            al_cd_ramo_cotizacion IN NUMBER,              /*al_cd_ramo_cotizacion viene desde las tablas del portal*/
                            al_cd_reclamo OUT NUMBER,                     /*al_cd_reclamo el código que se generará del producto de la copia*/
                            as_resp OUT VARCHAR2);                        /*Respuesta incluye la palabra OK, todo correcto. ERROR cuando esxiste error más la descripción del error*/ 
                                                                  
/*****************************************************************************************************
Procedimiento para copiar el objeto Asegurado desde el portal BRK_T_OBJ_SINIESTRO
******************************************************************************************************/
    
PROCEDURE SP_COPIA_OBJ_ASEGURADO (al_cd_compania_orig IN NUMBER,  
                                  al_cd_reclamo_orig IN NUMBER, 
                                  al_cd_obj_siniestro_orig IN NUMBER,       
                                  al_cd_reclamo IN NUMBER,                /*al_cd_reclamo viene desde las tabla final luego de generada la copia*/
                                  al_cd_obj_siniestro OUT NUMBER,         /*al_cd_obj_siniestro el código que se generará del producto de la copia*/                                      
                                  as_resp OUT VARCHAR2);                  /*Respuesta incluye la palabra OK, todo correcto. ERROR cuando esxiste error más la descripción del error*/
                                    
/*************************************************************************************************************
Procedimiento para copiar la incapacidad del siniestro desde el portal. Siniestros VAM. BRK_T_INCAP_SINIESTRO
**************************************************************************************************************/
    
PROCEDURE SP_COPIA_INCAP_SINIESTRO (al_cd_compania_orig IN NUMBER,
                                    al_cd_obj_siniestro_orig IN NUMBER,
                                    al_cd_inc_siniestro_orig IN NUMBER,
                                    al_cd_obj_siniestro IN NUMBER,        /*al_cd_obj_siniestro viene desde las tabla final luego de generada la copia*/
                                    al_cd_inc_siniestro OUT NUMBER,       /*al_cd_inc_siniestro el código que se generará del producto de la copia*/                                      
                                    as_resp OUT VARCHAR2);                /*Respuesta incluye la palabra OK, todo correcto. ERROR cuando esxiste error más la descripción del error*/
                                     
/*****************************************************************************************************************
Procedimiento para copiar los gastos o facturación del siniestro desde el portal. Siniestros VAM. BRK_T_GASTOS_VAM
******************************************************************************************************************/
    
PROCEDURE SP_COPIA_GASTOS_VAM (al_cd_compania IN NUMBER,
                               al_cd_inc_siniestro_orig IN NUMBER,
                               al_cd_gastos_vam_orig IN NUMBER,
                               al_cd_inc_siniestro IN NUMBER,             /*al_cd_inc_siniestro viene desde las tabla final luego de generada la copia*/                               
                               al_cd_gastos_vam OUT NUMBER,               /*al_cd_gastos_vam el código que se generará del producto de la copia*/
                               as_resp OUT VARCHAR2);                     /*Respuesta incluye la palabra OK, todo correcto. ERROR cuando esxiste error más la descripción del error*/                                                                                                                                                                                    

END PCK_COPIA_SINIES_PORTAL;
