import {performance, PerformanceObserver} from "perf_hooks";
import * as average from "average"
import ExpectStatic = Chai.ExpectStatic;

export class FunctionLoadTesterSpecs {
    public async measureAverage(fn: () => Promise<void>, times: number, expect: ExpectStatic): Promise<Chai.Assertion> {
        const durations_ms = [];

        const performanceObserver = new PerformanceObserver((items, observer) => {
            for (const item of items.getEntries()) {
                durations_ms.push(item.duration)
            }
        });

        performanceObserver.observe({entryTypes: ['measure']});

        const promises = [];

        for (var i = 0; i < times; i++)
            promises.push((async () => {
                    performance.mark('micro.start');
                    await fn();
                    performance.mark('micro.end');
                    performance.measure('start to end', 'micro.start', 'micro.end')
                })()
            );

        await Promise.all(promises);

        performanceObserver.disconnect();

        const avg = average(durations_ms);

        return expect(avg);
    }
}
