package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.enums.EstadoSiniestroEnum;
import com.tefisoft.efiweb.enums.TipoNotificacionEnum;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.interfaces.AditionalMessageProperties;
import com.tefisoft.efiweb.interfaces.IToFindDataMessage;
import com.tefisoft.efiweb.util.Ctns;
import com.tefisoft.efiweb.util.Utilities;
import com.tefisoft.efiweb.util.VariablesWhatsapp;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.tefisoft.efiweb.srv.EmailService.CAMBIO_ESTADO_SUBJECT;
import static com.tefisoft.efiweb.srv.EmailService.CAMBIO_ESTADO_TEMPLATE;
import static com.tefisoft.efiweb.srv.EmailService.CREACION_ESTADO_SUBJECT;
import static com.tefisoft.efiweb.srv.EmailService.CREACION_TEMPLATE;
import static com.tefisoft.efiweb.srv.EmailService.LIQUIDADO_TEMPPLATE;
import static com.tefisoft.efiweb.srv.EmailService.RECETA_CADUCAR_SUBJECT;
import static com.tefisoft.efiweb.srv.EmailService.RECETA_CADUCAR_TEMPLATE;
import static com.tefisoft.efiweb.srv.EmailService.SINIESTRO_CADUCIDAD_SUBJECT;
import static com.tefisoft.efiweb.srv.EmailService.SINIESTRO_CADUCIDAD_TEMPLATE;
import static com.tefisoft.efiweb.util.VariablesSiniestro.DAYS_TO_EXPIRE;
import static com.tefisoft.efiweb.util.VariablesSiniestro.ESTADO;
import static com.tefisoft.efiweb.util.VariablesSiniestro.FECHA_EMISION;
import static com.tefisoft.efiweb.util.VariablesSiniestro.INCAPACIDAD;
import static com.tefisoft.efiweb.util.VariablesSiniestro.NOMBRE_DOCUMENTO;
import static com.tefisoft.efiweb.util.VariablesSiniestro.NUM_SINIESTRO;
import static com.tefisoft.efiweb.util.VariablesSiniestro.PACIENTE;
import static com.tefisoft.efiweb.util.VariablesSiniestro.RAMO;

@Service
@RequiredArgsConstructor
@CommonsLog
public class SendWhatsappSrv {
    private final AdministracionHomeSrv administracionHomeSrv;
    private final SiniestroPortalSrv siniestroPortalSrv;
    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;
    private final EmailService emailService;

    private static final String KEY_DATA_MSG = "%s-%s";
    Map<TipoNotificacionEnum, Pair<String, String>> notificacionesMap = new EnumMap<>(TipoNotificacionEnum.class);

    @PostConstruct
    public void init() {
        notificacionesMap.put(TipoNotificacionEnum.SINIESTRO_CREADO,
                Pair.of(CREACION_ESTADO_SUBJECT, CREACION_TEMPLATE));
        notificacionesMap.put(TipoNotificacionEnum.CAMBIO_ESTADO,
                Pair.of(CAMBIO_ESTADO_SUBJECT, CAMBIO_ESTADO_TEMPLATE));
        notificacionesMap.put(TipoNotificacionEnum.SINIESTRO_CADUCIDAD,
                Pair.of(SINIESTRO_CADUCIDAD_SUBJECT, SINIESTRO_CADUCIDAD_TEMPLATE));
        notificacionesMap.put(TipoNotificacionEnum.RECETA_CADUCAR,
                Pair.of(RECETA_CADUCAR_SUBJECT, RECETA_CADUCAR_TEMPLATE));
        notificacionesMap.put(TipoNotificacionEnum.SINIESTRO_LIQUIDADO,
                Pair.of(CAMBIO_ESTADO_SUBJECT, LIQUIDADO_TEMPPLATE));
    }

    public ObjectNode findConfig() {
        return administracionHomeSrv.find();
    }

    public void handleMessage(Integer cdCompania, Integer cdReclamo, Integer cdIncSiniestro, String tipoNotificacion) {
        try {
            var dataMensaje = siniestroPortalSrv.findDataByMensaje(cdCompania, cdReclamo, cdIncSiniestro);
            findTemplateAndSendMessages(dataMensaje, TipoNotificacionEnum.valueOf(tipoNotificacion.toUpperCase()));
        } catch (Exception ex) {
            log.error("error in handleMessage, cdCompania: " + cdCompania + " cdReclamo: " + cdReclamo
                    + " cdIncSiniestro:  "
                    + cdIncSiniestro + " tipoNotificacion " + tipoNotificacion + ex);
        }
    }

