import axiosInstance from "./verifyJWT";

const convertCurrency = async (price) => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER;
  const targetCurrency = localStorage.getItem('currencyCode') || 'SAR';

  // Function to fetch new rate and update localStorage
  const fetchNewRate = async () => {
    const response = await axiosInstance.post(`${serverURL}/api/get-rate`, { targetCurrency });
    const rate = response.data[0].rate;
    const cacheData = {
      rate: rate,
      timestamp: Date.now(),
      targetCurrency: targetCurrency
    };
    localStorage.setItem('rateCache', JSON.stringify(cacheData));  // Save cache data in localStorage
    return rate;
  };

  // Try to retrieve the cache from localStorage
  let rateCache = localStorage.getItem('rateCache');
  rateCache = rateCache ? JSON.parse(rateCache) : {};

  // Check if the rate is cached and less than 10 minutes old and matches the target currency
  if (rateCache.timestamp && rateCache.targetCurrency === targetCurrency &&
      (Date.now() - rateCache.timestamp < 600000)) {
    return {
      price: price * rateCache.rate,
      currency: targetCurrency
    };
  } else {
    // Fetch new rate if not cached or cache is old or currency has changed
    const newRate = await fetchNewRate();
    return {
      price: price * newRate,
      currency: targetCurrency
    };
  }
}

export default convertCurrency;
