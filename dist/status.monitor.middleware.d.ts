import { NestMiddleware } from '@nestjs/common';
import { StatusMonitoringService } from './status.monitoring.service';
import { StatusMonitorConfiguration } from './config/status.monitor.configuration';
export declare class StatusMonitorMiddleware implements NestMiddleware {
    private readonly statusMonitoringService;
    private readonly config;
    constructor(statusMonitoringService: StatusMonitoringService, config: StatusMonitorConfiguration);
    use(req: any, res: any, next: Function): void;
}
