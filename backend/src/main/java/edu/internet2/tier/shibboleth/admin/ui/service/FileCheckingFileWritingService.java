package edu.internet2.tier.shibboleth.admin.ui.service;

import java.io.IOException;
import java.io.InputStream;
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
            try {
                MessageDigest md = MessageDigest.getInstance(this.algorithm);
                try (
                        InputStream is = Files.newInputStream(path);
                        DigestInputStream dis = new DigestInputStream(is, md)
                ) {
                    byte[] buf = new byte[4096];
                    while (dis.read(buf) > -1){}
                }
                byte[] fileDigest = md.digest();
                byte[] contentDigest = md.digest(content.getBytes());
                if (Arrays.equals(fileDigest, contentDigest)) {
                    return;
                }
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException(e);
            }
        }
        writeContent(path, content.getBytes());
    }

    void writeContent(Path path, byte[] bytes) throws IOException {
        Files.write(path, bytes);
    }
}
