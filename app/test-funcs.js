// Usage: put code to be tested in the baseline() and test() functions in this file.
// fitbit-speed-test will compare the time taken to run each function.

// An argument is passed just in case a function needs to use it to avoid being optimised out of existence.
// A value shoud be returned for the same reason.

export const baseline = i => {
  // This should be the same as test() but without the code for which execution time is to be assessed.
  return i+1
}

export const test = i => {
  // This should be the same as baseline() but including the code for which execution time is to be assessed.
  return Math.log(i+1)
}