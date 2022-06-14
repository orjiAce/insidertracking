

export const getStocks = () => {
    const requestOptions = {
        method: 'GET',
        //signal: abortController.signal,

    };


 return  Promise.race([
        fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=OdRN9Z80VjPRbWZE741e6ouG0uP07iUQ`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 10000)
        )
    ]);



}


export const getWatchlist = (tickers) => {
    const requestOptions = {
        method: 'GET',
        //signal: abortController.signal,

    };


 return  Promise.race([
        fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${tickers}&apiKey=OdRN9Z80VjPRbWZE741e6ouG0uP07iUQ`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 10000)
        )
    ]);



}
