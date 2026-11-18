package ai.hiresense.dto;

import java.util.Map;

public class SystemHealthDto {
    private String status;
    private String database;
    private String version;
    private long uptimeSeconds;
    private Map<String, Object> metrics;

    public SystemHealthDto() {}

    public SystemHealthDto(String status, String database, String version, long uptimeSeconds, Map<String, Object> metrics) {
        this.status = status;
        this.database = database;
        this.version = version;
        this.uptimeSeconds = uptimeSeconds;
        this.metrics = metrics;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDatabase() { return database; }
    public void setDatabase(String database) { this.database = database; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public long getUptimeSeconds() { return uptimeSeconds; }
    public void setUptimeSeconds(long uptimeSeconds) { this.uptimeSeconds = uptimeSeconds; }

    public Map<String, Object> getMetrics() { return metrics; }
    public void setMetrics(Map<String, Object> metrics) { this.metrics = metrics; }
}

