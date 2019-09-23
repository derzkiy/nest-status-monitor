import { OnGatewayConnection } from '@nestjs/websockets';
import { StatusMonitoringService } from './status.monitoring.service';
export declare class StatusMonitorGateway implements OnGatewayConnection {
    private readonly statusMonitoringService;
    server: any;
    constructor(statusMonitoringService: StatusMonitoringService);
    onEvent(client: any, data: any): {
        event: string;
        spans: any[];
    };
    handleConnection(client: any): void;
    sendMetrics(metrics: any): void;
}
