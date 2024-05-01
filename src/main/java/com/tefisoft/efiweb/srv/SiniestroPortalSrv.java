package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.BrkTIncapacidadDao;
import com.tefisoft.efiweb.dao.BrkTRamosDAO;
import com.tefisoft.efiweb.dao.IncapSiniestroPortalDao;
import com.tefisoft.efiweb.dao.ObjSiniestroPortalDao;
import com.tefisoft.efiweb.dao.SegSiniestroPortalDao;
import com.tefisoft.efiweb.dao.SiniestroPortalDao;
import com.tefisoft.efiweb.dao.TelefonosRepositoryJDBC;
import com.tefisoft.efiweb.entidad.BrkTIncapacidad;
import com.tefisoft.efiweb.entidad.BrkTRamos;
import com.tefisoft.efiweb.entidad.BrkTSegSiniestroPortal;
import com.tefisoft.efiweb.entidad.BrkTSiniestroPortal;
import com.tefisoft.efiweb.entidad.IncapSiniestroPortal;
import com.tefisoft.efiweb.entidad.ObjSiniestroPortal;
import com.tefisoft.efiweb.enums.EstadoSiniestroEnum;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.util.Ctns;
import com.tefisoft.efiweb.util.VariablesSiniestro;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

import static com.tefisoft.efiweb.util.VariablesSiniestro.ESTADO;
import static com.tefisoft.efiweb.util.VariablesSiniestro.INCAPACIDAD;
import static com.tefisoft.efiweb.util.VariablesSiniestro.NUM_SINIESTRO;
import static com.tefisoft.efiweb.util.VariablesSiniestro.PACIENTE;
import static com.tefisoft.efiweb.util.VariablesSiniestro.RAMO;

@Service
@RequiredArgsConstructor
@CommonsLog
public class SiniestroPortalSrv {
    private final SiniestroPortalDao siniestroPortalDao;
    private final ObjSiniestroPortalDao objSiniestroPortalDao;
    private final IncapSiniestroPortalDao incapSiniestroPortalDao;
    private final SegSiniestroPortalDao segSiniestroPortalDao;
    private final PolizaContenidoService polizaContenidoService;

    private final ObjectMapper mapper;
    private final BrkTRamosDAO ramoDao;
    private final BrkTIncapacidadDao incapacidadDao;
    private final TelefonosRepositoryJDBC telefonosRepositoryJDBC;

    public ObjectNode findOne(Integer cdComp, Integer cdReclamo, Integer cdIncSiniestro) {
        var siniestro = siniestroPortalDao.findByCdCompaniaAndCdReclamo(cdComp, cdReclamo).orElseThrow();
        var incapSiniestro = incapSiniestroPortalDao.findById(IncapSiniestroPortal.IncapSiniestroPortalId.builder().cdCompania(cdComp).cdIncSiniestro(cdIncSiniestro).build()).orElseThrow();
        var objSiniestro = objSiniestroPortalDao.findById(ObjSiniestroPortal.SiniestroObjPortalId.builder().cdCompania(cdComp).cdObjSiniestro(incapSiniestro.getCdObjSiniestro()).build()).orElseThrow();
        var segSiniestro = segSiniestroPortalDao.findByCdReclamoAndCdIncSiniestro(cdReclamo, incapSiniestro.getCdIncSiniestro());
        if (segSiniestro.isEmpty()) {
            throw new CustomException("Siniestro incompleto ");
        }
        return getDataSiniestros(siniestro, objSiniestro, incapSiniestro, segSiniestro.get(0));
    }

    private ObjectNode getDataSiniestros(BrkTSiniestroPortal siniestro, ObjSiniestroPortal objSiniestro, IncapSiniestroPortal incapSiniestro, BrkTSegSiniestroPortal segSiniestro) {
        ObjectNode finalObj = mapper.createObjectNode();
        finalObj.setAll((ObjectNode) mapper.valueToTree(siniestro));
        finalObj.setAll((ObjectNode) mapper.valueToTree(objSiniestro));
        finalObj.setAll((ObjectNode) mapper.valueToTree(incapSiniestro));
        finalObj.setAll((ObjectNode) mapper.valueToTree(segSiniestro));
        return finalObj;
    }

    public Map<String, String> findDataByMensaje(Integer cdComp, Integer cdReclamo, Integer cdIncSiniestro) {
        var mapMensaje = new HashMap<String, String>();
        var commentObservation = "";
        var dataPaciente = findOne(cdComp, cdReclamo, cdIncSiniestro);
        var ramo = ramoDao.findById(dataPaciente.path("cdRamo").asInt()).orElse(new BrkTRamos());
        var incapacidad = incapacidadDao.findById(dataPaciente.path("cdIncapacidad").asInt()).orElse(new BrkTIncapacidad());
        var datos = polizaContenidoService.getCelularAndMail(cdReclamo, cdComp);
        var numSiniestro = dataPaciente.path(NUM_SINIESTRO).asText()
                + "."
                + dataPaciente.path("item").asText()
                + "/"
                + dataPaciente.path("anoSiniestro").asInt();
        var replyTo = telefonosRepositoryJDBC.getMailEjecutivoSiniestro(cdComp, dataPaciente.get("cdRamoCotizacion").asInt());
        var ejecutivoName = telefonosRepositoryJDBC.getNameEjecutivoSiniestro(cdComp, dataPaciente.get("cdRamoCotizacion").asInt());

        if (ObjectUtils.isEmpty(replyTo)) {
            replyTo = "";
        }

        try {
            var observationStatus = mapper.readTree(dataPaciente.path("observacionesEstados").asText());
            for (JsonNode comment : observationStatus) {
                if (EstadoSiniestroEnum.POR_REGULARIZAR.name().equals(dataPaciente.path("estadoPortal").asText())) {
                    commentObservation = comment.path("comentario").asText();
                }
            }
        } catch (Exception ex) {
            log.error("Error al obtener el comentario.", ex);
        }

        mapMensaje.put(NUM_SINIESTRO, numSiniestro);
        mapMensaje.put(RAMO, ramo.getNmRamo() + "/" + dataPaciente.path("poliza").asText());
        mapMensaje.put(INCAPACIDAD, incapacidad.getNmIncapacidad());
        mapMensaje.put(PACIENTE, dataPaciente.path("dscObjeto").asText());
        mapMensaje.put(ESTADO, dataPaciente.path("estadoPortal").asText());//nuevo estad
        mapMensaje.put(Ctns.PHONE, !ObjectUtils.isEmpty(datos.get("celular")) ? datos.get("celular").toString() : "");
        mapMensaje.put("mail", !ObjectUtils.isEmpty(datos.get("correo")) ? datos.get("correo").toString() : "");
        mapMensaje.put("commentObservation", StringUtils.hasText(commentObservation) ? commentObservation : "");
        mapMensaje.put("ejecutivo", ejecutivoName);
        mapMensaje.put("ejecutivoEmail", replyTo);
        var emReferencia = String.format("%s%s%s", cdIncSiniestro, cdReclamo, incapacidad.getCdIncapacidad());
        mapMensaje.put(VariablesSiniestro.SMS_EM_REFERENCIA, emReferencia);
        return mapMensaje;
    }

}
