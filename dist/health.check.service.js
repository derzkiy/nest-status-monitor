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
const axios_1 = require("axios");
const status_monitor_constants_1 = require("./status.monitor.constants");
let HealthCheckService = class HealthCheckService {
    constructor(config) {
        this.healthChecks = [];
        this.healthChecks = config.healthChecks;
    }
    checkAllEndpoints() {
        const checkPromises = [];
        this.healthChecks.forEach(healthCheck => {
            checkPromises.push(this.checkEndpoint(healthCheck));
        });
        let checkResults = [];
        return this.allSettled(checkPromises).then(results => {
            results.forEach((result, index) => {
                if (result.state === 'rejected') {
                    checkResults.push({
                        path: this.healthChecks[index].path,
                        status: 'failed',
                    });
                }
                else {
                    checkResults.push({
                        path: this.healthChecks[index].path,
                        status: 'ok',
                    });
                }
            });
            return checkResults;
        });
    }
    checkEndpoint(healthCheck) {
        let uri = `${healthCheck.protocol}://${healthCheck.host}`;
        if (healthCheck.port) {
            uri += `:${healthCheck.port}`;
        }
        uri += healthCheck.path;
        //TODO (ivasiljevic) use http service instead of axios
        return axios_1.default({
            url: uri,
            method: 'GET',
        });
    }
    allSettled(promises) {
        let wrappedPromises = promises.map(p => Promise.resolve(p).then(val => ({ state: 'fulfilled', value: val }), err => ({ state: 'rejected', value: err })));
        return Promise.all(wrappedPromises);
    }
};
HealthCheckService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(status_monitor_constants_1.STATUS_MONITOR_OPTIONS_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], HealthCheckService);
exports.HealthCheckService = HealthCheckService;
