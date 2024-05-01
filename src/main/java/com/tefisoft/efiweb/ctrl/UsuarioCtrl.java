package com.tefisoft.efiweb.ctrl;


import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.entidad.BrkTClientes;
import com.tefisoft.efiweb.entidad.Usuario;
import com.tefisoft.efiweb.srv.UsuarioSrv;
import com.tefisoft.efiweb.exc.CustomException;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@RestController
@CommonsLog
public class UsuarioCtrl {

    private final UsuarioSrv usuarioSrv;
    private static final String IMG_DEFAULT = "img/default-avatar.png";

    public UsuarioCtrl(UsuarioSrv usuarioSrv) {
        this.usuarioSrv = usuarioSrv;
    }

    @GetMapping(value = "/api/usuario", params = "username")
    public Usuario findOne(@RequestParam String username) {
        return usuarioSrv.findByUsuario(new String(Base64.getDecoder().decode(username.getBytes(StandardCharsets.UTF_8))));
    }

    @GetMapping(value = "/api/usuario", params = "cedula")
    public List<Usuario> findUsuarios(@RequestParam String cedula) {
        return usuarioSrv.getUsuariosByCedula(cedula);
    }

    @GetMapping(value = "/api/cliente", params = "cdCliente")
    public BrkTClientes findCliente(@RequestParam Integer cdCliente) {
        return usuarioSrv.getClienteByCdCliente(cdCliente);
    }

    @PostMapping("/api/usuario/cambiar")
    public void cambiarPassword(@RequestBody ObjectNode item) {
        String currentPassword = item.get("current").asText();
        String pwd1 = item.get("passwd1").asText();
        String pwd2 = item.get("passwd2").asText();
        Integer id = item.get("id").asInt();
        usuarioSrv.cambiarPassword(currentPassword, pwd1, pwd2, id);
    }

    @PostMapping(value = "/api/users")
    public Page<?> findByTabla(@RequestBody ObjectNode item) {
        return usuarioSrv.searByTable(item);
    }


    @GetMapping("/api/user/img/{id}")
    public ResponseEntity<Resource> getFile(@PathVariable String id, HttpServletResponse response) {
        try {
            if (!id.equalsIgnoreCase("undefined") && !id.equalsIgnoreCase("null")) {
                response.sendRedirect(usuarioSrv.getFile(id));
                return null;
            } else {
                return usuarioSrv.defaultImage(IMG_DEFAULT);
            }
        } catch (Exception ex) {
            return usuarioSrv.defaultImage(IMG_DEFAULT);
        }
    }

    @GetMapping("/api/user/avatar/{nm}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String nm) {
        try {
            return usuarioSrv.defaultImage("img/avatars/" + nm);
        } catch (Exception ex) {
            return usuarioSrv.defaultImage(IMG_DEFAULT);
        }
    }

    @GetMapping("/api/user/avatars")
    public List<String> getAvatars() {
        try {
            return usuarioSrv.getAvatars("img/avatars/");
        } catch (Exception ex) {
            return Collections.emptyList();
        }
    }

    @PostMapping("/api/user/{cdAdicional}")
    public void save(@PathVariable String cdAdicional, @RequestPart(name = "foto", required = false) MultipartFile foto) throws CustomException {
        usuarioSrv.saveFile(cdAdicional, foto);
    }

    @PostMapping("/api/user/avatar-save")
    public void save(@RequestParam Integer cdAdicional, @RequestParam String avatar) throws CustomException {
        usuarioSrv.saveAvatar(cdAdicional.toString(), avatar);
    }
}
