import {faker} from '@faker-js/faker';
// @mui

import {
    Grid,
    Container,
    Typography,
    Card,
    CardHeader,
    Stack,
    TableContainer,
    Table,
    TableBody,
    TableRow, TableCell, Checkbox, Link, TablePagination, CircularProgress, Snackbar, Slide
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
    AppWidgetSummary,
} from '../sections/@dashboard/app';
import {UserListHead, UserListToolbar} from "../sections/@dashboard/user";
import Scrollbar from "../components/Scrollbar";
import dayjs from "dayjs";
import Label from "../components/Label";
import SearchNotFound from "../components/SearchNotFound";
import {useEffect, useState} from "react";
import {filter} from "lodash";
import {useQuery} from "react-query";
import {getStocks} from "../actions";
import {Alert} from "@mui/lab";
import {useDispatch, useSelector} from "react-redux";
import {unSetResponse} from "../app/slices/userSlice";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";
import { Steps } from 'intro.js-react';
import {NavLink as RouterLink} from "react-router-dom";
// ----------------------------------------------------------------------


const TABLE_HEAD = [
   /* {id: 'At', label: 'Updated\u00a0at', alignRight: false},*/
    {id: 'OpenPrice', label: 'Open\u00a0Price', alignRight: false},
    {id: 'CLosePrice', label: 'Close\u00a0price', alignRight: false},
    {id: 'ticker', label: 'Symbol', alignRight: false},
    {id: 'Volume', label: 'Acc\u00a0Volume', alignRight: false},
    {id: 'todaysChange', label: 'Todays\u00a0price\u00a0Change', alignRight: false},
    {id: 'todaysChangePerc', label: 'Todays\u00a0Change\u00a0%', alignRight: false},
    {id: 'price', label: 'Price', alignRight: false},
    {id: ''},
];



