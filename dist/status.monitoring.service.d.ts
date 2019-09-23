import { StatusMonitorGateway } from './status.monitor.gateway';
import { StatusMonitorConfiguration } from './config/status.monitor.configuration';
export declare class StatusMonitoringService {
    private readonly statusMonitorWs;
    readonly config: StatusMonitorConfiguration;
    spans: any[];
    constructor(statusMonitorWs: StatusMonitorGateway, config: StatusMonitorConfiguration);
    collectOsMetrics(span: any): void;
    sendOsMetrics(span: any): void;
    getData(): any[];
    collectResponseTime(statusCode: any, startTime: any): void;
}
