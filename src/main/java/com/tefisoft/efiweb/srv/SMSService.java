package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.jamesmurty.utils.XMLBuilder2;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.util.Utilities;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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
                .up() //parEmisor
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
        } catch (Exception ex) {
            log.error("Error sending SMS, message: " + ex.getMessage());
            throw new CustomException(ex.getMessage());
        }
    }

    public void handleXmlResponse(ResponseEntity<String> response) throws JsonProcessingException {
        var body = xmlMapper.readTree(response.getBody());
        var enviarSmsResult = body.path("Body").path("EnviarSMSResponse").path("EnviarSMSResult");
        var reNumErrores = enviarSmsResult.path("reNumErrores").asInt();
        var reErrores = enviarSmsResult.path("reErrores");
        if (reNumErrores > 0) throw new CustomException(reErrores.toString());
    }

}
