import { HealthCheckService } from './health.check.service';
import { StatusMonitorConfiguration } from './config/status.monitor.configuration';
export declare class StatusMonitorController {
    private readonly healtCheckService;
    data: any;
    render: any;
    constructor(healtCheckService: HealthCheckService, config: StatusMonitorConfiguration);
    static forRoot(rootPath?: string): typeof StatusMonitorController;
    root(): Promise<any>;
}
