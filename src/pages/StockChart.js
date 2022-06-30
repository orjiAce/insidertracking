
import ReactApexChart from 'react-apexcharts';
import { useParams } from 'react-router-dom';
import {useMemo, useState} from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Container, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import {useQuery} from "react-query";
import Paper from '@mui/material/Paper';

// components
import Page from "../components/Page";
import Iconify from '../components/Iconify';
import Markdown from '../components/Markdown';
import  SkeletonProduct  from '../components/SkeletonProduct';

// sections


import {useDispatch} from "react-redux";
import merge from "lodash/merge";





// @mui
import { useTheme } from '@mui/material/styles';
import {getChartData} from "../actions";
import {setResponse} from "../app/slices/userSlice";
import dayjs from "dayjs";
import Label from "../components/Label";

// ----------------------------------------------------------------------


const compactNumber = (value) => {
  const suffixes = ["", "K", "M", "B", "T"];

  const suffixNum = Math.floor(("" + value).length / 3);
  let shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
  if (shortValue % 1 != 0) {
    //@ts-ignore
    shortValue = shortValue.toFixed(3)
  }
  return shortValue + ' ' + suffixes[suffixNum]
}

const BaseOptionChart =() => {

  const theme = useTheme();

  const LABEL_TOTAL = {
    show: false,
    label: 'Total',
    color: theme.palette.text.secondary,
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: theme.typography.subtitle2.fontWeight,
    lineHeight: theme.typography.subtitle2.lineHeight,
  };

  const LABEL_VALUE = {
    offsetY: 8,
    color: theme.palette.text.primary,
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    lineHeight: theme.typography.h3.lineHeight,
  };

  return {
    // Colors
    colors: [
      theme.palette.primary.main,
      theme.palette.chart.yellow[0],
      theme.palette.chart.blue[0],
      theme.palette.chart.violet[0],
      theme.palette.chart.green[0],
      theme.palette.chart.red[0],
    ],

    // Chart
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
       animations: { enabled: true },
      foreColor: theme.palette.text.disabled,
      fontFamily: theme.typography.fontFamily,
    },

    // States
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.04,
        },
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.88,
        },
      },
    },

    // Fill
    fill: {
      opacity: 1,
      gradient: {
        type: 'vertical',

        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100]
      },
    },

    // Datalabels
    dataLabels: { enabled: false },

    // Stroke
    stroke: {
      width: 3,
      curve: 'smooth',
      lineCap: 'round',
    },

    // Grid
    grid: {
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
    },

    // Xaxis
    xaxis: {
      type: 'datetime',
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    // Markers
    markers: {
      size: 0,
      strokeColors: theme.palette.background.paper,
    },

    // Tooltip
    tooltip: {
      x: {
        show: true,
      },
    },

    // Legend
    legend: {
      show: false,
      fontSize: String(13),
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        radius: 12,
      },
      fontWeight: 500,
      itemMargin: { horizontal: 12 },
      labels: {
        colors: theme.palette.text.primary,
      },
    },

    // plotOptions
    plotOptions: {
      // Bar
      bar: {
        columnWidth: '28%',
        borderRadius: 4,
      },
      // Pie + Donut
      pie: {
        donut: {
          labels: {
            show: true,
            value: LABEL_VALUE,
            total: LABEL_TOTAL,
          },
        },
      },
      // Radialbar
      radialBar: {
        track: {
          strokeWidth: '100%',
          background: theme.palette.grey[500_16],
        },
        dataLabels: {
          value: LABEL_VALUE,
          total: LABEL_TOTAL,
        },
      },
      // Radar
      radar: {
        polygons: {
          fill: { colors: ['transparent'] },
          strokeColors: theme.palette.divider,
          connectorColors: theme.palette.divider,
        },
      },
      // polarArea
      polarArea: {
        rings: {
          strokeColor: theme.palette.divider,
        },
        spokes: {
          connectorColors: theme.palette.divider,
        },
      },
    },

    // Responsive
    responsive: [
      {
        // sm
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: { bar: { columnWidth: '40%' } },
        },
      },
      {
        // md
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: { bar: { columnWidth: '32%' } },
        },
      },
    ],
  };
}




// ----------------------------------------------------------------------





const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------




const directionEmojis = {
  up: '🚀',
  down: '💩',
  '': '',
};



const round = (number) => {
  return number ? +(number.toFixed(2)) : null;
};

