

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

export const getTickerChartData= (ticker) => {
    /*const requestOptions = {
        method: 'GET',
        //signal: abortController.signal,

    };


 return  Promise.race([
        fetch(`https://polygon.io/quote/_next/data/UXRukIsTe3NdsZDZTx30B/AAPL.json?timeFrame=LAST_1_YEAR_1_DAY_BARS&id=${ticker}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 10000)
        )
    ]);*/

    const myHeaders = new Headers();
    myHeaders.append("token", "7c2bdaf39e5d57584ebdba121372c14e0c6793d2ed871a12fa9b4914f8e84a24");
    myHeaders.append("accept", "*/*");



    const requestOptions = {
        method: 'GET',
        headers: myHeaders,

    };

    return  Promise.race([
        fetch('https://polygon.io/quote/_next/data/UXRukIsTe3NdsZDZTx30B/AAPL.json?timeFrame=LAST_1_YEAR_1_DAY_BARS&id=AAPL', requestOptions)
            .then(response => response.text()),
        new Promise((resolve, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 10000)
        )
    ]);





}


export const getChartData = async (ticker) =>{
    const requestOptions = {
        method: 'GET',
        //signal: abortController.signal,

    };


    return await Promise.race([
        fetch(`https://yahoo-finance-api.vercel.app/${ticker}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 10000)
        )
    ]);


}
