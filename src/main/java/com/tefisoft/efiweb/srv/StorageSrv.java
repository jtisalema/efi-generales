package com.tefisoft.efiweb.srv;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface StorageSrv {
    void store(String fileName, MultipartFile file);
    void storeAvatar(String cdCliente, Resource resource);

    Resource load(String id);

    Resource loadAsResourceByName(String id);
    Resource loadAsResourceByPath(String path, String name);

    void deleteByName(String id);

    Map<String, Object> loadFiles(String uri, String tipo, String id, String subCarpeta, String filterName);
    List<String> loadFilesAvatars(String uri) throws IOException;

    void delete(String uri);
}