    public void findTemplateAndSendMessages(Map<String, String> dataMensaje, TipoNotificacionEnum tipoNotificacion) {
        ObjectNode cfg = findConfig();
        ArrayNode temps = (ArrayNode) cfg.get("templates");
        String urlTemplate = cfg.path("urlTemplate").asText();
        boolean sendWhatsapp = cfg.path("sendWhatsapp").asBoolean();
        boolean sendSms = cfg.path("sendSms").asBoolean();
        sendNotificationToEmail(dataMensaje, tipoNotificacion);
        if (sendSms)
            sendSms(dataMensaje, tipoNotificacion);
        for (JsonNode templateNode : temps) {
            if (!dataMensaje.isEmpty() && templateNode.get("tipo").asText().equalsIgnoreCase(tipoNotificacion.name())) {// si
                                                                                                                        // existe
                                                                                                                        // esta
                                                                                                                        // notificacion
                if (sendWhatsapp)
                    buildBodyAndSendWhatsapp(dataMensaje, templateNode, urlTemplate);
                break;
            }
        }
    }

    public void buildBodyAndSendWhatsapp(Map<String, String> dataMensaje, JsonNode templateNode, String urlTemplate) {
        if (!ObjectUtils.isEmpty(dataMensaje.get(Ctns.PHONE))) {
            ObjectNode body = buildBodyObject(dataMensaje, templateNode.path("idTemplate").asText());
            sendMessageToWhatsapp(body, urlTemplate);
        }
    }

    public void sendSms(Map<String, String> dataMensaje, TipoNotificacionEnum tipoNotificacion) {
        if (ObjectUtils.isEmpty(tipoNotificacion))
            return;
        var phone = getOrDefaulBlank(dataMensaje, Ctns.PHONE);
        log.info("Entro a sendSms phone: " + phone);
        if (phone.isEmpty())
            return;
        phone = handlePhonePreffix0(phone);
        dataMensaje.put(Ctns.PHONE, phone);
        var sendSiniestroMessage = Arrays.asList(TipoNotificacionEnum.SINIESTRO_CREADO,
                TipoNotificacionEnum.SINIESTRO_CADUCIDAD, TipoNotificacionEnum.CAMBIO_ESTADO);
        if (sendSiniestroMessage.contains(tipoNotificacion)) {
            emailService.sendSms(dataMensaje, EmailService.SMS_SINIESTRO_TEMPLATE);
        } else if (TipoNotificacionEnum.RECETA_CADUCAR.equals(tipoNotificacion)) {
            emailService.sendSms(dataMensaje, EmailService.SMS_RECETA_TEMPLATE);
        }
    }

    public void sendNotificationToEmail(Map<String, String> dataMensaje, TipoNotificacionEnum tipoNotificacion) {
        sendNotificationToEmail(dataMensaje, tipoNotificacion, null);
    }

    public <T> void sendNotificationToEmail(Map<String, T> dataMensaje, TipoNotificacionEnum tipoNotificacion,
            Map<String, byte[]> attachment) {
        var mail = dataMensaje.get("mail");
        if (ObjectUtils.isEmpty(mail))
            return;

        Pair<String, String> subjectTemplate = notificacionesMap.getOrDefault(tipoNotificacion, null);
        if (subjectTemplate == null)
            return;

        emailService.sendNotificationToEmail(dataMensaje, subjectTemplate.getFirst(), subjectTemplate.getSecond(),
                attachment);
    }

    public String getOrDefaulBlank(Map<String, String> fields, String key) {
        return fields.getOrDefault(key, "");
    }

    public ObjectNode buildBodyObject(Map<String, String> fields, String idTemplate) {
        ObjectNode body = mapper.createObjectNode();
        String phone = handlePhonePreffix593(fields.get(Ctns.PHONE).trim());
        String numeroSiniestro = fields.getOrDefault(NUM_SINIESTRO, "") + "." + fields.getOrDefault("item", "");
        String paciente = getOrDefaulBlank(fields, PACIENTE);
        String ramo = getOrDefaulBlank(fields, RAMO);
        String incapacidad = getOrDefaulBlank(fields, INCAPACIDAD);
        String estado = getOrDefaulBlank(fields, ESTADO);

        body.put(Ctns.PHONE, phone);
        body.put("text", "");
        body.put("type", Ctns.TEMPLATE);
        // props
        ObjectNode props = body.putObject("props");
        props.put(VariablesWhatsapp.NUMERO_SINIESTRO, numeroSiniestro);
        props.put(VariablesWhatsapp.RAMO, ramo);
        props.put(VariablesWhatsapp.INCAPACIDAD, incapacidad);
        props.put(VariablesWhatsapp.PACIENTE, paciente);
        if (estado != null)
            props.put(VariablesWhatsapp.ESTADO,
                    Utilities.mapearEstados(EstadoSiniestroEnum.valueOf(estado.toUpperCase()), true));
        // props receta
        String nombreDocumento = getOrDefaulBlank(fields, NOMBRE_DOCUMENTO);
        String fechaEmision = getOrDefaulBlank(fields, FECHA_EMISION);
        props.put(VariablesWhatsapp.NOMBRE_DOCUMENTO, nombreDocumento);
        props.put(VariablesWhatsapp.FECHA_EMISION, fechaEmision);
        // props incap siniestro
        String daysToExpire = getOrDefaulBlank(fields, DAYS_TO_EXPIRE);
        props.put(VariablesWhatsapp.DIAS_CADUCAR, daysToExpire);
        // payload
        ObjectNode payload = body.putObject("payload");
        payload.put("tpl", idTemplate);
        return body;
    }

