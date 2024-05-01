package com.tefisoft.efiweb.srv;

import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@CommonsLog
public class DocsDigitalesSrv {

    private final StorageSrv storageSrv;

    public DocsDigitalesSrv(@Value("${app.data}") String path) {
        this.storageSrv = new LocalStorageSrv(".mp4,.jpg,.jpeg,.png,.pdf", path + "/docs");
    }

    public Resource loadFile(String id) {
        return storageSrv.load(id);
    }

    public Map<String, Object> loadFiles(String uri, String tipo, String id, String subCarpeta, String filterName) {
        return storageSrv.loadFiles(uri, tipo, id, subCarpeta, filterName);
    }

    public void delete(String uri) {
        storageSrv.delete(uri);
    }
}