const MockData = [
    {
        id: '044ee718112e3b37bd30b397561ce3f1',
        accessionNo: '0001225208-22-009280',
        cik: '1692115',
        ticker: 'SWX',
        companyName: 'Southwest Gas Holdings, Inc.',
        companyNameLong: 'Southwest Gas Holdings, Inc. (Issuer)',
        formType: '4',
        description: 'Form 4 - Statement of changes in beneficial ownership of securities',
        filedAt: '2022-08-04T19:32:37-04:00',
        linkToTxt: 'https://www.sec.gov/Archives/edgar/data/1692115/000122520822009280/0001225208-22-009280.txt',
        linkToHtml: 'https://www.sec.gov/Archives/edgar/data/1692115/000122520822009280/0001225208-22-009280-index.htm',
        linkToXbrl: '',
        linkToFilingDetails: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/xslF345X03/doc4.xml',
        entities: [
            {
                companyName: 'CONLEY E RENAE (Reporting)',
                cik: '1125828',
                type: '4',
                act: '34',
                fileNo: '001-37976',
                filmNo: '221138239'
            },
            {
                companyName: 'Southwest Gas Holdings, Inc. (Issuer)',
                cik: '1692115',
                irsNo: '813881866',
                stateOfIncorporation: 'DE',
                fiscalYearEnd: '1231',
                sic: '4923 Natural Gas Transmisison &amp; Distribution'
            }
        ],
        documentFormatFiles: [
            {
                sequence: '1',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/xslF345X03/doc4.xml',
                type: '4',
                size: ' '
            },
            {
                sequence: '1',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/doc4.xml',
                type: '4',
                size: '8345'
            },
            {
                sequence: ' ',
                description: 'Complete submission text file',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/0001225208-22-009280.txt',
                type: ' ',
                size: '9737'
            }
        ],
        dataFiles: [],
        seriesAndClassesContractsInformation: [],
        periodOfReport: '2022-08-02'
    },
    {
        id: '1ca4b0234ac2373d515c24e34d96a5b0',
        accessionNo: '0001225208-22-009280',
        cik: '1125828',
        ticker: '',
        companyName: 'CONLEY E RENAE',
        companyNameLong: 'CONLEY E RENAE (Reporting)',
        formType: '4',
        description: 'Form 4 - Statement of changes in beneficial ownership of securities',
        filedAt: '2022-08-04T19:32:37-04:00',
        linkToTxt: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/0001225208-22-009280.txt',
        linkToHtml: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/0001225208-22-009280-index.htm',
        linkToXbrl: '',
        linkToFilingDetails: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/xslF345X03/doc4.xml',
        entities: [
            {
                companyName: 'CONLEY E RENAE (Reporting)',
                cik: '1125828',
                type: '4',
                act: '34',
                fileNo: '001-37976',
                filmNo: '221138239'
            },
            {
                companyName: 'Southwest Gas Holdings, Inc. (Issuer)',
                cik: '1692115',
                irsNo: '813881866',
                stateOfIncorporation: 'DE',
                fiscalYearEnd: '1231',
                sic: '4923 Natural Gas Transmisison &amp; Distribution'
            }
        ],
        documentFormatFiles: [
            {
                sequence: '1',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/xslF345X03/doc4.xml',
                type: '4',
                size: ' '
            },
            {
                sequence: '1',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/doc4.xml',
                type: '4',
                size: '8345'
            },
            {
                sequence: ' ',
                description: 'Complete submission text file',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1125828/000122520822009280/0001225208-22-009280.txt',
                type: ' ',
                size: '9737'
            }
        ],
        dataFiles: [],
        seriesAndClassesContractsInformation: [],
        periodOfReport: '2022-08-02'
    },
    {
        id: '3b3c50761d8fd9dca26b637623db7edf',
        accessionNo: '0001225208-22-009281',
        cik: '1692115',
        ticker: 'SWX',
        companyName: 'Southwest Gas Holdings, Inc.',
        companyNameLong: 'Southwest Gas Holdings, Inc. (Issuer)',
        formType: '4',
        description: 'Form 4 - Statement of changes in beneficial ownership of securities',
        filedAt: '2022-08-04T19:33:01-04:00',
        linkToTxt: 'https://www.sec.gov/Archives/edgar/data/1692115/000122520822009281/0001225208-22-009281.txt',
        linkToHtml: 'https://www.sec.gov/Archives/edgar/data/1692115/000122520822009281/0001225208-22-009281-index.htm',
        linkToXbrl: '',
        linkToFilingDetails: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/xslF345X03/doc4.xml',
        entities: [
            {
                companyName: 'Ruisanchez Carlos (Reporting)',
                cik: '1442051',
                type: '4',
                act: '34',
                fileNo: '001-37976',
                filmNo: '221138240'
            },
            {
                companyName: 'Southwest Gas Holdings, Inc. (Issuer)',
                cik: '1692115',
                irsNo: '813881866',
                stateOfIncorporation: 'DE',
                fiscalYearEnd: '1231',
                sic: '4923 Natural Gas Transmisison &amp; Distribution'
            }
        ],
        documentFormatFiles: [
            {
                sequence: '1',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/xslF345X03/doc4.xml',
                type: '4',
                size: ' '
            },
            {
                sequence: '1',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/doc4.xml',
                type: '4',
                size: '6976'
            },
            {
                sequence: ' ',
                description: 'Complete submission text file',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/0001225208-22-009281.txt',
                type: ' ',
                size: '8409'
            }
        ],
        dataFiles: [],
        seriesAndClassesContractsInformation: [],
        periodOfReport: '2022-08-02'
    },
    {
        id: 'c0033a313b866bd603bdbbaaf58d3299',
        accessionNo: '0001225208-22-009281',
        cik: '1442051',
        ticker: 'TSLA',
        companyName: 'Ruisanchez Carlos',
        companyNameLong: 'Ruisanchez Carlos (Reporting)',
        formType: '4',
        description: 'Form 4 - Statement of changes in beneficial ownership of securities',
        filedAt: '2022-08-04T19:33:01-04:00',
        linkToTxt: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/0001225208-22-009281.txt',
        linkToHtml: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/0001225208-22-009281-index.htm',
        linkToXbrl: '',
        linkToFilingDetails: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/xslF345X03/doc4.xml',
        entities: [
            {
                companyName: 'Ruisanchez Carlos (Reporting)',
                cik: '1442051',
                type: '4',
                act: '34',
                fileNo: '001-37976',
                filmNo: '221138240'
            },
            {
                companyName: 'Southwest Gas Holdings, Inc. (Issuer)',
                cik: '1692115',
                irsNo: '813881866',
                stateOfIncorporation: 'DE',
                fiscalYearEnd: '1231',
                sic: '4923 Natural Gas Transmisison &amp; Distribution'
            }
        ],
        documentFormatFiles: [
            {
                sequence: '1',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/xslF345X03/doc4.xml',
                type: '4',
                size: ' '
            },
            {
                sequence: '1',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/doc4.xml',
                type: '4',
                size: '6976'
            },
            {
                sequence: ' ',
                description: 'Complete submission text file',
                documentUrl: 'https://www.sec.gov/Archives/edgar/data/1442051/000122520822009281/0001225208-22-009281.txt',
                type: ' ',
                size: '8409'
            }
        ],
        dataFiles: [],
        seriesAndClassesContractsInformation: [],
        periodOfReport: '2022-08-02'
    }

]

