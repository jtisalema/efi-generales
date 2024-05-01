update BRK_T_RAMOS_COTIZACION rc
set CD_EJECUTIVO_SINIESTRO = 11
where CD_RAMO_COTIZACION = 2807;
commit;

select *
from BRK_T_USUARIO_PORTAL_WEB
order by CD_ADICIONAL desc;

select *
from BRK_T_USUARIO_PORTAL_WEB
where CEDULA = '1804153375';


select EMAIL, count(*)
from BRK_T_USUARIO_PORTAL_WEB
group by EMAIL
having count(*) > 1;

select distinct fe
from BRK_T_USUARIO_PORTAL_WEB select *
from BRK_T_USUARIO_PORTAL_WEB
where EMAIL = 'andremont2711@gmail.com'

select *
from BRK_T_USUARIO_PORTAL_WEB
where clave_web is null

--pass SegSuare#2023
update BRK_T_USUARIO_PORTAL_WEB
set CLAVE_WEB = '$2a$12$ZE3UBwChP4MsjAyZsHcdkuoogCeVBFcKaGfpbgCfi77SBh55l7Rsm'
where CD_ADICIONAL = 8727;

--order by CD_ADICIONAL desc;

-- $2a$12$ZE3UBwChP4MsjAyZsHcdkuoogCeVBFcKaGfpbgCfi77SBh55l7Rsm

--actualizar email o celular de un asegurado vam
drop trigger BROKER.TR_BF_UPD_INS_DEL_EMAIL_VAM;

update brk_t_asegurados_vam
set CELULAR ='0964214481'
where CEDULA = '1804288569';

commit;


select CEDULA, EMAIL
from BRK_T_ASEGURADOS_VAM
where EMAIL = 'recursoshumanos@cooprio.fin.ec'
select EMAIL, count(*) over ()
from BRK_T_ASEGURADOS_VAM
group by EMAIL
having count(*) > 1
select CEDULA, count(*) over ()
from BRK_T_ASEGURADOS_VAM
group by CEDULA
having count(*) > 1;


---- usuarios -- 1194
select *
from BRK_T_USUARIO_PORTAL_WEB
where CD_ADICIONAL = 3239


select *
from BRK_T_CLI_CONTAC_WEB

--asociados gen
         select *
from BROKER.BRK_T_CLI_CONTAC_WEB
order by FC_CREACION desc;


--old 8726
update BRK_T_CLI_CONTAC_WEB
set CD_ADICIONAL = 1194
where CD_CLI_CONTAC = 4068;
commit;


--asociados vam
SELECT *
FROM BRK_T_CLI_VAM_WEB C
--WHERE CD_ADICIONAL = 1192
order by FC_CREACION desc;

--old 8713
update BRK_T_CLI_VAM_WEB
set CD_ADICIONAL = 1194
where CD_CLI_VAM = 4753;
commit;


--usuarios vam
select u.CD_ADICIONAL, u.EMAIL, u.CEDULA
from BRK_T_USUARIO_PORTAL_WEB u
         inner join BRK_T_CLI_VAM_WEB v
                    on u.CD_ADICIONAL = v.CD_ADICIONAL;


--agregar user a un contratante

select *
from BROKER.BRK_T_USUARIO_PORTAL_WEB
where EMAIL = 'crissant830@hotmail.com';
--cd_adicional=10000

select *
from BROKER.BRK_T_CLIENTES
where lower(NM_CLIENTE) like '%segu%';
--cd_cliente=14
select *
from BRK_T_CLI_CONTAC_WEB
where CD_ADICIONAL = 10000;

commit;