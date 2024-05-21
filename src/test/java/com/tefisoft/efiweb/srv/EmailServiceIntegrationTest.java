package com.tefisoft.efiweb.srv;

import com.ctc.wstx.util.StringUtil;
import com.tefisoft.efiweb.dao.UsuarioDAO;
import com.tefisoft.efiweb.entidad.Usuario;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.io.OutputStream;
import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import javax.servlet.http.HttpServletResponse;
import org.springframework.util.StringUtils;
import static com.tefisoft.efiweb.util.VariablesSiniestro.DAYS_TO_EXPIRE;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class EmailServiceIntegrationTest {

    @Autowired
    private SiniestroPortalSrv siniestroPortalSrv;
    @Autowired
    private EmailService emailService;
    @Autowired
    SMSService smsService;
    @Autowired
    SendWhatsappSrv sendWhatsappSrv;
    @Autowired
    DocsDigitalesSrv docsDigitalesSrv;

    @Autowired
    UsuarioDAO usuarioDAO;

    private Map<String, String> fields;

    @BeforeEach
    void setUp() {
        var numSiniestro = "663189.0";
        fields = new HashMap<>();
        fields.put("numSiniestro", numSiniestro);
        fields.put("item", " 0");
        fields.put("estado", "POR_REGULARIZAR");
        fields.put("ramo", "GASTOS MÉDICOS MAYORES-MEDICA/GM21C22753");
        fields.put("incapacidad",
                "GRIPE GRIPE GRIPE GRIPE GRIPE GRIPE GRIPE GRIPE GRIPE GRIPE GRIPE GRIPE GRIPE GRIPE ");
        fields.put("mail", "grivera@segurossuarez.com");
        fields.put("phone", "0984315652");
        fields.put("paciente", "MANANGON PADILLA CYNTHIA ELIZABETH CYNTHIA ELIZABETH");
    }

    @Test
    void itShouldSendASiniestroCreadoNotificationToEmailCorrectly() {
        // given
        var subject = EmailService.CREACION_ESTADO_SUBJECT;
        var pathTemplate = EmailService.CREACION_TEMPLATE;
        fields.put("ejecutivoEmail", "grivera@segurossuarez.com");
        fields.put("mail", "grivera@segurossuarez.com");
        // when -then
        Assertions.assertDoesNotThrow(() -> emailService.sendNotificationToEmail(fields, subject, pathTemplate));
    }

    @Test
    void itShouldSendACambioEstadoNotificationToEmailCorrectly() {
        // given
        var fields = siniestroPortalSrv.findDataByMensaje(1, 98, 104);
        fields.put("ejecutivoEmail", "grivera@segurossuarez.com");
        fields.put("mail", "jtisalema@segurossuarez.com");
        var subject = EmailService.CAMBIO_ESTADO_SUBJECT;
        var pathTemplate = EmailService.CAMBIO_ESTADO_TEMPLATE;
        // when -then
        Assertions.assertDoesNotThrow(() -> emailService.sendNotificationToEmail(fields, subject, pathTemplate));

    }

    @Test
    void itShouldSendARecetaNotificationToEmailCorrectly() {
        // given
        fields.put("nombreDocumento", "Documento de prueba");
        fields.put("fechaEmision", LocalDate.now().minusDays(15).toString());
        fields.put("ejecutivoEmail", "grivera@segurossuarez.com");
        fields.put("mail", "grivera@segurossuarez.com");
        var subject = EmailService.RECETA_CADUCAR_SUBJECT;
        var pathTemplate = EmailService.RECETA_CADUCAR_TEMPLATE;
        // when -then
        emailService.sendNotificationToEmail(fields, subject, pathTemplate);
    }

    @Test
    void itShouldSendASiniestroPorCaducarNotificationToEmailCorrectly() {
        // given
        fields.put(DAYS_TO_EXPIRE, "han transcurrido 30 días.");
        var subject = EmailService.SINIESTRO_CADUCIDAD_SUBJECT;
        var pathTemplate = EmailService.SINIESTRO_CADUCIDAD_TEMPLATE;
        // when -then
        Assertions.assertDoesNotThrow(() -> emailService.sendNotificationToEmail(fields, subject, pathTemplate));
    }

    @Test
    void itShouldSendASiniestroCaducadoNotificationToEmailCorrectly() {
        // given
        fields.put(DAYS_TO_EXPIRE, "ha caducado.");
        var subject = EmailService.SINIESTRO_CADUCIDAD_SUBJECT;
        var pathTemplate = EmailService.SINIESTRO_CADUCIDAD_TEMPLATE;
        // when -then
        Assertions.assertDoesNotThrow(() -> emailService.sendNotificationToEmail(fields, subject, pathTemplate));

    }

    @Test
    void itShouldSendAnsSMSCorrectly() {
        // when - then
        Assertions.assertDoesNotThrow(() -> smsService.createAndSendSoapRequest("0984315652",
                "Seguros Suárez recuerda que la receta de medicina" +
                        " continua está por CADUCAR por favor actualizar en nuestra plataforma, " +
                        "para mayor información llamar 033920141",
                "12548797"));
    }

    @Test
    void processData() {
        int cdReclamo = 506;
        int cdCompania = 1;
        int cdIncSiniestro = 540;
        sendWhatsappSrv.processData(cdReclamo, cdCompania, cdIncSiniestro);
    }

    @Test
    void fixpass() {
        // when - then

        var list = usuarioDAO.findAll();
        var today = usuarioDAO.findById(9788).orElseThrow();
        var pass = new BCryptPasswordEncoder();
        list.forEach(a -> {

            if (DateUtils.isSameDay(today.getFcCreacion(), a.getFcCreacion())) {
                if (a.getCedula() != null && !pass.matches(a.getCedula(), a.getClave())) {
                    a.setClave(pass.encode(a.getCedula()));
                    usuarioDAO.save(a);
                }
            }

        });
    }

    @Test
    void fixpass2() {
        // when - then

        var cedulas = Arrays.asList("1804153375", "0104590302", "1805233267", "1803609427", "1804920070");
        var list = usuarioDAO.findAllByCedulaIn(cedulas);

        var pass = new BCryptPasswordEncoder();
        list.forEach(a -> {

            if (a.getCedula() != null && !pass.matches(a.getCedula(), a.getClave())) {
                a.setClave(pass.encode(a.getCedula()));
                usuarioDAO.save(a);
            }

        });
    }

    @Test
    void enviarEncuestasSatisfaccion() {
        String correoElectronico = "grivera@segurossuarez.com";
        String nombreApellido = "Estimado: " + "Giovanni Francisco Rivera Rodríguez";
        Assertions.assertDoesNotThrow(
                () -> emailService.sendSatisfactionSurvey(correoElectronico, nombreApellido));
    }
}