const WatchLists = [

        {
            ticker: ['TSLA', 'AA'],
            sendText:true,
            phone: '+2348103684893',
            createdAt: {seconds: 1655852400, nanoseconds: 0}
        },
        {
            createdAt: {seconds: 1658703903, nanoseconds: 200000000},
            sendText:false,
            phone: '+2348103684893',
            tickers: ['AACI', 'AAPL', 'AAAU']
        }
        ,
        {
            ticker: ['TSLA', 'AA'],
            phone: '+2348103684893',
            sendText:true,
            createdAt: {seconds: 1655852400, nanoseconds: 0}
        },
        {
            createdAt: {seconds: 1658703903, nanoseconds: 200000000},
            phone: '+2348103684893',
            sendText:false,
            tickers: ['AACI', 'AAPL', 'AAAU']
        }


]






// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.ticker.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}



function TransitionRight(props) {
    return <Slide {...props} direction="left" />;
}

const sendText = (watchlist, fillings) =>{
    const eligible =  WatchLists.filter((watchlist) => watchlist.sendText === true)

    eligible.forEach((data)=>{

      for(let i = 0; i < data.ticker.length; i++) {
       const res =  MockData.filter((filling
          ) => filling.ticker === data.ticker[i] )

       //  console.log(data.phone)
       //  console.log(res[i]?.linkToHtml)
      }


    })
}

