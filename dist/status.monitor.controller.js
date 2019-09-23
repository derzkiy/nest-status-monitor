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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var StatusMonitorController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const handlebars_1 = require("handlebars");
const health_check_service_1 = require("./health.check.service");
const constants_1 = require("@nestjs/common/constants");
const status_monitor_constants_1 = require("./status.monitor.constants");
let StatusMonitorController = StatusMonitorController_1 = class StatusMonitorController {
    constructor(healtCheckService, config) {
        this.healtCheckService = healtCheckService;
        const bodyClasses = Object.keys(config.chartVisibility)
            .reduce((accumulator, key) => {
            if (config.chartVisibility[key] === false) {
                accumulator.push(`hide-${key}`);
            }
            return accumulator;
        }, [])
            .join(' ');
        this.data = {
            title: config.pageTitle,
            port: config.port,
            namespace: process.env.STATUS_MONITOR_WS_NAMESPACE || '',
            bodyClasses: bodyClasses,
            script: fs.readFileSync(path.join(__dirname, '../src/public/javascripts/app.js')),
            style: fs.readFileSync(path.join(__dirname, '../src/public/stylesheets/style.css')),
        };
        const htmlTmpl = fs
            .readFileSync(path.join(__dirname, '../src/public/index.html'))
            .toString();
        this.render = handlebars_1.default.compile(htmlTmpl, { strict: true });
    }
    static forRoot(rootPath = 'monitor') {
        Reflect.defineMetadata(constants_1.PATH_METADATA, rootPath, StatusMonitorController_1);
        return StatusMonitorController_1;
    }
    root() {
        return __awaiter(this, void 0, void 0, function* () {
            const healtData = yield this.healtCheckService.checkAllEndpoints();
            this.data.healthCheckResults = healtData;
            return this.render(this.data);
        });
    }
};
__decorate([
    common_1.Get(),
    common_1.HttpCode(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatusMonitorController.prototype, "root", null);
StatusMonitorController = StatusMonitorController_1 = __decorate([
    common_1.Controller(),
    __param(1, common_1.Inject(status_monitor_constants_1.STATUS_MONITOR_OPTIONS_PROVIDER)),
    __metadata("design:paramtypes", [health_check_service_1.HealthCheckService, Object])
], StatusMonitorController);
exports.StatusMonitorController = StatusMonitorController;
