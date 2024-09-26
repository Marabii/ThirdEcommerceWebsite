import axiosInstance from "./verifyJWT";

// Setting up a simple cache structure
const rateCache = {
  timestamp: null,
  rate: null,
  targetCurrency: null
};

const convertCurrency = async (price) => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER;
  const targetCurrency = localStorage.getItem('currencyCode') || 'SAR';

  // Function to fetch new rate
  const fetchNewRate = async () => {
    const response = await axiosInstance.post(`${serverURL}/api/get-rate`, { targetCurrency });
    const rate = response.data[0].rate;
    rateCache.rate = rate;
    rateCache.timestamp = Date.now();
    rateCache.targetCurrency = targetCurrency;
  };

  // Check if the rate is cached and less than 10 minutes old and matches the target currency
  if (rateCache.timestamp && rateCache.targetCurrency === targetCurrency &&
      (Date.now() - rateCache.timestamp < 600000)) {
    return {
      price: price * rateCache.rate,
      currency: targetCurrency
    };
  } else {
    // Fetch new rate if not cached or cache is old or currency has changed
    await fetchNewRate();
    return {
      price: price * rateCache.rate,
      currency: targetCurrency
    };
  }
}

export default convertCurrency;
