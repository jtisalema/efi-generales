package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.tefisoft.efiweb.dao.ClienteJdbcDAO;
import com.tefisoft.efiweb.dao.TelefonosRepositoryJDBC;
import com.tefisoft.efiweb.entidad.Usuario;
import com.tefisoft.efiweb.enums.EstadoSiniestroEnum;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.util.Ctns;
import com.tefisoft.efiweb.util.HelperUtil;
import com.tefisoft.efiweb.util.PdfUtils;
import com.tefisoft.efiweb.util.Utilities;
import com.tefisoft.efiweb.util.VariablesSiniestro;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.activation.DataSource;
import javax.mail.SendFailedException;
import javax.mail.util.ByteArrayDataSource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.tefisoft.efiweb.util.VariablesSiniestro.ESTADO;

/**
 * @author dacopanCM on 11/03/17.
 */
@Service
@RequiredArgsConstructor
@CommonsLog
public class EmailService {

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.url}")
    private String urlLogin;

    @Value("${app.mail:na}")
    private String tempEmail = "na";

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine springTemplateEngine;
    private final SMSService smsService;
    private final ClienteJdbcDAO clienteJdbcDao;
    private final TelefonosRepositoryJDBC telefonosRepositoryJDBC;

    private static final String UTF_8 = "UTF-8";
    private static final String ASUNTO = "asunto";
    private static final String PASSWORD_SUBJECT = "Contraseña Seguros Suárez";
    public static final String CREACION_ESTADO_SUBJECT = "Creación de Siniestro";
    public static final String RECETA_CADUCAR_SUBJECT = "Receta pronto a expirar";
    public static final String CAMBIO_ESTADO_SUBJECT = "Cambio de estado de Siniestro";
    public static final String LIQUIDACION_SUBJECT = "Liquidación de Siniestro";
    public static final String ENCUESTASATISFACCION_SUBJECT = "\"Estamos mejorando para ti\" Califica nuestro servicio.";

    public static final String SINIESTRO_CADUCIDAD_SUBJECT = "Estado de la caducidad del siniestro";
    private static final String CREATE_PASSWORD_SUBJECT = "SEGUROS SUÁREZ: Usuario para el Ingreso a la Web App";

    private static final String CREATE_PASSWORD_TEMPLATE = "email/createPassword";
    private static final String RESET_PASSWORD_TEMPLATE = "email/passwordEmail";
    public static final String CREACION_TEMPLATE = "email/crearSiniestro";
    public static final String CAMBIO_ESTADO_TEMPLATE = "email/cambioEstado";
    public static final String RECETA_CADUCAR_TEMPLATE = "email/recetaCaduca";
    public static final String SINIESTRO_CADUCIDAD_TEMPLATE = "email/caducidadSiniestro";
    public static final String LIQUIDADO_TEMPPLATE = "email/liquidacionSiniestro";
    public static final String ENCUESTASATISFACCION_TEMPLATE = "email/encuestaSatisfaccion";

    public static final String SMS_SINIESTRO_TEMPLATE = "sms/crearCambiarCaducidad";
    public static final String SMS_RECETA_TEMPLATE = "sms/receta";

    public static final String PDF_ROUTE = "templates/pdf/SS_Online_rev5P_EQ-1.pdf";

    @Async
    public void sendNewPasswordEmail(Usuario usuario, String nombre, String apellido, String password) {
        var model = commonModelFields();
        model.put("nombre", nombre);
        model.put("apellido", apellido);
        model.put("password", password);
        model.put("usuario", usuario.getUsuario());
        model.put(ASUNTO, PASSWORD_SUBJECT);
        model.put("url", urlLogin);

        try {
            log.info("Enviando nueva clave a :: " + usuario.getEmail());
            sendEmail(usuario.getEmail(), PASSWORD_SUBJECT, mergeTemplateIntoString(RESET_PASSWORD_TEMPLATE, model));
        } catch (Exception e) {
            log.error(RESET_PASSWORD_TEMPLATE, e);
        }
    }

    void sendPasswordEmail(Usuario usr, String nombre, String apellido, String password) {
        Map<String, Object> model = commonModelFields();
        model.put("nombre", nombre);
        model.put("apellido", apellido);
        model.put("password", password);
        model.put("usuario", usr.getUsuario());
        model.put(ASUNTO, CREATE_PASSWORD_SUBJECT);
        model.put("url", urlLogin);
        model.put("contratantes", listJoinUser(clienteJdbcDao.getNameUserContactPortal(usr.getId())));
        model.put("asegurados", listJoinUser(clienteJdbcDao.getNameUserAsegPortal(usr.getId())));
        try {

            log.info("Enviando Mensaje: " + usr.getEmail());
            sendEmailWithMultiAttachments(usr.getEmail(), PASSWORD_SUBJECT,
                    mergeTemplateIntoString(CREATE_PASSWORD_TEMPLATE, model), PdfUtils.pdfToByte(PDF_ROUTE));
        } catch (Exception e) {
            log.error(CREATE_PASSWORD_TEMPLATE, e);
        }
    }

    private List<String> listJoinUser(List<Usuario> dataTableUser) {
        List<String> listgetData = new ArrayList<>();
        for (Usuario user : dataTableUser) {
            String nombre = HelperUtil.empty(user.getNmAsegurado());
            String apellido = HelperUtil.empty(user.getApAsegurado());
            if (!nombre.isEmpty() || !apellido.isEmpty()) {
                var dataUser = user.getCedula() + " " + nombre + " " + apellido;
                listgetData.add(dataUser);
            }
        }
        return listgetData;
    }

    @Async
    public <T> void sendNotificationToEmail(Map<String, T> fields, String subject, String pathTemplate) {
        sendNotificationToEmailImplementation(fields, subject, pathTemplate, null);
    }

    @Async
    public <T> void sendNotificationToEmail(Map<String, T> fields, String subject, String pathTemplate,
            Map<String, byte[]> attachment) {
        sendNotificationToEmailImplementation(fields, subject, pathTemplate, attachment);
    }

    private <T> void sendNotificationToEmailImplementation(Map<String, T> fields, String subject, String pathTemplate,
            Map<String, byte[]> attachment) {
        var mail = (String) fields.get("mail");
        var ejecutivoEmail = (String) fields.get("ejecutivoEmail");
        var fieldsData = getThymeleafCommonModel(fields, false);
        var gastosNoCubiertos = fieldsData.get("gastosNoCubiertos");
        var sumTotalMontos = 0.0;
        if (!ObjectUtils.isEmpty(gastosNoCubiertos)) {
            for (JsonNode gastos : (ArrayNode) gastosNoCubiertos) {
                sumTotalMontos += gastos.path("monto").asDouble();
            }
            fieldsData.put("sumTotalMontos", sumTotalMontos);
        }

        fieldsData.put("urlResources", urlLogin);

        if (pathTemplate.equals(EmailService.CAMBIO_ESTADO_TEMPLATE)) {
            var estadoSiniestro = fields.get("estado");
            subject = subject + (StringUtils.hasText(estadoSiniestro.toString()) ? "-" + estadoSiniestro : "");
        }

        try {
            if (attachment != null) {
                var cdRamoCotizacion = (int) fields.get("cdRamoCotizacion");
                var cdCompania = (int) fields.get("cdCompania");

                String replyTo = telefonosRepositoryJDBC.getMailEjecutivoSiniestro(cdCompania, cdRamoCotizacion);
                sendEmailWithMultiAttachments(
                        new String[] { mail.trim(), ejecutivoEmail.trim() },
                        replyTo,
                        subject,
                        attachment,
                        mergeTemplateIntoString(pathTemplate, fieldsData));
                return;
            }
            sendEmail(new String[] { mail.trim(), ejecutivoEmail.trim() }, subject,
                    mergeTemplateIntoString(pathTemplate, fieldsData));
        } catch (Exception ex) {
            log.error("Error el anviar mail a: " + mail);
            throw new CustomException(ex.getMessage());
        }
    }

    public void sendSms(Map<String, String> fields, String pathTemplate) {
        var model = getThymeleafCommonModel(fields, true);
        String messageToSend = mergeTemplateIntoString(pathTemplate, model);
        var phone = fields.getOrDefault(Ctns.PHONE, "");
        var emReferencia = fields.getOrDefault(VariablesSiniestro.SMS_EM_REFERENCIA, "");
        smsService.createAndSendSoapRequest(phone, messageToSend, emReferencia);
    }

    public Map<String, Object> commonModelFields() {
        Map<String, Object> model = new HashMap<>();
        model.put("facebook", urlLogin + "/img/icon_facebook-01.png");
        model.put("instagram", urlLogin + "/img/icon_instagram-01.png");
        model.put("twitter", urlLogin + "/img/icon_twiter-01.png");
        model.put("likedin", urlLogin + "/img/icon_linkedin-01.png");
        return model;
    }

    @SuppressWarnings("unchecked")
    public <T> Map<String, Object> getThymeleafCommonModel(Map<String, T> fields, boolean movil) {
        Map<String, Object> model = commonModelFields();

        fields.keySet().forEach(key -> {
            T value = fields.get(key);
            model.put(key, fields.getOrDefault(key, value instanceof String ? (T) "" : null));
        });
        try {
            var estadoObj = fields.get(ESTADO);
            var estado = (String) estadoObj;
            model.put(ESTADO, Utilities.mapearEstados(EstadoSiniestroEnum.valueOf(estado), movil));
        } catch (Exception ex) {
            log.error("Error leyendo el campo: " + ESTADO + ", message: " + ex.getMessage());
        }
        return model;
    }

    private String mergeTemplateIntoString(final @NonNull String templateReference,
            final @NonNull Map<String, Object> model) {
        final String trimmedTemplateReference = templateReference.trim();
        final Context context = new Context();
        context.setVariables(model);

        return springTemplateEngine.process(trimmedTemplateReference, context);
    }

    private void sendEmail(String toEmail, String subject, String content) {
        sendEmail(new String[] { toEmail }, subject, content);
    }

    private void sendEmail(String[] toEmail, String subject, String content) {
        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, UTF_8);
            message.setTo(processEmail(toEmail));
            message.setFrom(fromEmail); // could be parameterized...
            message.setSubject(subject);
            mimeMessage.setHeader("Content-Type", "text/plain; charset=UTF-8");
            message.setText(content, true);
        };
        this.javaMailSender.send(preparator);
    }

    public void sendEmailWithMultiAttachments(String[] toEmail, String replyTo, String subject,
            Map<String, byte[]> attachment, String content) {
        if (ObjectUtils.isEmpty(toEmail))
            throw new IllegalArgumentException("emails must not be null or empty");
        if (attachment == null)
            throw new IllegalArgumentException("attachment must not be null");

        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED,
                    UTF_8);
            message.setTo(processEmail(toEmail));
            message.setSubject(subject);
            message.setFrom(fromEmail);
            if (StringUtils.hasText(content))
                message.setText(content, true);
            attachment.forEach((key, value) -> {
                var attachmentInputStream = new ByteArrayDataSource(value, "application/pdf");
                try {
                    message.addAttachment(key, attachmentInputStream);
                } catch (Exception e) {
                    log.error("Error cargando el documento: " + key + ", message: " + e.getMessage());
                }
            });
            if (replyTo != null) {
                message.setReplyTo(processEmail(replyTo));
            }
        };
        this.javaMailSender.send(preparator);
    }

    private void sendEmailWithMultiAttachments(String toEmail, String subject, String content, byte[] attachment) {
        sendEmailWithMultiAttachments(new String[] { toEmail }, subject, content, attachment);
    }

    private void sendEmailWithMultiAttachments(String[] toEmail, String subject, String content, byte[] attachment) {
        DataSource attachmentDataSource = new ByteArrayDataSource(attachment, "application/pdf");
        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, UTF_8);
            message.setTo(processEmail(toEmail));
            message.setFrom(fromEmail);
            message.setSubject(subject);
            message.setText(content, true);
            message.addAttachment("Seguros_Suarez_Online.pdf", attachmentDataSource);
        };
        this.javaMailSender.send(preparator);
    }

    public String[] processEmail(String[] email) {
        for (int i = 0; i < email.length; i++) {
            email[i] = processEmail(email[i]);
        }
        return email;
    }

    public String processEmail(String email) {
        if (tempEmail.equals("na"))
            return email;
        return tempEmail;
    }

    // #region Incorporación correo encuesta de satisfacción.
    @Async
    public void sendSatisfactionSurvey(String correoElectronico, String nombreApellido) {
        var model = commonModelFields();
        model.put("nombreApellido", "Estimado/a: " + nombreApellido);
        try {
            log.info("Enviando encuesta satisfacción: " + correoElectronico);
            sendEmail(correoElectronico, ENCUESTASATISFACCION_SUBJECT,
                    mergeTemplateIntoString(ENCUESTASATISFACCION_TEMPLATE, model));
        } catch (Exception e) {
            log.info("No se pudo enviar el correo electronico a:" + correoElectronico);
            log.error(ENCUESTASATISFACCION_TEMPLATE, e);
        }
    }
    // #endregion

}
