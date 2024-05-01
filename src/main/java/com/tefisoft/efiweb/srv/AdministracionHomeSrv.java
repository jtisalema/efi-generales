package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@CommonsLog
public class AdministracionHomeSrv {
    private static final String FILE_NAME = "/opt/public/images/efi/config_home.json";
    private final ObjectMapper mapper = new ObjectMapper();
    private ObjectNode data;

    @PostConstruct
    public void init() {
        mapper.findAndRegisterModules();
        data = mapper.createObjectNode();
        createFile();
    }

    public ObjectNode createFile() {
        try {
            File file = new File(FILE_NAME);
            if (!file.exists()) {
                if (file.createNewFile()) {//crea con datos por default
                    ObjectNode obj = mapper.createObjectNode();
                    obj.put("tipo", "IMAGEN");
                    obj.put("url", "");
                    obj.put("urlTemplate", "");
                    obj.putArray("templates");
                    return doSave(obj);
                }
            } else {
                data = (ObjectNode) mapper.readTree(file);
            }
        } catch (IOException e) {
            log.error("Error al crear archivo de configuracin home");
            return null;
        }
        return null;
    }

    public ObjectNode doSave(ObjectNode item) {
        try {
            File file = new File(FILE_NAME);
            mapper.writeValue(file, item);
            return (ObjectNode) mapper.readTree(file);
        } catch (IOException e) {
            log.error("No se pudo obtener configuracion de home");
            return null;
        }
    }

    public ObjectNode find() {
        File file = new File(FILE_NAME);
        try {
            if (!file.exists()) {
                return createFile();
            } else {
                return (ObjectNode) mapper.readTree(file);
            }
        } catch (IOException e) {
            log.error("No se pudo obtener configuracion de home");
            return null;
        }
    }
}
