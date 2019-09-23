import { MiddlewareConsumer, DynamicModule } from '@nestjs/common';
import { StatusMonitorConfiguration } from './config/status.monitor.configuration';
export declare class StatusMonitorModule {
    configure(consumer: MiddlewareConsumer): void;
    static setUp(config: StatusMonitorConfiguration): DynamicModule;
}
