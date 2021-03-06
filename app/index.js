// See test-funcs.js for usage.

import { goals } from 'user-activity'
import { baseline, test } from './test-funcs'

let trials = 3, trialNbr = 1
let count = 10
let baselineDuration, testDuration, durationSum, durationDiff

if (goals.calories === 360) {   // unforgivably kludgy way to detect simulator
  console.warn('This test is being run on the Fitbit simulator.')
  console.warn('Results could be very different to those obtained on a watch.')
}

function evaluate(func, count) {
  // Returns duration (msec) required for count iterations
  const timeStart = Date.now()
  const timeElapsed
  for (let i=0; i<count; i++)
    func(i)
  timeElapsed = Date.now() - timeStart
  //console.log(`t=${timeElapsed/count} msec`)
  return timeElapsed
}

function trial() {
  // The first trial doesn't occur straight away. This allows the system to 'settle'. If this isn't done, the first trial's results will not be accurate.
  // A timeout is used between trials to allow the watch's message queue to be processed and emptied. Otherwise, this app may be killed for being non-responsive.
  setTimeout(() => {
    baselineDuration = evaluate(baseline, count)
    testDuration = evaluate(test, count)
    durationDiff = testDuration - baselineDuration
    console.log(`Trial ${trialNbr}: on average, test() is slower than baseline() by ${(durationDiff/count).toPrecision(2)} msec (${Math.round(durationDiff/baselineDuration*100)}%)`)

    if (++trialNbr <= trials) trial(); else console.log('Done.')
  }, 2000)
}

// We want count to be as large as possible, so our results are statistically significant.
// Determine count by doubling it until the duration required for one trial (ie, both test() and baseline()) exceeds 1 sec.
// Why 1 sec? In the worst case, the first value of count that results in a duration > 1 sec could actually result in a duration of almost 2 sec.
// Because we've been doubling the duration each iteration, we have a geometric series of durations. The sum of such a series is double the final value;
// ie, up to almost 4 sec. Fitbit OS requires apps to not hog the CPU for more than 5 seconds, so we're safe. Just.
console.log('Determining iteration count; wait...')
do {
  baselineDuration = evaluate(baseline, count)
  testDuration = evaluate(test, count)
  durationSum = baselineDuration + testDuration
  //console.log(`count=${count} maxD=${maxDuration}`)
  count <<= 1
} while (durationSum < 1000)

//count <<= 1   // It SHOULD be safe to double count because future trials will only involve one evaluate() of each function, rather than a geometric series. But sometimes it isn't.

console.log(`Testing: ${trials} trials of ${count} iterations each; wait...`)

trial()
