import {faker} from '@faker-js/faker';
// @mui
import {useTheme} from '@mui/material/styles';
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
    TableRow, TableCell, Checkbox, Link, TablePagination, CircularProgress
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
    AppTasks,
    AppNewsUpdate,
    AppOrderTimeline,
    AppCurrentVisits,
    AppWebsiteVisits,
    AppTrafficBySite,
    AppWidgetSummary,
    AppCurrentSubject,
    AppConversionRates,
} from '../sections/@dashboard/app';
import ClusterBuy from "../components/ClusterBuy";
import {UserListHead, UserListToolbar} from "../sections/@dashboard/user";
import Scrollbar from "../components/Scrollbar";
import dayjs from "dayjs";
import Label from "../components/Label";
import SearchNotFound from "../components/SearchNotFound";
import {useEffect, useState} from "react";
import {filter} from "lodash";
import Chart from "react-apexcharts";

// ----------------------------------------------------------------------


const TABLE_HEAD = [
    {id: 'At', label: 'Updated\u00a0at', alignRight: false},
    {id: 'OpenPrice', label: 'Open\u00a0Price', alignRight: false},
    {id: 'CLosePrice', label: 'Close\u00a0price', alignRight: false},
    {id: 'ticker', label: 'Symbol', alignRight: false},
    {id: 'Volume', label: 'Acc\u00a0Volume', alignRight: false},
    {id: 'todaysChange', label: 'Todays\u00a0price\u00a0Change', alignRight: false},
    {id: 'todaysChangePerc', label: 'Todays\u00a0Change\u00a0%', alignRight: false},
    {id: 'price', label: 'Price', alignRight: false},
    {id: ''},
];

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


export default function DashboardApp() {


    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);



    useEffect(() => {

        const abortController = new AbortController();
        (async ()=> {
                setLoading(true)

                const requestOptions = {
                    method: 'GET',
                    signal: abortController.signal,

                };


                const promise = Promise.race([
                    fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=OdRN9Z80VjPRbWZE741e6ouG0uP07iUQ`, requestOptions)
                        .then(response => response.json()),
                    new Promise((resolve, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), 10000)
                    )
                ]);

                promise.then(result => {
                    if (result.status === 'DELAYED') {
                        setStocks(result.tickers)


                    } else {
                        setStocks([])
                    }
                    setLoading(false)
                })
                promise.catch(error => {
                    console.log(error)
                });
            }
        )()
        return () => {
            abortController.abort()
        };
    }, []);


    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('ticker');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = stocks.map((n) => n.ticker);
            setSelected(newSelecteds);

            return;
        }
        setSelected([]);
    };

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
        console.log(selected)
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stocks.length) : 0;

    const filteredUsers = applySortFilter(stocks, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{mb: 5}}>
                    Dashboard
                </Typography>


                <Grid container spacing={3}>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Your watchlist" total={0} icon={'ant-design:eye-fill'} />
                    </Grid>

                   <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
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
                    <UserListToolbar numSelected={selected.length} filterName={filterName}
                                     onFilterName={handleFilterByName}/>

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={stocks.length}
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
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>

                                                        <Typography variant="caption" noWrap>
                                                            {date.toLocaleDateString("en-US")}

                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">${
                                                    min.o
                                                }</TableCell>
                                                <TableCell align="left">{min.c}</TableCell>
                                                <TableCell align="left">
                                                    <Label variant="ghost" color={'info'}>
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
                                    isUserNotFound && loading &&
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
                        count={stocks.length}
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


