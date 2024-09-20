class WeightedList {
  constructor(items, options = {}) {
    this.items = items;
    this.weights = options.weights || Array(items.length).fill(1);
    this.totalWeight = this.weights.reduce((sum, weight) => sum + weight, 0);
    this.samplingMethod = options.samplingMethod || 'uniform';
    this.paretoAdjustment = options.paretoAdjustment || 1;
    this.normalMean = options.normalMean !== undefined ? options.normalMean : Math.floor(items.length / 2);
    this.normalStdDev = options.normalStdDev !== undefined ? options.normalStdDev : items.length / 6;
  }

  setSamplingMethod(method) {
    this.samplingMethod = method;
  }

  setParetoAdjustment(adjustment) {
    this.paretoAdjustment = adjustment;
  }

  setNormalParameters(mean = null, stdDev = null) {
    if (mean !== null) this.normalMean = mean;
    if (stdDev !== null) this.normalStdDev = stdDev;
  }

  sample() {
    switch (this.samplingMethod) {
      case 'manual':
        return this.sampleManual();
      case 'uniform':
        return this.sampleUniform();
      case 'pareto':
        return this.samplePareto();
      case 'normal':
        return this.sampleNormal();
      default:
        throw new Error(`Invalid sampling method: ${this.samplingMethod}`);
    }
  }

  sampleManual() {
    const randomValue = Math.random() * this.totalWeight;
    let currentWeight = 0;
    for (let i = 0; i < this.items.length; i++) {
      currentWeight += this.weights[i];
      if (randomValue <= currentWeight) {
        return this.items[i];
      }
    }
    return this.items[this.items.length - 1];
  }

  sampleUniform() {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  samplePareto() {
    const alpha = this.paretoAdjustment; // Shape parameter
    const xm = 1; // Scale parameter (minimum possible value)
  
    // Generate a random value from Pareto distribution
    const u = Math.random();
    const x = xm / Math.pow(1 - u, 1 / alpha);
  
    // Map x to an index in the range [0, items.length - 1]
    const index = Math.min(Math.floor(x) - 1, this.items.length - 1);
  
    return this.items[index];
  }

  sampleNormal() {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const index = Math.round(this.normalMean + z * this.normalStdDev);
    return this.items[Math.max(0, Math.min(this.items.length - 1, index))];
  }
}