package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.entidad.Usuario;
import com.tefisoft.efiweb.srv.UsuarioSrv;
import com.tefisoft.efiweb.exc.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author dacopanCM on 21/09/17.
 */
@RestController
@Slf4j
public class CltEmail {

    private final UsuarioSrv usuarios;

    public CltEmail(UsuarioSrv usuarios) {
        this.usuarios = usuarios;
    }


    @PostMapping(value = "/api/atenea")
    @ResponseBody
    @SuppressWarnings("unused")
    public String enviarEmailRegistro(@RequestParam("cdAdicional") Integer cdAdicional, @RequestParam("hash") String hash) {
        log.info("Registro user {} ", cdAdicional);
        try {
            if (cdAdicional == null || hash == null) return "0,Hash no coincide";
            Usuario user = usuarios.findByCdAdicional(cdAdicional);
            if (user != null) {

                Usuario old = usuarios.findByUsuario(user.getEmail());
                if (old != null && old.getClave() != null) {
                    throw new CustomException("Email ya registrado");
                }
                user.setUsuario(user.getEmail());
                usuarios.saveUser(user);
                return usuarios.accountDisabled(user.getUsuario()) ? "1,Exitoso" : "0,No se envio email";
            }
            return "0,Desconocido";
        } catch (Exception ex) {
            log.info("Registro user error " + cdAdicional, ex);
            return "0," + ex.getMessage();
        }
    }

}
