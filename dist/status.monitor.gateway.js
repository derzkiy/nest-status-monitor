"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const websockets_1 = require("@nestjs/websockets");
const status_monitoring_service_1 = require("./status.monitoring.service");
const common_1 = require("@nestjs/common");
const port = process.env.STATUS_MONITOR_WS_PORT ? parseInt(process.env.STATUS_MONITOR_WS_PORT) : 0;
const namespace = process.env.STATUS_MONITOR_WS_NAMESPACE || null;
let StatusMonitorGateway = class StatusMonitorGateway {
    constructor(statusMonitoringService) {
        this.statusMonitoringService = statusMonitoringService;
    }
    onEvent(client, data) {
        const event = 'esm_start';
        const spans = this.statusMonitoringService.getData();
        return { event, spans };
    }
    handleConnection(client) {
        const spans = this.statusMonitoringService.getData();
        client.emit('esm_start', spans);
    }
    sendMetrics(metrics) {
        if (this.server) {
            const data = {
                os: metrics.os[metrics.os.length - 2],
                responses: metrics.responses[metrics.responses.length - 2],
                interval: metrics.interval,
                retention: metrics.retention,
            };
            this.server.emit('esm_stats', data);
        }
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], StatusMonitorGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('esm_change'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StatusMonitorGateway.prototype, "onEvent", null);
StatusMonitorGateway = __decorate([
    websockets_1.WebSocketGateway(port, { namespace }),
    __param(0, common_1.Inject(common_1.forwardRef(() => status_monitoring_service_1.StatusMonitoringService))),
    __metadata("design:paramtypes", [status_monitoring_service_1.StatusMonitoringService])
], StatusMonitorGateway);
exports.StatusMonitorGateway = StatusMonitorGateway;