export default function DashboardApp() {
    //sendText()
    //give an initial state so that the data won't be undefined at start
    const [bids, setBids] = useState([0]);

    /*const ws = new WebSocket("wss://ws.bitstamp.net");

    const apiCall = {
        event: "bts:subscribe",
        data: { channel: "order_book_btcusd" },
    }

    ws.onopen = (event) => {
        ws.send(JSON.stringify(apiCall));
    };

    ws.onmessage = function (event) {
        const json = JSON.parse(event.data);
        try {
            if ((json.event = "data")) {
                console.log(json.data.bids.slice(0, 5))
          alert("hello")
            }
        } catch (err) {
            console.log(err);
        }
    };
*/
    const [enabled,setEnabled] = useState(true);
    const [initialStep,setInitialStep] = useState(0);

    const onExit = () => {
        setEnabled(false)
    }
    const steps = [
        {
            element: '#title',
            intro: 'You can use this button for help',
            position: 'right',
        },
        {
            element: '#about',
            intro: 'You can use this button to get more information',
        },
        {
            element: '#contact',
            intro: 'You can use this button to contact us',
        },
    ];


    const [open, setOpen] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('ticker');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const {
        responseMessage,
        responseState,
        responseType,
        isAuthenticated,
        userData:{
            uid
        }
    } = user

    const {isLoading, refetch, data } = useQuery('get-stocks',()=> getStocks(),{
      //  refetchInterval:2000,
        onError: (err) =>{
               /* dispatch(setResponse({
                    responseMessage:'Network, please drag to refresh 🧐',
                    responseState: true,
                    responseType: 'error',
                }))*/
            console.log(err)
            }

        }
    )

    const useQueryMultiple = () => {
        const watchlistQuery = useQuery('watchlist-user', () => getDoc(doc(db, 'watchlist', uid)),

            )
        return [watchlistQuery];
    }

    const [{ loading: loadingWatchlist,refetch: refetchWatchList, isRefetching, data: watchlistData },] = useQueryMultiple()

   //console.log(watchlistData.data().tickers)


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };




    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = data.tickers.map((n) => n.ticker);
            setSelected(newSelecteds);

            return;
        }
        setSelected([]);
    };

    const clearSelection = () => {
        setSelected([]);
    }

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);

    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {

        setFilterName(event.target.value);

    };

    let filteredUsers = [];
    let emptyRows;
    if(!isLoading && data) {
         emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.tickers.length) : 0;
         filteredUsers = applySortFilter(data.tickers, getComparator(order, orderBy), filterName);
    }
    const isUserNotFound = filteredUsers.length === 0;


    useEffect(() =>{
        // console.log(user)
        if (responseState || responseMessage) {


            const time = setTimeout(() => {
                dispatch(unSetResponse({
                    responseState:false,
                    responseMessage:''
                }))
            }, 4500)
            return () => {
                clearTimeout(time)
            };
        }

    },[responseState,responseMessage])

    useEffect(() => {
        if (responseState || responseMessage) {
            refetchWatchList()
        }
    }, [responseState,responseMessage])

    return (
        <Page title="Dashboard">
         {/*   <Steps
                enabled={enabled}
                steps={steps}
                initialStep={initialStep}
                onExit={onExit}
            />*/}
            <Snackbar open={responseState} TransitionComponent={TransitionRight} anchorOrigin={{vertical:'top', horizontal:'right'}}
                      autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} variant={"standard"} severity={responseType} sx={{ width: '100%' }}>
                    {responseMessage}
                </Alert>
            </Snackbar>
            <Container maxWidth="xl">
                <Typography variant="h4" id="title" sx={{mb: 5}}>
                    Dashboard
                </Typography>


                <Grid container spacing={3}>

                    <Grid item xs={12} sm={6} md={3}>

                        {
                            !loadingWatchlist &&

                            <AppWidgetSummary title="Your watchlist" total={watchlistData?.data()?.tickers?.length} icon={'ant-design:eye-fill'}/>
                        }
                    </Grid>

                   <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Stock listing" total={data?.tickers?.length} color="info" icon={'ant-design:apple-filled'} />
                    </Grid>
                    {/*
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
                    </Grid>*/}
                </Grid>


                <Stack direction="row" alignItems="center" justifyContent="space-between" my={5}>
                    <Typography variant="h4" gutterBottom>
                        Stocks
                    </Typography>

                </Stack>

                <Card>
                    <UserListToolbar clearSelection={clearSelection} numSelected={selected.length} selected={selected} filterName={filterName}
                                     onFilterName={handleFilterByName}/>

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={data?.tickers?.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {


                                        const {
                                            ticker,
                                            todaysChange,
                                            todaysChangePerc,
                                            updated,
                                            day,
                                            min,
                                            prevDay,
                                            lastTrade,
                                        } = row

                                        const date = new Date(updated*1000);
                                       // console.log(date.toLocaleDateString("en-US"));
                                        const isItemSelected = selected.indexOf(ticker) !== -1;
                                        const unixTimestamp = 1575909015

                                        const milliseconds = 1575909015 * 1000 // 1575909015000

                                        const dateObject = new Date(milliseconds)

                                        const humanDateFormat = dateObject.toLocaleString()

                                        return (
                                            <TableRow
                                                hover
                                                key={ticker}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={isItemSelected}
                                                aria-checked={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isItemSelected}
                                                              onChange={(event) => handleClick(event, ticker)}/>
                                                </TableCell>
                                           {/*     <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>

                                                        <Typography variant="caption" noWrap>
                                                            { dayjs(1655981100000).format("YYYY / DD / M")}
                                                            {dayjs().utc(updated).format()}

                                                        </Typography>
                                                    </Stack>
                                                </TableCell>*/}

                                                <TableCell align="left">${
                                                    min.o
                                                }</TableCell>
                                                <TableCell align="left">{min.c}</TableCell>
                                                <TableCell title={"see chart"} style={{

                                                    cursor:'pointer'
                                                }} component={RouterLink} to={`/dashboard/chart/${ticker}`} align="left">

                                                    <Label
                                                               variant="ghost" color={'info'}>
                                                        {ticker}
                                                    </Label>
                                                </TableCell>
                                                <TableCell align="left">{min.av}</TableCell>
                                                <TableCell align="left" color={"blue"}>
                                                    ${todaysChange}

                                                </TableCell>

                                                <TableCell align="left">
                                                    <Label variant="ghost"
                                                           color={`${todaysChangePerc > 1 ? 'success' : 'error'}`}>
                                                        {todaysChangePerc}%
                                                    </Label>
                                                </TableCell>
                                                <TableCell align="left">

                                                    ${min.h}
                                                </TableCell>

                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>

                                {
                                    isUserNotFound && isLoading &&
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                    <CircularProgress color="secondary" />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                }
                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                <SearchNotFound searchQuery={filterName}/>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={data?.tickers?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>


            </Container>
        </Page>
    );
}


