package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.exc.StorageException;
import lombok.Builder;
import lombok.Data;
import lombok.extern.java.Log;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.cache2k.Cache;
import org.cache2k.Cache2kBuilder;
import org.jetbrains.annotations.Nullable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Log
public class LocalStorageSrv implements StorageSrv {

    private final String extensions;
    private final Path rootLocation;
    private static final String MSM = "Could not read file";
    private static final String NOT_EXIST_FILE = "No se encontró el archivo";
    private final Cache<String, FileDoc> cache = new Cache2kBuilder<String, FileDoc>() {
    }.expireAfterWrite(3, TimeUnit.HOURS).build();

    /**
     * Constructor personalizado
     *
     * @param extensions   las extensiones de los archivos permitidos separados por
     *                     coma
     * @param rootLocation path absoluto del directorio principal
     */
    public LocalStorageSrv(String extensions, String rootLocation) {
        this.extensions = extensions;
        this.rootLocation = Paths.get(rootLocation);
        this.initialize();
    }

    private void initialize() {
        try {
            Files.createDirectories(rootLocation);
        } catch (Exception e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }

    public void createDirectory(String path) {
        try {
            Files.createDirectories(rootLocation.resolve(path));
        } catch (Exception e) {
            throw new StorageException("Directory could not be created", e);
        }
    }

    public boolean exists(String uri) {
        return Files.exists(this.loadAsPath(uri));
    }

    public void store(String fileName, MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new CustomException("Failed to store empty file " + file.getOriginalFilename());
            }

            String extension = FilenameUtils.getExtension(file.getOriginalFilename());
            if (!isValidExtension(extension)) {
                throw new CustomException("Archivo no permitido " + file.getOriginalFilename());
            }
            Files.copy(file.getInputStream(), this.rootLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new CustomException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    @Override
    public void storeAvatar(String cdCliente, Resource resource) {
        try {
            if (!resource.exists()) {
                throw new CustomException("Failed to store empty file " + resource.getFilename());
            }
            String extension = FilenameUtils.getExtension(resource.getFilename());
            if (!isValidExtension(extension)) {
                throw new CustomException("Archivo no permitido " + resource.getFilename());
            }
            Files.copy(Paths.get(resource.getURI()), this.rootLocation.resolve(cdCliente),
                    StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new CustomException("Failed to store file " + resource.getFilename(), e);
        }
    }

    public Path loadAsPath(String uri) {
        return rootLocation.resolve(uri);
    }

    /**
     * Recupera el archivo
     *
     * @param id identificador del archivo
     * @return el recursso si existe archivo si existe
     */
    public Resource load(String id) {
        var item = cache.get(id);
        if (ObjectUtils.isEmpty(item)) {
            throw new StorageException(NOT_EXIST_FILE);
        }
        try {
            Path file = item.getPath();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageException(MSM + ", file not available");
            }
        } catch (Exception e) {
            throw new StorageException(MSM + ", malformed uri: " + id, e);
        }
    }

    public Map<String, Object> loadFiles(String uri, String tipo, String id, String subCarpeta, String filterName) {
        Map<String, Object> result = new HashMap<>();
        List<FileDoc> docs = new ArrayList<>();
        try {
            if (!ObjectUtils.isEmpty(subCarpeta)) {
                id = id + "/" + subCarpeta;
            }
            Path path = loadAsPath(
                    tipo.equalsIgnoreCase("siniestro") ? uri + "/SINIESTROS/" + id : uri + "/PRODUCCION/" + id);
            try (Stream<Path> stream = Files.walk(Paths.get(rootLocation.toString() + path))) {
                docs = stream.filter(Files::isRegularFile).map(url -> startFile(url.getFileName().toString(), url))
                        .collect(Collectors.toList());
            }

            if (!ObjectUtils.isEmpty(filterName)) {
                log.info("filtering docs: " + filterName);
                docs = docs.stream().filter(a -> a.getNm().toLowerCase().contains(filterName.toLowerCase()))
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.info("No existe el directorio: " + uri + " Error:" + e.getMessage());
        }
        result.put("docs", docs);
        return result;
    }

    @Override
    public List<String> loadFilesAvatars(String uri) throws IOException {
        InputStream resource = new ClassPathResource("img/names.txt").getInputStream();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource))) {
            String names = reader.lines()
                    .collect(Collectors.joining("\n"));
            return Arrays.asList(names.split("\n"));
        }
    }

    FileDoc startFile(String nm, Path path) {
        // Crear sha256
        int index = nm.lastIndexOf('.');
        var sha256 = org.apache.commons.codec.digest.DigestUtils.sha256Hex(path.toString());
        var extension = (index > 0) ? nm.substring(index + 1) : "";

        var file = FileDoc.builder()
                .id(sha256)
                .nm(nm)
                .fc(ZonedDateTime.now())
                .path(path)
                .ext(extension)
                .build();
        cache.put(sha256, file);
        return file;
    }

