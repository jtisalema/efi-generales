package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.jamesmurty.utils.XMLBuilder2;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.srv.SMSService.SMSDetail;
import com.tefisoft.efiweb.util.Utilities;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@CommonsLog
public class SMSService {

    @Value("${app.sms.url}")
    private String url;

    @Value("${app.sms.SOAPAction}")
    private String soapAction;

    @Value("${app.sms.emServicio}")
    private String emServicio;

    @Value("${app.sms.claveMD5}")
    private String claveMD5;

    @Value("${app.sms.emEmisor}")
    private String emEmisor;

    @Value("${app.sms.emLogin}")
    private String emLogin;

    @Value("${app.sms.emPwd}")
    private String emPwd;

    @Value("${app.sms.emNombrePC}")
    private String emNombrePC;

    private final XmlMapper xmlMapper = new XmlMapper();
    private final RestTemplate restTemplate;
    private final AdministracionHomeSrv administracionHomeSrv;

    public String createBody(String phone, String message, String emReferencia) {

        message = sanitizeMessage(message);
        // Crear y configurar el objeto JAXB del cuerpo de la solicitud
        var xmlBody = XMLBuilder2.create("soap:Envelope")
                .namespace("xsi", "http://www.w3.org/2001/XMLSchema-instance")
                .namespace("xsd", "http://www.w3.org/2001/XMLSchema")
                .namespace("soap", "http://schemas.xmlsoap.org/soap/envelope/")
                .elem("soap:Body")
                .elem("EnviarSMS").namespace("http://secure.eclipsoft.com/wsSMSEmpresarial/wscSMSEmp")
                .elem("parEmisor")
                .elem("emServicio").text(emServicio).up()
                .elem("emEmisor").text(emEmisor).up()
                .elem("emLogin").text(emLogin).up()
                .elem("emPwd").text(emPwd).up()
                .elem("emNombrePC").text(emNombrePC).up()
                .elem("emFechaEnv").text(LocalDate.now().format(DateTimeFormatter.ofPattern("MM/dd/yyyy"))).up()
                .elem("emHoraEnv").text("00:00").up()
                .elem("emReferencia").text(emReferencia).up()
                .elem("emKey").text(this.generateEmKey(emReferencia)).up()
                .up() // parEmisor
                .elem("parDestinatarios").text(phone).up()
                .elem("parMensaje").text(message).up()
                .up() // EnviarSMS
                .up(); // soapenv:Body
        return xmlBody.asString();
    }

    public String sanitizeMessage(String message) {
        message = Utilities.removerTildes(message);
        message = Utilities.removerCaracteresEspeciales(message);
        message = Utilities.truncate(message, 160);
        return message;
    }

    public String generateEmKey(String emReferencia) {
        String formatoMd5 = "%s;%s;%s;%s;%s;%s";
        return DigestUtils.md5Hex(String.format(formatoMd5, emServicio, claveMD5, emEmisor,
                emLogin, emPwd, emReferencia));
    }

    public void createAndSendSoapRequest(String phone, String message, String emReferencia) {
        var soapRequest = this.createBody(phone, message, emReferencia);
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_XML);
        headers.set("SOAPAction", soapAction);
        var entity = new HttpEntity<>(soapRequest, headers);
        try {
            var response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            handleXmlResponse(response);
            callSaveSMSDetailService(true, phone, message);
        } catch (Exception ex) {
            log.error("Error sending SMS, message: " + ex.getMessage());
            callSaveSMSDetailService(false, phone, message);
            throw new CustomException(ex.getMessage());
        }
    }

    public void handleXmlResponse(ResponseEntity<String> response) throws JsonProcessingException {
        var body = xmlMapper.readTree(response.getBody());
        var enviarSmsResult = body.path("Body").path("EnviarSMSResponse").path("EnviarSMSResult");
        var reNumErrores = enviarSmsResult.path("reNumErrores").asInt();
        var reErrores = enviarSmsResult.path("reErrores");
        if (reNumErrores > 0)
            throw new CustomException(reErrores.toString());
    }

    // #region Incorporación de servicio contador envio SMS
    public ObjectNode findConfig() {
        return administracionHomeSrv.find();
    }

    public void callSaveSMSDetailService(boolean esExitoso, String numeroTelefono, String mensaje) {
        try {
            ObjectNode cfg = findConfig();
            String tokenEnvioSms = cfg.path("tokenEnvioSms").asText();
            SMSDetail informacionSmsGuardar = new SMSDetail();
            informacionSmsGuardar.setCelular(numeroTelefono);
            informacionSmsGuardar.setMensaje(mensaje);
            informacionSmsGuardar.setOrigen("App Clientes");
            if (esExitoso) {
                informacionSmsGuardar.setEstado("1");
            } else {
                informacionSmsGuardar.setEstado("2");
                informacionSmsGuardar.setMensajeError("No se pudo enviar el mensaje.");
            }
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(informacionSmsGuardar);

            // Construye los encabezados de la solicitud
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer ".concat(tokenEnvioSms));

            // Construye la entidad de solicitud con el cuerpo y los encabezados
            HttpEntity<String> requestEntity = new HttpEntity<>(jsonBody, headers);

            // Realiza la solicitud POST al servicio
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    "https://cotizador.segurossuarez.com/backend/public/api/saveSMSDetail",
                    HttpMethod.POST,
                    requestEntity,
                    String.class);

            // Maneja la respuesta si es necesario
            HttpStatus statusCode = responseEntity.getStatusCode();
            if (statusCode == HttpStatus.OK) {
                String responseBody = responseEntity.getBody();
            } else {
            }
        } catch (JsonProcessingException e) {
            // Maneja la excepción
            System.err.println("Error al convertir el objeto a JSON: " + e.getMessage());
            e.printStackTrace(); // Esto muestra la traza completa de la excepción
        }
    }

    public class SMSDetail {
        private String mensaje;
        private String celular;
        private String estado;
        private String mensajeError;
        private String origen;

        public String getMensaje() {
            return mensaje;
        }

        public void setMensaje(String mensaje) {
            this.mensaje = mensaje;
        }

        public String getCelular() {
            return celular;
        }

        public void setCelular(String celular) {
            this.celular = celular;
        }

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }

        public String getMensajeError() {
            return mensajeError;
        }

        public void setMensajeError(String mensajeError) {
            this.mensajeError = mensajeError;
        }

        public String getOrigen() {
            return origen;
        }

        public void setOrigen(String origen) {
            this.origen = origen;
        }

    }
    // #endregion

}