    public String removeSpacesAndPlus(String text) {
        return text.replace(" ", "").replace("+", "");
    }

    public String handlePhonePreffix593(String phone) {
        phone = removeSpacesAndPlus(phone);
        if (!phone.isEmpty() && phone.charAt(0) == '0') {
            phone = "593" + phone.substring(1);
        }
        return phone;
    }

    public String handlePhonePreffix0(String phone) {
        phone = removeSpacesAndPlus(phone);
        if (phone.length() > 3 && "593".equals(phone.substring(0, 3))) {
            phone = "0" + phone.substring(3);
        }
        return phone;
    }

    public HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json;charset=UTF-8");
        headers.set("User-Agent",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36");
        return headers;
    }

    public void sendMessageToWhatsapp(ObjectNode body, String urlTemplate) {
        try {
            HttpHeaders headers = getHttpHeaders();
            HttpEntity<?> entity = new HttpEntity<>(mapper.writeValueAsString(body), headers);
            log.info("Body a enviar :: " + body);
            ResponseEntity<String> respuesta = restTemplate.exchange(urlTemplate, HttpMethod.POST, entity,
                    String.class);
            log.info("Respuesta de chasqui :: " + respuesta.getBody());
        } catch (JsonProcessingException e) {
            log.error("Error al procesar JSON :: " + e.getMessage());
        } catch (Exception ex) {
            log.error("Error al enviar a chasqui :: " + ex.getMessage());
        }
    }

    // Set<cdReclamo, cdCompania>
    public <T extends IToFindDataMessage> Map<String, Map<String, String>> findDistinctDataMessages(
            Set<T> cdReclamoCdCompania) {
        Map<String, Map<String, String>> dataMensaje = new HashMap<>();
        cdReclamoCdCompania.forEach(v -> {
            var data = processData(v.getCdReclamo(), v.getCdCompania(), v.getCdIncSiniestro());
            dataMensaje.put(data.getKey(), data.getValue());
        });
        return dataMensaje;
    }

    public Map.Entry<String, Map<String, String>> processData(int cdReclamo, int cdCompania, int cdIncSiniestro) {
        try {
            var key = String.format(KEY_DATA_MSG, cdReclamo, cdCompania);
            var value = siniestroPortalSrv.findDataByMensaje(cdCompania, cdReclamo, cdIncSiniestro);
            return Map.entry(key, value);
        } catch (Exception ex) {
            log.error(String.format(
                    "Error al procesar los datos para encontrar el siniestro, cdReclamo: %d, cdCompania: %d, cdIncSiniestro: %d, Excepción: %s",
                    cdReclamo, cdCompania, cdIncSiniestro, ex.getMessage()), ex);
            throw new CustomException("No se encontró el siniestro del mensaje con cdReclamo: " + cdReclamo
                    + ", cdCompania: " + cdCompania + ", cdIncSiniestro: " + cdIncSiniestro);
        }
    }

    public <T extends IToFindDataMessage> void sendMessagesInList(List<T> listToNotify,
            TipoNotificacionEnum tipoNotificacionEnum, AditionalMessageProperties<T> aditionalProperties) {
        if (listToNotify.isEmpty())
            return;
        var cdReclamoCdCompaniaSet = new HashSet<>(listToNotify);
        var dataMessages = this.findDistinctDataMessages(cdReclamoCdCompaniaSet);
        listToNotify.forEach(item -> {
            var key = String.format(KEY_DATA_MSG, item.getCdReclamo(), item.getCdCompania());
            var dataMsj = dataMessages.get(key);
            if (aditionalProperties != null)
                aditionalProperties.putProperties(item, dataMsj);
            try {
                this.findTemplateAndSendMessages(dataMsj, tipoNotificacionEnum);
            } catch (Exception ex) {
                log.error("Error al enviar mensaje a: " + dataMsj.getOrDefault("phone", "+666") + ", message: "
                        + ex.getMessage());
            }
        });
    }
}