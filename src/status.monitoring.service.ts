import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as pidusage from 'pidusage';
import * as os from 'os';
import { StatusMonitorGateway } from './status.monitor.gateway';

@Injectable()
export class StatusMonitoringService {
  spans = [
    {
      interval: 1,
      retention: 60,
      os: [],
      responses: [],
    },
    {
      interval: 5,
      retention: 60,
      os: [],
      responses: [],
    },
    {
      interval: 15,
      retention: 60,
      os: [],
      responses: [],
    },
  ];

  constructor(
    @Inject(forwardRef(() => StatusMonitorGateway))
    private readonly statusMonitorWs: StatusMonitorGateway,
  ) {
    this.spans.forEach(currentSpan => {
      const span = currentSpan;
      span.os = [];
      span.responses = [];

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
      if (
        !span.responses[0] ||
        last.timestamp + span.interval * 1000 < Date.now()
      ) {
        span.responses.push(defaultResponse);
      }

      // todo: I think this check should be moved somewhere else
      if (span.os.length >= span.retention) span.os.shift();
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
}