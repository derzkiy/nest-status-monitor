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
const common_1 = require("@nestjs/common");
const pidusage = require("pidusage");
const os = require("os");
const status_monitor_gateway_1 = require("./status.monitor.gateway");
const status_monitor_constants_1 = require("./status.monitor.constants");
let StatusMonitoringService = class StatusMonitoringService {
    constructor(statusMonitorWs, config) {
        this.statusMonitorWs = statusMonitorWs;
        this.config = config;
        this.spans = [];
        config.spans.forEach(currentSpan => {
            const span = {
                os: [],
                responses: [],
                interval: currentSpan.interval,
                retention: currentSpan.retention,
            };
            this.spans.push(span);
            const interval = setInterval(() => {
                this.collectOsMetrics(span);
                this.sendOsMetrics(span);
            }, span.interval * 1000);
            interval.unref(); // don't keep node.js process up
        });
    }
    collectOsMetrics(span) {
        const defaultResponse = {
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            count: 0,
            mean: 0,
            timestamp: Date.now(),
        };
        pidusage.stat(process.pid, (err, stat) => {
            if (err) {
                return;
            }
            const last = span.responses[span.responses.length - 1];
            // Convert from B to MB
            stat.memory = stat.memory / 1024 / 1024;
            stat.load = os.loadavg();
            stat.timestamp = Date.now();
            span.os.push(stat);
            if (!span.responses[0] ||
                last.timestamp + span.interval * 1000 < Date.now()) {
                span.responses.push(defaultResponse);
            }
            // todo: I think this check should be moved somewhere else
            if (span.os.length >= span.retention)
                span.os.shift();
            if (span.responses[0] && span.responses.length > span.retention)
                span.responses.shift();
        });
    }
    sendOsMetrics(span) {
        this.statusMonitorWs.sendMetrics(span);
    }
    getData() {
        return this.spans;
    }
    collectResponseTime(statusCode, startTime) {
        const diff = process.hrtime(startTime);
        const responseTime = (diff[0] * 1e3 + diff[1]) * 1e-6;
        const category = Math.floor(statusCode / 100);
        this.spans.forEach(span => {
            const last = span.responses[span.responses.length - 1];
            if (last !== undefined &&
                last.timestamp / 1000 + span.interval > Date.now() / 1000) {
                last[category] += 1;
                last.count += 1;
                last.mean += (responseTime - last.mean) / last.count;
            }
            else {
                span.responses.push({
                    2: category === 2 ? 1 : 0,
                    3: category === 3 ? 1 : 0,
                    4: category === 4 ? 1 : 0,
                    5: category === 5 ? 1 : 0,
                    count: 1,
                    mean: responseTime,
                    timestamp: Date.now(),
                });
            }
        });
    }
};
StatusMonitoringService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => status_monitor_gateway_1.StatusMonitorGateway))),
    __param(1, common_1.Inject(status_monitor_constants_1.STATUS_MONITOR_OPTIONS_PROVIDER)),
    __metadata("design:paramtypes", [status_monitor_gateway_1.StatusMonitorGateway, Object])
], StatusMonitoringService);
exports.StatusMonitoringService = StatusMonitoringService;
