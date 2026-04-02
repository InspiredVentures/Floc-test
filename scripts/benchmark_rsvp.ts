
import { performance } from 'perf_hooks';

// Simulate a large number of RSVPs
const TOTAL_RSVPS = 5000;
const CURRENT_USER_ID = 'user-123';

// Mock Data
const rsvps = Array.from({ length: TOTAL_RSVPS }, (_, i) => ({
    user_id: `user-${i}`,
    status: 'going'
}));

// Case 1: Current Implementation (Fetching all RSVPs)
function benchmarkCurrent(rsvps: any[], currentUserId: string) {
    const start = performance.now();

    // Simulating the data transfer overhead (JSON stringify/parse is a rough proxy for serialization/deserialization and memory usage)
    const payload = JSON.stringify(rsvps);
    const parsed = JSON.parse(payload);

    const count = parsed.length;
    const isAttending = parsed.some((r: any) => r.user_id === currentUserId);

    const end = performance.now();
    return { time: end - start, size: payload.length, count, isAttending };
}

// Case 2: Optimized Implementation (Fetching Count + My RSVP)
function benchmarkOptimized(totalCount: number, myRsvp: any[], currentUserId: string) {
    const start = performance.now();

    // Payload contains just the count and potentially one RSVP record
    const payload = JSON.stringify({ count: [{ count: totalCount }], my_rsvp: myRsvp });
    const parsed = JSON.parse(payload);

    const count = parsed.count[0].count;
    const isAttending = parsed.my_rsvp.length > 0;

    const end = performance.now();
    return { time: end - start, size: payload.length, count, isAttending };
}

console.log(`--- Benchmarking RSVP Processing (N=${TOTAL_RSVPS}) ---`);

// Run Current
const currentResult = benchmarkCurrent(rsvps, CURRENT_USER_ID);
console.log(`[Current] Time: ${currentResult.time.toFixed(4)}ms, Payload Size: ${currentResult.size} bytes`);

// Run Optimized
// Simulate filtering finding the user
const myRsvp = rsvps.filter(r => r.user_id === CURRENT_USER_ID);
const optimizedResult = benchmarkOptimized(TOTAL_RSVPS, myRsvp, CURRENT_USER_ID);
console.log(`[Optimized] Time: ${optimizedResult.time.toFixed(4)}ms, Payload Size: ${optimizedResult.size} bytes`);

const sizeReduction = ((currentResult.size - optimizedResult.size) / currentResult.size) * 100;
console.log(`Payload Reduction: ${sizeReduction.toFixed(2)}%`);

const timeImprovement = currentResult.time / optimizedResult.time;
console.log(`Speed Improvement factor: ${timeImprovement.toFixed(2)}x`);
