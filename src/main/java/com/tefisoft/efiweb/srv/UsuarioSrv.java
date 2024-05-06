package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.ClienteDAO;
import com.tefisoft.efiweb.dao.UsuarioDAO;
import com.tefisoft.efiweb.entidad.BrkTClientes;
import com.tefisoft.efiweb.entidad.Usuario;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.util.Ctns;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.util.IOUtils;
import org.eclipse.jdt.internal.compiler.flow.TryFlowContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.net.URL;
import java.util.Date;
import java.util.List;

/**
 * @author dacopanCM on 10/03/17.
 */
@Service
@Transactional(readOnly = true)
public class UsuarioSrv {

    private final Log log = LogFactory.getLog(getClass());

    private final UsuarioDAO usuarios;
    private final EmailService emailService;
    private final ClienteDAO clienteDAO;
    private final StorageSrv storageSrv;
    private final ExternalStorageSrv externalStorageSrv;
    static final String EXTERNAL_IMG_PATH = "users/profiles/%s";

    @Autowired
    public UsuarioSrv(UsuarioDAO usuarios, EmailService emailService, ClienteDAO clienteDAO, @Value("${app.data}") String path, ExternalStorageSrv externalStorageSrv) {
        this.usuarios = usuarios;
        this.emailService = emailService;
        this.clienteDAO = clienteDAO;
        this.storageSrv = new LocalStorageSrv(".jpg,.jpeg,.png", path + "/profiles");
        this.externalStorageSrv = externalStorageSrv;
    }

    /**
     * el usuario coloco mal su contraseña entonces debe aumentarse el contador de inicios de sesion
     * fallidos, y actualizar la fecha de inicios de sesion fallidos
     *
     * @param usuario usuario q fallo en inio de sesioón
     * @return user
     */
    @Transactional
    public boolean failLoginUser(String usuario) {
        Usuario u = usuarios.findByUsuario(usuario);
        if (u != null) {
            int loginFails = u.getIntentosFallidos() == null ? 0 : u.getIntentosFallidos();
            u.setIntentosFallidos(loginFails + 1);
            u.setFcIntentoFallido(new Date());
            usuarios.save(u);
            return u.getIntentosFallidos() >= 3;
        }
        return false;
    }

    /**
     * cuando el usuario ha inciado correctamente la session
     * entonces debemos poner en cero los login fallidos
     * y nullificar la fecha de ultimo inicio sesion fallido
     *
     * @param usuario usuario q inciio sesion correctamente
     * @return usuario
     */
    @Transactional
    public Usuario successLogin(String usuario) {
        Usuario u = usuarios.findByUsuario(usuario);
        if (u != null) {
            u.setFcIntentoFallido(null);
            u.setIntentosFallidos(0);
            u.setFcUltVisitaTmp(u.getFcUltVisita());
            u.setFcUltVisita(new Date());
            if (u.getContadorSesiones() == null) {
                u.setContadorSesiones(BigInteger.ONE);
            } else {
                u.setContadorSesiones(u.getContadorSesiones().add(BigInteger.ONE));
            }
            usuarios.save(u);
            return u;
        }
        return null;


    }

    /**
     * cuando se solicita una nueva contraseña, se envia el numero de cedula del cliente
     *
     * @param item q solicito el cambio de contraseña
     */
    @Transactional
    public void envioCredenciales(ObjectNode item) {
        String usuario = item.get("user").asText();
        Usuario u = usuarios.findByUsuario(usuario.trim());
        if (u != null) {
            if (ObjectUtils.isEmpty(u.getCedula()))
                throw new CustomException("El usuario ingresado no tiene una identificación registrada en el sistema. Por favor comuníquese con su ejecutivo de cuenta");

            u.setIntentosFallidos(0);
            u.setActivo(true);
            u.setFcIntentoFallido(null);
            emailService.sendNewPasswordEmail(u, u.getNmAsegurado(), u.getApAsegurado(), u.getCedula());
            usuarios.save(u);
        }
    }

    /**
     * cuando el usuario colocó la contraseña correcta pero la cuenta esta bloqueada
     * porque el tiempo desde el ultimo intento fallido de inicio de sesion no supera
     * el tiempo permitido
     *
     * @param usuario usuario cuya cuenta esta bloqueada
     * @return tiempo q debe esperar para volver a intentar iniciar sesión
     */
    public long accountLocked(String usuario) {
        Usuario u = usuarios.findByUsuario(usuario);
        if (u != null && u.getFcIntentoFallido() != null) {
            long tiempoDesdeUltimoFallo = ((new Date().getTime() - u.getFcIntentoFallido().getTime()) / 1000 / 60);
            return (Ctns.LOGIN_RETRY_TIME - tiempoDesdeUltimoFallo);
        }
        return 0;
    }

    @Transactional
    public void cambiarPassword(String currentPassword, String pwd1, String pwd2, Integer id) throws CustomException {
        Usuario u = usuarios.findById(id).orElse(null);
        if (u != null) {
            BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
            String newPass = enc.encode(pwd1);
            if (!enc.matches(currentPassword, u.getClave())) {
                throw new CustomException("Contraseña actual incorrecta");
            } else if (enc.matches(pwd1, u.getClave())) {
                throw new CustomException("La nueva contraseña no puede ser la actual.");
            } else if (pwd1.equals(pwd2)) {
                u.setClave(newPass);
                u.setFcCambioClave(new Date());
                usuarios.save(u);
            } else {
                throw new CustomException("Las contraseñas no coinciden.");
            }
        } else {
            throw new CustomException("Usuario no existe");
        }
    }

