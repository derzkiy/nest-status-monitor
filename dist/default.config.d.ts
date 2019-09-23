declare const configuration: {
    title: string;
    theme: string;
    path: string;
    spans: {
        interval: number;
        retention: number;
    }[];
    port: any;
    websocket: any;
    iframe: boolean;
    chartVisibility: {
        cpu: boolean;
        mem: boolean;
        load: boolean;
        responseTime: boolean;
        rps: boolean;
        statusCodes: boolean;
    };
    ignoreStartsWith: string;
    healthChecks: any[];
};
export default configuration;
