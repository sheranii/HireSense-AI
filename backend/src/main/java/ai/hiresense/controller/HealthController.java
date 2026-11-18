package ai.hiresense.controller;

import ai.hiresense.dto.SystemHealthDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final DataSource dataSource;

    @Autowired
    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "HireSense AI Backend");

        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            response.put("database", "CONNECTED");
            response.put("databaseProduct", metaData.getDatabaseProductName());
            response.put("databaseVersion", metaData.getDatabaseProductVersion());
        } catch (Exception e) {
            response.put("database", "DOWN");
            response.put("databaseError", e.getMessage());
            return ResponseEntity.status(503).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/system/stats")
    public ResponseEntity<SystemHealthDto> getSystemStats() {
        Map<String, Object> metrics = new HashMap<>();
        long uptime = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;

        String dbStatus = "CONNECTED";
        String dbVersion = "PostgreSQL 16.6";

        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            dbVersion = metaData.getDatabaseProductVersion();
            metrics.put("activeConnections", 1);
            metrics.put("dbCatalog", conn.getCatalog());
        } catch (Exception e) {
            dbStatus = "ERROR: " + e.getMessage();
        }

        metrics.put("heapMemoryUsedMb", (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / (1024 * 1024));
        metrics.put("totalMemoryMb", Runtime.getRuntime().totalMemory() / (1024 * 1024));
        metrics.put("availableProcessors", Runtime.getRuntime().availableProcessors());

        SystemHealthDto stats = new SystemHealthDto(
                "UP",
                dbStatus + " (" + dbVersion + ")",
                "2.0.0-PROD",
                uptime,
                metrics
        );

        return ResponseEntity.ok(stats);
    }
}