export default function StockChart() {
const params = useParams()

  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const { name = '' } = useParams();
const product = {}

  const chartOptions = merge(BaseOptionChart(), {


      yaxis: {
        tooltip: {
          enabled: true
        }
      },
    legend: { position: 'top', horizontalAlign: 'right' },
  /*  xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', ],
    },*/
  });


  const [series, setSeries] = useState([{
    data: []
  }]);
  const [price, setPrice] = useState(-1);
  const [tickerName, setTickerName] = useState('');
  const [prevPrice, setPrevPrice] = useState(-1);
  const [priceTime, setPriceTime] = useState(null);



 const {isLoading, refetch, data } = useQuery('ticker-price-chart',()=> getChartData(params.ticker),{
         //refetchInterval:10000,
    onSuccess:(data) =>{
      //  console.log(data);
      const gme = data[0].chart.result[0];
      setPrevPrice(price);
      setPrice(gme.meta.regularMarketPrice.toFixed(2));
      setPriceTime(new Date(gme.meta.regularMarketTime * 1000));
      const quote = gme.indicators.quote[0];
      const prices = gme.timestamp.map((timestamp, index) => ({
        x: new Date(timestamp * 1000),
        y: [quote.open[index], quote.high[index], quote.low[index], quote.close[index]].map(round)
      }));


      setSeries([{
        data: prices,
      }]);

    },
        onError: (err) =>{
          dispatch(setResponse({
               responseMessage:'Network, please drag to refresh 🧐',
               responseState: true,
               responseType: 'error',
           }))
          console.log(err)
        }

      }
  )


  //Wed Jun 29 2022 16:10:00 GMT+0100 (West Africa Standard Time
  const direction = useMemo(() => prevPrice < price ? 'up' : prevPrice > price ? 'down' : '', [prevPrice, price]);
  function getPercentageIncrease(numA, numB) {
    return ((numA - numB) / numB) * 100;
  }

  return (
    <Page title="Ecommerce: Product Details">
      <Container maxWidth="xl">






          <>

              <Grid container>
                <Grid item xs={12} md={6} lg={12}>


                <Typography fontSize={"large"}>
                  {params.ticker}
                  <Typography fontSize={"small"} fontWeight={"bold"}>

                    {data && data[2]?.results?.name}
               {/*     {data[2].results.name} */}

                  </Typography>
                </Typography>

                <Typography fontSize={"large"} fontWeight={"bolder"}>
                  <div className={['price', direction].join(' ')}>
                  ${price} {directionEmojis[direction]}
                </div>

                  <Label
                      variant="ghost" color={ prevPrice < price ? 'success' : 'error'}>
                %{getPercentageIncrease(price,prevPrice).toFixed(2)}


                  </Label>

                </Typography>
                </Grid>


                <Grid item xs={12} md={6} lg={12}>
                    <ReactApexChart type="area" series={series} options={chartOptions} height={364} />



                </Grid>

              </Grid>

{/*
            <Grid container sx={{ my: 8 }}>
              {PRODUCT_DESCRIPTION.map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                    <IconWrapperStyle>
                      <Iconify icon={item.icon} width={36} height={36} />
                    </IconWrapperStyle>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>*/}

            <Card>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    <Tab disableRipple value="1" label="Description" />

                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>

                    <Grid container spacing={1}>
                      <Grid container item spacing={2}>
                         <>
                        <Grid item xs={3}>
                          <Item>Market cap
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                          <Item>      {data && compactNumber(data[2]?.results?.market_cap.toFixed(0))}</Item>
                        </Grid>

                        <Grid item xs={3}>
                          <Item>Item</Item>
                        </Grid>  <Grid item xs={3}>
                          <Item>Item</Item>
                        </Grid>

                      </>
                      </Grid>


                      <Grid container item spacing={2}>
                         <>
                        <Grid item xs={3}>
                          <Item>Open
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                          <Item>691.50</Item>
                        </Grid>

                        <Grid item xs={3}>
                          <Item>Item</Item>
                        </Grid>  <Grid item xs={3}>
                          <Item>Item</Item>
                        </Grid>

                      </>
                      </Grid>




                    </Grid>







                  </Box>
                </TabPanel>
          {/*      <TabPanel value="2">
                  <ProductDetailsReview product={product} />
                </TabPanel>*/}
              </TabContext>
            </Card>
          </>


        {!product && <SkeletonProduct />}

{/*        {error && <Typography variant="h6">404 Product not found</Typography>}*/}
      </Container>
    </Page>
  );
}
