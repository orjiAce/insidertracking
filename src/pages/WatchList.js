import React, {useEffect, useState} from 'react';
import {
    Card, Checkbox, CircularProgress,
    Container,
    Slide,
    Snackbar, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer, TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {Alert} from "@mui/lab";
import {useDispatch, useSelector} from "react-redux";
import Page from "../components/Page";
import {useQuery} from "react-query";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";
import {getWatchlist} from "../actions";
import {UserListHead} from "../sections/@dashboard/user";
import Scrollbar from "../components/Scrollbar";
import Label from "../components/Label";
import SearchNotFound from "../components/SearchNotFound";
import {filter} from "lodash";
import {unSetResponse} from "../app/slices/userSlice";
import WatchlistToolbar from "../sections/@dashboard/user/WatchlistToolbar";
import { pink, red } from '@mui/material/colors';




const WATCHLIST_TABLE_HEAD = [

    {id: 'OpenPrice', label: 'Open\u00a0Price', alignRight: false},
    {id: 'CLosePrice', label: 'Close\u00a0price', alignRight: false},
    {id: 'ticker', label: 'Symbol', alignRight: false},
    {id: 'Volume', label: 'Acc\u00a0Volume', alignRight: false},
    {id: 'todaysChange', label: 'Todays\u00a0price\u00a0Change', alignRight: false},
    {id: 'todaysChangePerc', label: 'Todays\u00a0Change\u00a0%', alignRight: false},
    {id: 'price', label: 'Price', alignRight: false},
    {id: ''},
];

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
    return <Slide {...props} direction="left"/>;
}



const WatchList = () => {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('ticker');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const {
        responseMessage,
        responseState,
        responseType,
        isAuthenticated,
        userData: {
            uid
        }
    } = user


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const useQueryMultiple = () => {
        const watchlistQuery = useQuery('watchlist-q', () => getDoc(doc(db, 'watchlist', uid)),{
            refetchInterval:1000,
        })

        return [watchlistQuery];
    }
    const [
        {loading: loadingWatchlist, data: watchlistData},
    ] = useQueryMultiple()

    // Then get the user's projects
    const {isIdle, data: myWatchlist, isLoading,isRefetching} = useQuery(
        'users-Watchlist',

        () => getWatchlist(watchlistData?.data()?.tickers.join(',')),
        {
refetchInterval:2000,
            // The query will not execute until the userId exists
            enabled: !!watchlistData?.data()?.tickers.length,
        },

    )



    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = myWatchlist?.tickers.map((n) => n.ticker);
            setSelected(newSelected);

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
    const clearSelection = () => {
        setSelected([]);
    }

    let filteredTickers = [];
    let emptyRows;
    if (!isLoading && myWatchlist) {
        emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - myWatchlist.tickers.length) : 0;
        filteredTickers = applySortFilter(myWatchlist.tickers, getComparator(order, orderBy), filterName);
    }
    const isUserNotFound = filteredTickers.length === 0;

    useEffect(() => {
        // console.log(user)
        if (responseState || responseMessage) {


            const time = setTimeout(() => {
                dispatch(unSetResponse({
                    responseState: false,
                    responseMessage: ''
                }))
            }, 4500)
            return () => {
                clearTimeout(time)
            };
        }

    }, [responseState, responseMessage])


    return (
        <Page title="Watchlist">
            <Snackbar open={responseState} TransitionComponent={TransitionRight}
                      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                      autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} variant={"standard"} severity={responseType} sx={{width: '100%'}}>
                    {responseMessage}
                </Alert>
            </Snackbar>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{mb: 5}}>
                    Your watchlist
                </Typography>

                {
                    !watchlistData?.data()?.tickers.length
                        ? <Typography variant="h4" sx={{mb: 5}}>
                            You have no watchlist
                        </Typography> :

                        <Card>
                            <WatchlistToolbar clearSelection={clearSelection} numSelected={selected.length} selected={selected} filterName={filterName}
                                              onFilterName={handleFilterByName}/>

                            <Scrollbar>
                                <TableContainer sx={{minWidth: 800}}>
                                    <Table>
                                        <UserListHead
                                            order={order}
                                            orderBy={orderBy}
                                            headLabel={WATCHLIST_TABLE_HEAD}
                                            rowCount={myWatchlist?.tickers.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                            onSelectAllClick={handleSelectAllClick}
                                        />
                                        <TableBody>
                                            {filteredTickers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {


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
                                                            <Checkbox sx={{
                                                                color: red[800],
                                                                '&.Mui-checked': {
                                                                    color: red[600],
                                                                },
                                                            }} checked={isItemSelected}
                                                                      onChange={(event) => handleClick(event, ticker)}/>
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
                                            isUserNotFound && isLoading || loadingWatchlist &&
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                        <CircularProgress color="secondary"/>
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
                                count={myWatchlist?.tickers?.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Card>
                }



            </Container>
        </Page>
    );
};

export default WatchList;
