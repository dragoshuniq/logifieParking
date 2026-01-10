import perf from '@react-native-firebase/perf';

export const initializePerformance = async () => {
  await perf().setPerformanceCollectionEnabled(true);
};

export const startTrace = async (traceName: string) => {
  const trace = await perf().startTrace(traceName);
  return trace;
};

export const startHttpMetric = async (url: string, httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') => {
  const metric = await perf().newHttpMetric(url, httpMethod);
  return metric;
};

export default perf;
