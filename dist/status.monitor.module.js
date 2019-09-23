"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StatusMonitorModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const status_monitor_controller_1 = require("./status.monitor.controller");
const status_monitor_gateway_1 = require("./status.monitor.gateway");
const status_monitoring_service_1 = require("./status.monitoring.service");
const status_monitor_middleware_1 = require("./status.monitor.middleware");
const health_check_service_1 = require("./health.check.service");
const status_monitor_constants_1 = require("./status.monitor.constants");
let StatusMonitorModule = StatusMonitorModule_1 = class StatusMonitorModule {
    configure(consumer) {
        consumer
            .apply(status_monitor_middleware_1.StatusMonitorMiddleware)
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
    static setUp(config) {
        return {
            module: StatusMonitorModule_1,
            providers: [
                {
                    provide: status_monitor_constants_1.STATUS_MONITOR_OPTIONS_PROVIDER,
                    useValue: config,
                },
                status_monitor_gateway_1.StatusMonitorGateway,
                status_monitoring_service_1.StatusMonitoringService,
                health_check_service_1.HealthCheckService,
            ],
            controllers: [status_monitor_controller_1.StatusMonitorController.forRoot(config.path)],
        };
    }
};
StatusMonitorModule = StatusMonitorModule_1 = __decorate([
    common_1.Module({
        controllers: [status_monitor_controller_1.StatusMonitorController.forRoot('monitor')],
        providers: [
            status_monitor_gateway_1.StatusMonitorGateway,
            status_monitoring_service_1.StatusMonitoringService,
            health_check_service_1.HealthCheckService,
        ],
    })
], StatusMonitorModule);
exports.StatusMonitorModule = StatusMonitorModule;
