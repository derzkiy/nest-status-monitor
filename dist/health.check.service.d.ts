import { StatusMonitorConfiguration } from './config/status.monitor.configuration';
import { HealthCheckConfiguration } from './config/health.check.configuration';
export declare class HealthCheckService {
    healthChecks: HealthCheckConfiguration[];
    constructor(config: StatusMonitorConfiguration);
    checkAllEndpoints(): Promise<any[]>;
    private checkEndpoint;
    private allSettled;
}
