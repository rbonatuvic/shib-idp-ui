package edu.internet2.tier.shibboleth.admin.ui.service;

import org.springframework.core.io.WritableResource;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

public class FileCheckingFileWritingService implements FileWritingService {
    private static final String DEFAULT_ALGORITHM = "MD5";
    private final String algorithm;

    public FileCheckingFileWritingService() {
        this(DEFAULT_ALGORITHM);
    }

    public FileCheckingFileWritingService(String algorithm) {
        this.algorithm = algorithm;
    }

    @Override
    public void write(Path path, String content) throws IOException {
        if (Files.exists(path)) {
            try (InputStream is = Files.newInputStream(path)) {
                if (checkContentMatches(is, content)) {
                    return;
                }
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException(e);
            }
        }
        writeContent(path, content);
    }

    @Override
    public void write(WritableResource resource, String content) throws IOException {
        if (resource.exists()) {
            try (InputStream is = resource.getInputStream()) {
                if (checkContentMatches(is, content)) {
                    return;
                }
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException(e);
            }
        }
        writeContent(resource, content);
    }

    private boolean checkContentMatches(InputStream inputStream, String content) throws NoSuchAlgorithmException, IOException {
        MessageDigest md = MessageDigest.getInstance(this.algorithm);
        try (DigestInputStream dis = new DigestInputStream(inputStream, md)) {
            byte[] buf = new byte[4096];
            while (dis.read(buf) > -1) {}
        }
        byte[] fileDigest = md.digest();
        byte[] contentDigest = md.digest(content.getBytes());
        return Arrays.equals(fileDigest, contentDigest);
    }

    void writeContent(Path path, String content) throws IOException {
        Files.write(path, content.getBytes());
    }

    void writeContent(WritableResource resource, String content) throws IOException {
        try (OutputStream os = resource.getOutputStream()) {
            os.write(content.getBytes());
        }
    }
}