    public void delete(String filename) {
        try {
            Files.delete(loadAsPath(filename));
        } catch (IOException e) {
            throw new StorageException("Could not delete file: " + filename, e);
        }
    }

    public void deleteDirectory(String filename) {
        try {
            FileUtils.deleteDirectory(new File(String.valueOf(loadAsPath(filename))));
        } catch (IOException e) {
            throw new StorageException("Could not delete directory: " + filename, e);
        }
    }

    public Map<String, Long> fileSize(String filename) {
        Map<String, Long> res = new HashMap<>();
        long tam = 0;
        long num = 0;
        try {
            Path file = loadAsPath(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                tam = resource.contentLength();
                num = num + 1;
            }
        } catch (IOException e) {
            log.info("Error fileSize: " + e.getMessage());
        }
        res.put("tam", tam);
        res.put("num", num);
        return res;
    }

    public Map<String, Long> folderSize(String name) {
        Map<String, Long> res = new HashMap<>();
        long tam = 0;
        long num = 0;
        try {
            Path file = loadAsPath(name);
            File resource = new File(String.valueOf(file));
            if (resource.exists() || resource.isDirectory()) {
                tam = FileUtils.sizeOfDirectory(resource);
                try (var walk = Files.walk(file)) {
                    num = walk.filter(f -> f.toFile().isFile()).count();
                }
            }
        } catch (Exception e) {
            log.info("Error folderSize: " + e.getMessage());
        }
        res.put("tam", tam);
        res.put("num", num);
        return res;
    }

    public void deleteAll() {
        try {
            FileSystemUtils.deleteRecursively(rootLocation.toFile());
        } catch (Exception e) {
            throw new StorageException("Could not delete files", e);
        }
    }

    private boolean isValidExtension(String extension) {
        if (extension == null || extension.isEmpty())
            return true;

        List<String> validExtensions = Arrays.stream(extensions.split(","))
                .map(item -> item.replace(".", "").toLowerCase().trim())
                .collect(Collectors.toList());
        return validExtensions.contains(extension);
    }

    /**
     * Recupera el archivo
     *
     * @param filename nombre del archivo
     * @return el archivo si existe
     */
    public Resource loadAsResourceByName(String filename) throws CustomException {
        try {
            String dir = FilenameUtils.getFullPath(filename);
            String nombre = FilenameUtils.getName(filename);
            File directorio = new File(rootLocation.resolve(dir).toUri());

            return getResource(filename, dir, nombre, directorio);
        } catch (MalformedURLException | CustomException e) {
            throw new CustomException(MSM + ": " + filename, e);
        }
    }

    @Nullable
    private Resource getResource(String filename, String dir, String nombre, File directorio)
            throws MalformedURLException {
        FilenameFilter filter = (dir1, name) -> name.startsWith(nombre);

        List<String> list = Arrays.asList(Objects.requireNonNull(directorio.list(filter)));
        if (!list.isEmpty()) {
            Path file = loadAsPath(dir + list.get(0));
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new CustomException(MSM + ": " + filename);
            }
        } else {
            log.info("No se obtuvo ninguna foto del cliente: " + nombre);
            return null;
        }
    }

    public Resource loadAsResourceByPath(String path, String name) throws CustomException {
        try {
            String dir = FilenameUtils.getFullPath(path);
            String nombre = FilenameUtils.getName(name);
            File directorio = new File(dir);

            return getResource(name, dir, nombre, directorio);
        } catch (MalformedURLException | CustomException e) {
            throw new CustomException(MSM + ": " + name, e);
        }
    }

    public void deleteByName(String filename) throws CustomException {
        String dir = FilenameUtils.getFullPath(filename);
        String nombre = FilenameUtils.getName(filename);
        File directorio = new File(rootLocation.resolve(dir).toUri());

        FilenameFilter filter = (dir1, name) -> name.startsWith(nombre);
        List<String> list = Arrays.asList(Objects.requireNonNull(directorio.list(filter)));
        if (!list.isEmpty()) {
            list.forEach(s -> {
                try {
                    Files.delete(loadAsPath(dir + s));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        }
    }

    public Resource loadAsResourceByPath(Path file) throws MalformedURLException {
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return resource;
        }
        throw new CustomException(NOT_EXIST_FILE + ": " + file.getFileName());
    }

    public double getMbFileSize(List<FileDoc> fileDocs) {
        try {
            long totalFileSize = 0;
            for (FileDoc fileDocItem : fileDocs) {
                totalFileSize += Files.size(fileDocItem.getPath());
            }
            return totalFileSize / (1024.0 * 1024.0);
        } catch (IOException e) {
            throw new CustomException("Error al obtener el tamaño de los archivos");
        }
    }

    @Data
    @Builder
    public static class FileDoc {
        private String id;
        private String nm;
        private ZonedDateTime fc;
        private Path path;
        private String ext;
    }

    @Data
    @Builder
    public static class Avatar {
        private String nm;
        private Resource data;
    }

}
