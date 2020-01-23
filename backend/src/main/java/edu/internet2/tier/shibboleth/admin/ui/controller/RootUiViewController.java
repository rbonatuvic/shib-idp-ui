package edu.internet2.tier.shibboleth.admin.ui.controller;

import com.google.common.io.ByteStreams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.OutputStream;

@Controller
public class RootUiViewController {

    @Value("classpath:/resources/index.html")
    Resource resourceFile;

    @RequestMapping("/")
    @ResponseBody
    public void index(HttpServletRequest request, OutputStream os) throws IOException {
        final String ctxPath = request.getContextPath();
        try {
            byte[] indexHtmlBytes = ByteStreams.toByteArray(resourceFile.getInputStream());
            os.write(indexHtmlBytes, 0, indexHtmlBytes.length);
            //os.write(ctxPath.getBytes(), 0, ctxPath.length());
        }
        finally {
            os.close();
        }
    }
}