    public Usuario findByCdAdicional(Integer cdAdicional) {
        return usuarios.findById(cdAdicional).orElse(null);
    }

    /**
     * Cuando un usuario intentó inciar sesión pero la cuenta está deshabilitada
     * si es la primera vez, generar contraseña y enviar email
     *
     * @param usuario usuario q intento iniciar sesión
     * @return true sies la cuenta es nueva y se genera la clave x primera vez
     */
    @Transactional
    public boolean accountDisabled(String usuario) {
        try {
            Usuario user = usuarios.findByUsuario(usuario);
            if (user != null && user.getClave() == null && user.isActivo()) {
                user.setIntentosFallidos(0);
                user.setFcIntentoFallido(null);
                String tmpPassword = user.getCedula();
                if (ObjectUtils.isEmpty(tmpPassword)) {
                    tmpPassword = "SeguSuarez#2024";
                }
                user.setClave(new BCryptPasswordEncoder().encode(tmpPassword));
                emailService.sendPasswordEmail(user, user.getNmAsegurado(), user.getApAsegurado(), user.getCedula());
                user.setFcCambioClave(new Date());
                user.setFcModifica(new Date());
                usuarios.save(user);
                return true;
            }
        } catch (Exception e) {
            log.error("sendRegisterEmail", e);
        }
        return false;
    }

    @Transactional
    public void saveUser(Usuario u) {
        usuarios.save(u);
    }

    public Usuario findByUsuario(String usuario) {
        return usuarios.findByUsuario(usuario);
    }

    public BrkTClientes getClienteByCdCliente(Integer cdCliente) {
        return clienteDAO.findByCdCliente(cdCliente);
    }

    public Page<Usuario> searByTable(ObjectNode item) {
        int page = item.get("page").asInt();
        int pageSize = item.get("pageSize").asInt();
        String tipo = item.get("tipo").asText();
        Pageable pageable = PageRequest.of(page, pageSize);
        tipo = tipo.equals("BRK_T_CLIENTES_WEB") ? "GEN" : "VAM";
        return usuarios.findByTipoUsuario(tipo, pageable);
    }

    public List<String> getRoles(String tpPersAdm) {
        return usuarios.getRoles(tpPersAdm);
    }

    public String getFile(String id) {
        if (externalStorageSrv.fileExists(String.format(EXTERNAL_IMG_PATH, id))) {
            return externalStorageSrv.loadPublicUrl(String.format(EXTERNAL_IMG_PATH, id), 100);
        }

        throw new CustomException("Error al obtener foto de cliente:" + id);

    }

    public void downloadUsingStream(String urlStr, String file) throws IOException {
        URL url = new URL(urlStr);
        try (BufferedInputStream bis = new BufferedInputStream(url.openStream())) {
            FileOutputStream fis = new FileOutputStream(file);
            byte[] buffer = new byte[1024];
            int count;
            while ((count = bis.read(buffer, 0, 1024)) != -1) {
                fis.write(buffer, 0, count);
            }
            fis.close();
        } catch (Exception e) {
            throw new CustomException("Error: " + e.getMessage());
        }
    }

    public ResponseEntity<Resource> defaultImage(String img) {
        final HttpHeaders headers = new HttpHeaders();
        headers.set("Content-type", "image/png");
        headers.set("Cache-Control", "public, max-age=2592000");
        ClassLoader classLoader = getClass().getClassLoader();
        URL resource = classLoader.getResource(img);
        return resource != null ? ResponseEntity.ok().headers(headers).body(new UrlResource(resource)) : ResponseEntity.notFound().build();
    }

    public void saveFile(String cdCliente, MultipartFile foto) {
        if (foto != null) {
            externalStorageSrv.delete(String.format(EXTERNAL_IMG_PATH, cdCliente));
            externalStorageSrv.store(String.format(EXTERNAL_IMG_PATH, cdCliente), foto);
        } else {
            throw new CustomException("Sube un archivo permitido que no supere el tamaño máximo");
        }
    }

    public void saveAvatar(String cdAdicional, String avatar) {
        try {
            ClassLoader classLoader = getClass().getClassLoader();
            InputStream resource = classLoader.getResourceAsStream("img/avatars/" + avatar);
            assert resource != null;
            MultipartFile multipartFile = new MockMultipartFile(cdAdicional,
                    cdAdicional, "image/png", IOUtils.toByteArray(resource));
            // externalStorageSrv.delete(String.format(EXTERNAL_IMG_PATH, cdAdicional));
            externalStorageSrv.store(String.format(EXTERNAL_IMG_PATH, cdAdicional), multipartFile);
        } catch (IOException ex) {
            log.error("Error al cargar avatar: " + ex.getMessage(), ex);
            throw new CustomException("Error al cargar avatar");
        }

    }

    public List<String> getAvatars(String url) throws IOException {
        return storageSrv.loadFilesAvatars(url);
    }

    public List<Usuario> getUsuariosByCedula(String cedula) {
        return usuarios.findAllByCedula(cedula);
    }
}
