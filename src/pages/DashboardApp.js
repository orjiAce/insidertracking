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
    TableRow, TableCell, Checkbox, Link, TablePagination
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

// ----------------------------------------------------------------------


const TABLE_HEAD = [
    {id: 'At', label: 'Last\u00a0Updated', alignRight: false},
    {id: 'Type', label: '\u00a0Type', alignRight: false},
    {id: 'CIK', label: 'CIK', alignRight: false},
    {id: 'Ticker', label: 'Ticker', alignRight: false},
    {id: 'Company', label: 'Company\u00a0Name', alignRight: false},
    {id: 'currency_name', label: 'Currency Name', alignRight: false},
    {id: 'Market', label: 'Market', alignRight: false},
    {id: 'primary_exchange', label: 'Primary Exchange', alignRight: false},
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
        return filter(array, (_user) => _user.companyName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}


export default function DashboardApp() {
    const theme = useTheme();

    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {


        const abortController = new AbortController();
        const requestOptions = {
            method: 'GET',
            signal: abortController.signal,

        };


        const promise = Promise.race([
            fetch('https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&sort=market&order=asc&limit=15&apiKey=iFeHNMrhbpkHU7jgUzHUUZWd1AJbnT5B', requestOptions)
                .then(response => response.json()),
            new Promise((resolve, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 10000)
            )
        ]);

        promise.then(result => {
            if (result.status === 'OK') {
                setStocks(result.results)

            } else {
                setStocks([])
            }
        })
        promise.catch(error => {
            console.log(error)
        });

        return () => {
            abortController.abort()
        };
    }, []);


    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = FILLINGS.map((n) => n.companyName);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - FILLINGS.length) : 0;

    const filteredUsers = applySortFilter(FILLINGS, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{mb: 5}}>
                    Dashboard
                </Typography>

                {/* <Grid container spacing={3}>*/}


                {/*  <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="AOL 500"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[


                {
                  name: 'Down',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>*/}

                {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid> */}

                {/*
            <Grid item xs={12} md={6} lg={12}>
                <Card>
                    <CardHeader title={"Latest Cluster buy"}  />
<ClusterBuy/>

                </Card>
            </Grid>
        </Grid>*/}


                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Insider buy
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
                                    {stocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        /*  const {
                                              id,
                                              companyName,
                                              cik,
                                              ticker,
                                              linkToFilingDetails,
                                              linkToTxt,
                                              linkToHtml,
                                              formType,
                                              filedAt
                                          } = row;*/

                                        const {
                                            active,
                                            cik,
                                            composite_figi,
                                            currency_name,
                                            last_updated_utc,
                                            locale,
                                            market,
                                            name,
                                            primary_exchange,
                                            share_class_figi,
                                            ticker,
                                            type,
                                        } = row
                                        const isItemSelected = selected.indexOf(cik) !== -1;

                                        return (
                                            <TableRow
                                                hover
                                                key={cik}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={isItemSelected}
                                                aria-checked={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isItemSelected}
                                                              onChange={(event) => handleClick(event, cik)}/>
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>

                                                        <Typography variant="caption" noWrap>
                                                            {dayjs(last_updated_utc).format('YYYY-DD-MM, H:M:s')}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{type}</TableCell>
                                                <TableCell align="left">{cik}</TableCell>
                                                <TableCell align="left">
                                                    <Label variant="ghost" color={'success'}>
                                                        {ticker}
                                                    </Label>
                                                </TableCell>
                                                <TableCell align="left">{ticker}</TableCell>
                                                <TableCell align="left" color={"blue"}>
                                                    {currency_name}
                                                    {/* <Link color="#1890ff" href={linkToFilingDetails} underline="hover">
                                                        {`${linkToFilingDetails.substring(0, 14)}...`}{`${linkToFilingDetails.substring(80, linkToFilingDetails.length)}`}
                                                    </Link>*/}
                                                </TableCell>

                                                <TableCell align="left">
                                                   {/* <Link color="#1890ff" href={linkToFilingDetails}
                                                          underline="hover">{`${linkToTxt.substring(0, 14)}...`}{`${linkToTxt.substring(80, linkToTxt.length)}`}
                                                    </Link>*/}
                                                    {market}
                                                </TableCell>
                                                <TableCell align="left">
                                                   {/* <Link color="#1890ff" href={linkToFilingDetails}
                                                          underline="hover">{`${linkToHtml.substring(0, 14)}...`}{`${linkToHtml.substring(80, linkToHtml.length)}`}
                                                    </Link>*/}
                                                    {primary_exchange}
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
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={FILLINGS.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>

                {/* <Card>
              <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

              <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                      <Table>
                          <UserListHead
                              order={order}
                              orderBy={orderBy}
                              headLabel={TABLE_HEAD}
                              rowCount={FILLINGS.length}
                              numSelected={selected.length}
                              onRequestSort={handleRequestSort}
                              onSelectAllClick={handleSelectAllClick}
                          />
                          <TableBody>
                              {FILLINGS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                  const { id, companyName,cik,ticker,linkToFilingDetails,linkToTxt,linkToHtml, formType, filedAt } = row;
                                  const isItemSelected = selected.indexOf(companyName) !== -1;

                                  return (
                                      <TableRow
                                          hover
                                          key={id}
                                          tabIndex={-1}
                                          role="checkbox"
                                          selected={isItemSelected}
                                          aria-checked={isItemSelected}
                                      >
                                          <TableCell padding="checkbox">
                                              <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, companyName)} />
                                          </TableCell>
                                          <TableCell component="th" scope="row" padding="none">
                                              <Stack direction="row" alignItems="center" spacing={2}>

                                                  <Typography variant="caption" noWrap>
                                                      {dayjs(filedAt).format('YYYY-DD-MM, H:M:s')}
                                                  </Typography>
                                              </Stack>
                                          </TableCell>

                                          <TableCell align="left">{formType}</TableCell>
                                          <TableCell align="left">{cik}</TableCell>
                                          <TableCell align="left">
                                              <Label variant="ghost" color={'success'}>
                                                  {ticker}
                                              </Label>
                                          </TableCell>
                                          <TableCell align="left">{companyName}</TableCell>
                                          <TableCell align="left" color={"blue"}>
                                              <Link color="#1890ff" href={linkToFilingDetails} underline="hover">
                                                  {`${linkToFilingDetails.substring(0, 14)  }...`}{`${linkToFilingDetails.substring(80, linkToFilingDetails.length) }`}
                                              </Link>
                                          </TableCell>

                                          <TableCell align="left">
                                              <Link color="#1890ff" href={linkToFilingDetails} underline="hover">{`${linkToTxt.substring(0, 14)  }...`}{`${linkToTxt.substring(80, linkToTxt.length)  }`}
                                              </Link>
                                          </TableCell>
                                          <TableCell align="left">
                                              <Link color="#1890ff" href={linkToFilingDetails} underline="hover">{`${linkToHtml.substring(0, 14)}...`}{`${linkToHtml.substring(80, linkToHtml.length) }`}
                                              </Link></TableCell>

                                      </TableRow>
                                  );
                              })}
                              {emptyRows > 0 && (
                                  <TableRow style={{ height: 53 * emptyRows }}>
                                      <TableCell colSpan={6} />
                                  </TableRow>
                              )}
                          </TableBody>

                          {isUserNotFound && (
                              <TableBody>
                                  <TableRow>
                                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                          <SearchNotFound searchQuery={filterName} />
                                      </TableCell>
                                  </TableRow>
                              </TableBody>
                          )}
                      </Table>
                  </TableContainer>
              </Scrollbar>

              <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={FILLINGS.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
              />
          </Card>*/}
            </Container>
        </Page>
    );
}

const FILLINGS =
    [
        {
            "id": "07a71547a3957260edd27eced25a7549",
            "accessionNo": "0001140361-22-019016",
            "cik": "1746129",
            "ticker": "BSVN",
            "companyName": "Bank7 Corp.",
            "companyNameLong": "Bank7 Corp. (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T11:17:30-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/0001140361-22-019016.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/0001140361-22-019016-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/brhc10037525_10q.htm",
            "entities": [
                {
                    "companyName": "Bank7 Corp. (Filer)",
                    "cik": "1746129",
                    "irsNo": "200764349",
                    "stateOfIncorporation": "OK",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-38656",
                    "filmNo": "22921040",
                    "sic": "6022 State Commercial Banks"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1746129/000114036122019016/brhc10037525_10q.htm",
                    "type": "10-Q",
                    "size": "3383012"
                },
                {
                    "sequence": "2",
                    "description": "EXHIBIT 31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/brhc10037525_ex31-1.htm",
                    "type": "EX-31.1",
                    "size": "10954"
                },
                {
                    "sequence": "3",
                    "description": "EXHIBIT 31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/brhc10037525_ex31-2.htm",
                    "type": "EX-31.2",
                    "size": "10844"
                },
                {
                    "sequence": "4",
                    "description": "EXHIBIT 32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/brhc10037525_ex32-1.htm",
                    "type": "EX-32.1",
                    "size": "4223"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/0001140361-22-019016.txt",
                    "type": " ",
                    "size": "14141253"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "5",
                    "description": "XBRL TAXONOMY EXTENSION SCHEMA",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/bsvn-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "49253"
                },
                {
                    "sequence": "6",
                    "description": "XBRL TAXONOMY EXTENSION CALCULATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/bsvn-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "92125"
                },
                {
                    "sequence": "7",
                    "description": "XBRL TAXONOMY EXTENSION DEFINITION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/bsvn-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "329056"
                },
                {
                    "sequence": "8",
                    "description": "XBRL TAXONOMY EXTENSION LABEL LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/bsvn-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "827095"
                },
                {
                    "sequence": "9",
                    "description": "XBRL TAXONOMY EXTENSION PRESENTATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/bsvn-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "497683"
                },
                {
                    "sequence": "63",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1746129/000114036122019016/brhc10037525_10q_htm.xml",
                    "type": "XML",
                    "size": "3529117"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "90b90a1104e7ece020535ef903116b97",
            "accessionNo": "0001213900-22-026218",
            "cik": "1866226",
            "ticker": "WTMA",
            "companyName": "Welsbach Technology Metals Acquisition Corp.",
            "companyNameLong": "Welsbach Technology Metals Acquisition Corp. (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T11:07:51-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/0001213900-22-026218.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/0001213900-22-026218-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/f10q0322_welsbachtech.htm",
            "entities": [
                {
                    "companyName": "Welsbach Technology Metals Acquisition Corp. (Filer)",
                    "cik": "1866226",
                    "irsNo": "871006702",
                    "stateOfIncorporation": "DE",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-41183",
                    "filmNo": "22921001",
                    "sic": "6770 Blank Checks"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "QUARTERLY REPORT",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1866226/000121390022026218/f10q0322_welsbachtech.htm",
                    "type": "10-Q",
                    "size": "364262"
                },
                {
                    "sequence": "2",
                    "description": "CERTIFICATION",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/f10q0322ex31-1_welsbachtech.htm",
                    "type": "EX-31.1",
                    "size": "17356"
                },
                {
                    "sequence": "3",
                    "description": "CERTIFICATION",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/f10q0322ex31-2_welsbachtech.htm",
                    "type": "EX-31.2",
                    "size": "17437"
                },
                {
                    "sequence": "4",
                    "description": "CERTIFICATION",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/f10q0322ex32-1_welsbachtech.htm",
                    "type": "EX-32.1",
                    "size": "7093"
                },
                {
                    "sequence": "5",
                    "description": "CERTIFICATION",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/f10q0322ex32-2_welsbachtech.htm",
                    "type": "EX-32.2",
                    "size": "7106"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/0001213900-22-026218.txt",
                    "type": " ",
                    "size": "2673683"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "6",
                    "description": "XBRL SCHEMA FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/wtmau-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "31728"
                },
                {
                    "sequence": "7",
                    "description": "XBRL CALCULATION FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/wtmau-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "16884"
                },
                {
                    "sequence": "8",
                    "description": "XBRL DEFINITION FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/wtmau-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "153402"
                },
                {
                    "sequence": "9",
                    "description": "XBRL LABEL FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/wtmau-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "283984"
                },
                {
                    "sequence": "10",
                    "description": "XBRL PRESENTATION FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/wtmau-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "158378"
                },
                {
                    "sequence": "41",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1866226/000121390022026218/f10q0322_welsbachtech_htm.xml",
                    "type": "XML",
                    "size": "237164"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "23a2e3dc66a58299ef78486a78e4f547",
            "accessionNo": "0001558370-22-008687",
            "cik": "1692345",
            "ticker": "",
            "companyName": "PROCACCIANTI HOTEL REIT, INC.",
            "companyNameLong": "PROCACCIANTI HOTEL REIT, INC. (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T11:01:32-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/0001558370-22-008687.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/0001558370-22-008687-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331x10q.htm",
            "entities": [
                {
                    "companyName": "PROCACCIANTI HOTEL REIT, INC. (Filer)",
                    "cik": "1692345",
                    "irsNo": "813661609",
                    "stateOfIncorporation": "MD",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "000-56272",
                    "filmNo": "22920969",
                    "sic": "6798 Real Estate Investment Trusts"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1692345/000155837022008687/tmb-20220331x10q.htm",
                    "type": "10-Q",
                    "size": "1682036"
                },
                {
                    "sequence": "2",
                    "description": "EX-31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331xex31d1.htm",
                    "type": "EX-31.1",
                    "size": "15055"
                },
                {
                    "sequence": "3",
                    "description": "EX-31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331xex31d2.htm",
                    "type": "EX-31.2",
                    "size": "14781"
                },
                {
                    "sequence": "4",
                    "description": "EX-32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331xex32d1.htm",
                    "type": "EX-32.1",
                    "size": "13674"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/0001558370-22-008687.txt",
                    "type": " ",
                    "size": "6543270"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "5",
                    "description": "EX-101.SCH",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "58010"
                },
                {
                    "sequence": "6",
                    "description": "EX-101.CAL",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "37617"
                },
                {
                    "sequence": "7",
                    "description": "EX-101.DEF",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "259060"
                },
                {
                    "sequence": "8",
                    "description": "EX-101.LAB",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "347728"
                },
                {
                    "sequence": "9",
                    "description": "EX-101.PRE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "338670"
                },
                {
                    "sequence": "49",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1692345/000155837022008687/tmb-20220331x10q_htm.xml",
                    "type": "XML",
                    "size": "1024843"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "62886e5a7e83314e053816f41c503cd8",
            "accessionNo": "0001437749-22-012266",
            "cik": "770460",
            "ticker": "PFBX",
            "companyName": "PEOPLES FINANCIAL CORP /MS/",
            "companyNameLong": "PEOPLES FINANCIAL CORP /MS/ (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:54:36-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/0001437749-22-012266.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/0001437749-22-012266-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/pfbx20220331_10q.htm",
            "entities": [
                {
                    "companyName": "PEOPLES FINANCIAL CORP /MS/ (Filer)",
                    "cik": "770460",
                    "irsNo": "640709834",
                    "stateOfIncorporation": "MS",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-12103",
                    "filmNo": "22920947",
                    "sic": "6022 State Commercial Banks"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "FORM 10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/770460/000143774922012266/pfbx20220331_10q.htm",
                    "type": "10-Q",
                    "size": "1478586"
                },
                {
                    "sequence": "2",
                    "description": "EXHIBIT 31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/ex_372090.htm",
                    "type": "EX-31.1",
                    "size": "8464"
                },
                {
                    "sequence": "3",
                    "description": "EXHIBIT 31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/ex_372091.htm",
                    "type": "EX-31.2",
                    "size": "8691"
                },
                {
                    "sequence": "4",
                    "description": "EXHIBIT 32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/ex_372092.htm",
                    "type": "EX-32.1",
                    "size": "8165"
                },
                {
                    "sequence": "5",
                    "description": "EXHIBIT 32.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/ex_372093.htm",
                    "type": "EX-32.2",
                    "size": "8658"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/0001437749-22-012266.txt",
                    "type": " ",
                    "size": "7332331"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "6",
                    "description": "XBRL TAXONOMY EXTENSION SCHEMA",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/pfbx-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "50180"
                },
                {
                    "sequence": "7",
                    "description": "XBRL TAXONOMY EXTENSION CALCULATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/pfbx-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "41907"
                },
                {
                    "sequence": "8",
                    "description": "XBRL TAXONOMY EXTENSION DEFINITION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/pfbx-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "331608"
                },
                {
                    "sequence": "9",
                    "description": "XBRL TAXONOMY EXTENSION LABEL LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/pfbx-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "282782"
                },
                {
                    "sequence": "10",
                    "description": "XBRL TAXONOMY EXTENSION PRESENTATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/pfbx-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "357643"
                },
                {
                    "sequence": "59",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/770460/000143774922012266/pfbx20220331_10q_htm.xml",
                    "type": "XML",
                    "size": "1741388"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "8e8d90a412887e69fc84ee7db0281bdb",
            "accessionNo": "0001493152-22-013219",
            "cik": "1654672",
            "ticker": "PNPL",
            "companyName": "PINEAPPLE, INC.",
            "companyNameLong": "PINEAPPLE, INC. (Filer)",
            "formType": "NT 10-Q",
            "description": "Form NT 10-Q - Notification of inability to timely file Form 10-Q or 10-QSB",
            "filedAt": "2022-05-13T10:53:14-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1654672/000149315222013219/0001493152-22-013219.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1654672/000149315222013219/0001493152-22-013219-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1654672/000149315222013219/formnt10-q.htm",
            "entities": [
                {
                    "companyName": "PINEAPPLE, INC. (Filer)",
                    "cik": "1654672",
                    "irsNo": "475185484",
                    "stateOfIncorporation": "NV",
                    "fiscalYearEnd": "1231",
                    "type": "NT 10-Q",
                    "act": "34",
                    "fileNo": "000-55896",
                    "filmNo": "22920942",
                    "sic": "8742 Services-Management Consulting Services"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1654672/000149315222013219/formnt10-q.htm",
                    "type": "NT 10-Q",
                    "size": "28084"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1654672/000149315222013219/0001493152-22-013219.txt",
                    "type": " ",
                    "size": "29234"
                }
            ],
            "dataFiles": [],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31",
            "effectivenessDate": "2022-05-13"
        },
        {
            "id": "ab63ae54146133dcdf341982b90a8f81",
            "accessionNo": "0001558370-22-008678",
            "cik": "1847398",
            "ticker": "NECB",
            "companyName": "NorthEast Community Bancorp, Inc./MD/",
            "companyNameLong": "NorthEast Community Bancorp, Inc./MD/ (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:26:20-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/0001558370-22-008678.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/0001558370-22-008678-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331x10q.htm",
            "entities": [
                {
                    "companyName": "NorthEast Community Bancorp, Inc./MD/ (Filer)",
                    "cik": "1847398",
                    "irsNo": "000000000",
                    "stateOfIncorporation": "MD",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-40589",
                    "filmNo": "22920829",
                    "sic": "6036 Savings Institutions, Not Federally Chartered"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1847398/000155837022008678/necb-20220331x10q.htm",
                    "type": "10-Q",
                    "size": "3185089"
                },
                {
                    "sequence": "2",
                    "description": "EX-31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331xex31d1.htm",
                    "type": "EX-31.1",
                    "size": "13682"
                },
                {
                    "sequence": "3",
                    "description": "EX-31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331xex31d2.htm",
                    "type": "EX-31.2",
                    "size": "14901"
                },
                {
                    "sequence": "4",
                    "description": "EX-32.0",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331xex32d0.htm",
                    "type": "EX-32.0",
                    "size": "14074"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/0001558370-22-008678.txt",
                    "type": " ",
                    "size": "14830213"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "5",
                    "description": "EX-101.SCH",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "60420"
                },
                {
                    "sequence": "6",
                    "description": "EX-101.CAL",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "99070"
                },
                {
                    "sequence": "7",
                    "description": "EX-101.DEF",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "246121"
                },
                {
                    "sequence": "8",
                    "description": "EX-101.LAB",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "564562"
                },
                {
                    "sequence": "9",
                    "description": "EX-101.PRE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "457850"
                },
                {
                    "sequence": "80",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1847398/000155837022008678/necb-20220331x10q_htm.xml",
                    "type": "XML",
                    "size": "4149514"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "aba8387fe6b4c13ab8a6ab5ccc786b4b",
            "accessionNo": "0001654954-22-006685",
            "cik": "81157",
            "ticker": "PGAI",
            "companyName": "PGI INC",
            "companyNameLong": "PGI INC (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:22:34-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/0001654954-22-006685.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/0001654954-22-006685-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai_10k.htm",
            "entities": [
                {
                    "companyName": "PGI INC (Filer)",
                    "cik": "81157",
                    "irsNo": "590867335",
                    "stateOfIncorporation": "FL",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-06471",
                    "filmNo": "22920817",
                    "sic": "6500 Real Estate"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "FORM 10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/81157/000165495422006685/pgai_10k.htm",
                    "type": "10-Q",
                    "size": "342150"
                },
                {
                    "sequence": "2",
                    "description": "CERTIFICATION",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai_31i1.htm",
                    "type": "EX-31.1",
                    "size": "11094"
                },
                {
                    "sequence": "3",
                    "description": "CERTIFICATION",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai_31i2.htm",
                    "type": "EX-31.2",
                    "size": "11405"
                },
                {
                    "sequence": "4",
                    "description": "CERTIFICATION",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai_321.htm",
                    "type": "EX-32.1",
                    "size": "4863"
                },
                {
                    "sequence": "5",
                    "description": "CERTIFICATION",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai_322.htm",
                    "type": "EX-32.2",
                    "size": "4878"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/0001654954-22-006685.txt",
                    "type": " ",
                    "size": "1561206"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "6",
                    "description": "XBRL TAXONOMY EXTENSION SCHEMA",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "20271"
                },
                {
                    "sequence": "7",
                    "description": "XBRL TAXONOMY EXTENSION LABEL LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "95566"
                },
                {
                    "sequence": "8",
                    "description": "XBRL TAXONOMY EXTENSION CALCULATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "20915"
                },
                {
                    "sequence": "9",
                    "description": "XBRL TAXONOMY EXTENSION PRESENTATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "73369"
                },
                {
                    "sequence": "10",
                    "description": "XBRL TAXONOMY EXTENSION DEFINITION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "16013"
                },
                {
                    "sequence": "37",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/81157/000165495422006685/pgai_10k_htm.xml",
                    "type": "XML",
                    "size": "185003"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "3b61c95a08781f5d7db3e5005bddeb17",
            "accessionNo": "0001437749-22-012261",
            "cik": "1698022",
            "ticker": "FMFG",
            "companyName": "Farmers & Merchants Bancshares, Inc.",
            "companyNameLong": "Farmers & Merchants Bancshares, Inc. (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:19:36-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/0001437749-22-012261.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/0001437749-22-012261-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/fmfg20220331_10q.htm",
            "entities": [
                {
                    "companyName": "Farmers & Merchants Bancshares, Inc. (Filer)",
                    "cik": "1698022",
                    "irsNo": "813605835",
                    "stateOfIncorporation": "MD",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "000-55756",
                    "filmNo": "22920802",
                    "sic": "6036 Savings Institutions, Not Federally Chartered"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "FORM 10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1698022/000143774922012261/fmfg20220331_10q.htm",
                    "type": "10-Q",
                    "size": "2351632"
                },
                {
                    "sequence": "2",
                    "description": "EXHIBIT 31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/ex_372323.htm",
                    "type": "EX-31.1",
                    "size": "12425"
                },
                {
                    "sequence": "3",
                    "description": "EXHIBIT 31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/ex_372324.htm",
                    "type": "EX-31.2",
                    "size": "12680"
                },
                {
                    "sequence": "4",
                    "description": "EXHIBIT 32",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/ex_372325.htm",
                    "type": "EX-32",
                    "size": "6440"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/0001437749-22-012261.txt",
                    "type": " ",
                    "size": "10204145"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "5",
                    "description": "XBRL TAXONOMY EXTENSION SCHEMA",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/fmfg-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "53244"
                },
                {
                    "sequence": "6",
                    "description": "XBRL TAXONOMY EXTENSION CALCULATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/fmfg-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "70052"
                },
                {
                    "sequence": "7",
                    "description": "XBRL TAXONOMY EXTENSION DEFINITION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/fmfg-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "399506"
                },
                {
                    "sequence": "8",
                    "description": "XBRL TAXONOMY EXTENSION LABEL LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/fmfg-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "384182"
                },
                {
                    "sequence": "9",
                    "description": "XBRL TAXONOMY EXTENSION PRESENTATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/fmfg-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "431771"
                },
                {
                    "sequence": "62",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1698022/000143774922012261/fmfg20220331_10q_htm.xml",
                    "type": "XML",
                    "size": "2498627"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "7c86b1051acca7d4cc2d6058bba0afb8",
            "accessionNo": "0001843716-22-000009",
            "cik": "1843716",
            "ticker": "PSPC",
            "companyName": "Post Holdings Partnering Corp",
            "companyNameLong": "Post Holdings Partnering Corp (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:19:31-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/0001843716-22-000009.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/0001843716-22-000009-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/pspc-20220331.htm",
            "entities": [
                {
                    "companyName": "Post Holdings Partnering Corp (Filer)",
                    "cik": "1843716",
                    "irsNo": "000000000",
                    "stateOfIncorporation": "DE",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-40441",
                    "filmNo": "22920801",
                    "sic": "6770 Blank Checks"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1843716/000184371622000009/pspc-20220331.htm",
                    "type": "10-Q",
                    "size": "716788"
                },
                {
                    "sequence": "2",
                    "description": "CERTIFICATION OF PRESIDENT AND CHIEF INVESTMENT OFFICER",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/phpcq12022ex311.htm",
                    "type": "EX-31.1",
                    "size": "11326"
                },
                {
                    "sequence": "3",
                    "description": "CERTIFICATION OF CHIEF FINANCIAL OFFICER",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/phpcq12022ex312.htm",
                    "type": "EX-31.2",
                    "size": "11115"
                },
                {
                    "sequence": "4",
                    "description": "906 CERTIFICATION",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/phpcq12022ex321.htm",
                    "type": "EX-32.1",
                    "size": "15611"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/0001843716-22-000009.txt",
                    "type": " ",
                    "size": "3446780"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "5",
                    "description": "XBRL TAXONOMY EXTENSION SCHEMA DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/pspc-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "27498"
                },
                {
                    "sequence": "6",
                    "description": "XBRL TAXONOMY EXTENSION CALCULATION LINKBASE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/pspc-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "24166"
                },
                {
                    "sequence": "7",
                    "description": "XBRL TAXONOMY EXTENSION DEFINITION LINKBASE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/pspc-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "154719"
                },
                {
                    "sequence": "8",
                    "description": "XBRL TAXONOMY EXTENSION LABEL LINKBASE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/pspc-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "278248"
                },
                {
                    "sequence": "9",
                    "description": "XBRL TAXONOMY EXTENSION PRESENTATION LINKBASE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/pspc-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "211204"
                },
                {
                    "sequence": "37",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1843716/000184371622000009/pspc-20220331_htm.xml",
                    "type": "XML",
                    "size": "531584"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "a7849a94f2bd4dbee09a9cfc4a72438b",
            "accessionNo": "0001558370-22-008674",
            "cik": "1640982",
            "ticker": "",
            "companyName": "ATEL 17, LLC",
            "companyNameLong": "ATEL 17, LLC (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:10:58-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/0001558370-22-008674.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/0001558370-22-008674-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331x10q.htm",
            "entities": [
                {
                    "companyName": "ATEL 17, LLC (Filer)",
                    "cik": "1640982",
                    "irsNo": "000000000",
                    "stateOfIncorporation": "CA",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "333-203841",
                    "filmNo": "22920774",
                    "sic": "7359 Services-Equipment Rental &amp; Leasing, NEC"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1640982/000155837022008674/tmb-20220331x10q.htm",
                    "type": "10-Q",
                    "size": "1208096"
                },
                {
                    "sequence": "2",
                    "description": "EX-31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331xex31d1.htm",
                    "type": "EX-31.1",
                    "size": "12420"
                },
                {
                    "sequence": "3",
                    "description": "EX-31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331xex31d2.htm",
                    "type": "EX-31.2",
                    "size": "12427"
                },
                {
                    "sequence": "4",
                    "description": "EX-32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331xex32d1.htm",
                    "type": "EX-32.1",
                    "size": "7175"
                },
                {
                    "sequence": "5",
                    "description": "EX-32.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331xex32d2.htm",
                    "type": "EX-32.2",
                    "size": "7270"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/0001558370-22-008674.txt",
                    "type": " ",
                    "size": "5566276"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "6",
                    "description": "EX-101.SCH",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "52902"
                },
                {
                    "sequence": "7",
                    "description": "EX-101.CAL",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "72002"
                },
                {
                    "sequence": "8",
                    "description": "EX-101.DEF",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "138665"
                },
                {
                    "sequence": "9",
                    "description": "EX-101.LAB",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "314210"
                },
                {
                    "sequence": "10",
                    "description": "EX-101.PRE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "281050"
                },
                {
                    "sequence": "54",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1640982/000155837022008674/tmb-20220331x10q_htm.xml",
                    "type": "XML",
                    "size": "1068858"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "ff3e68e2fb8e7602b8a8cd200a065261",
            "accessionNo": "0001493152-22-013210",
            "cik": "1171008",
            "ticker": "ADMG",
            "companyName": "ADAMANT DRI PROCESSING & MINERALS GROUP",
            "companyNameLong": "ADAMANT DRI PROCESSING & MINERALS GROUP (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:08:47-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/0001493152-22-013210.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/0001493152-22-013210-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/form10-q.htm",
            "entities": [
                {
                    "companyName": "ADAMANT DRI PROCESSING & MINERALS GROUP (Filer)",
                    "cik": "1171008",
                    "irsNo": "000000000",
                    "stateOfIncorporation": "NV",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "000-49729",
                    "filmNo": "22920762",
                    "sic": "1000 Metal Mining"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1171008/000149315222013210/form10-q.htm",
                    "type": "10-Q",
                    "size": "456576"
                },
                {
                    "sequence": "2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/ex31-1.htm",
                    "type": "EX-31.1",
                    "size": "12834"
                },
                {
                    "sequence": "3",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/ex32-1.htm",
                    "type": "EX-32.1",
                    "size": "7797"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/0001493152-22-013210.txt",
                    "type": " ",
                    "size": "1905534"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "4",
                    "description": "XBRL SCHEMA FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/admg-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "14888"
                },
                {
                    "sequence": "5",
                    "description": "XBRL CALCULATION FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/admg-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "22293"
                },
                {
                    "sequence": "6",
                    "description": "XBRL DEFINITION FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/admg-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "28805"
                },
                {
                    "sequence": "7",
                    "description": "XBRL LABEL FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/admg-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "130765"
                },
                {
                    "sequence": "8",
                    "description": "XBRL PRESENTATION FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/admg-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "96436"
                },
                {
                    "sequence": "33",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1171008/000149315222013210/form10-q_htm.xml",
                    "type": "XML",
                    "size": "180649"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "16797a3bfd66f39107ef45db79f447b6",
            "accessionNo": "0001558370-22-008672",
            "cik": "1575048",
            "ticker": "",
            "companyName": "ATEL 16, LLC",
            "companyNameLong": "ATEL 16, LLC (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:08:02-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/0001558370-22-008672.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/0001558370-22-008672-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331x10q.htm",
            "entities": [
                {
                    "companyName": "ATEL 16, LLC (Filer)",
                    "cik": "1575048",
                    "irsNo": "900920813",
                    "stateOfIncorporation": "CA",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "000-55417",
                    "filmNo": "22920758",
                    "sic": "7359 Services-Equipment Rental &amp; Leasing, NEC"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1575048/000155837022008672/tmb-20220331x10q.htm",
                    "type": "10-Q",
                    "size": "1557020"
                },
                {
                    "sequence": "2",
                    "description": "EX-31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331xex31d1.htm",
                    "type": "EX-31.1",
                    "size": "10323"
                },
                {
                    "sequence": "3",
                    "description": "EX-31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331xex31d2.htm",
                    "type": "EX-31.2",
                    "size": "10201"
                },
                {
                    "sequence": "4",
                    "description": "EX-32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331xex32d1.htm",
                    "type": "EX-32.1",
                    "size": "7264"
                },
                {
                    "sequence": "5",
                    "description": "EX-32.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331xex32d2.htm",
                    "type": "EX-32.2",
                    "size": "7305"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/0001558370-22-008672.txt",
                    "type": " ",
                    "size": "7558551"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "6",
                    "description": "EX-101.SCH",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "64407"
                },
                {
                    "sequence": "7",
                    "description": "EX-101.CAL",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "73339"
                },
                {
                    "sequence": "8",
                    "description": "EX-101.DEF",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "210978"
                },
                {
                    "sequence": "9",
                    "description": "EX-101.LAB",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "378909"
                },
                {
                    "sequence": "10",
                    "description": "EX-101.PRE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "350840"
                },
                {
                    "sequence": "66",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1575048/000155837022008672/tmb-20220331x10q_htm.xml",
                    "type": "XML",
                    "size": "1681062"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "cb3328dc4a96124eb522a6f1d0203cdf",
            "accessionNo": "0001437749-22-012260",
            "cik": "1001907",
            "ticker": "ASTC",
            "companyName": "ASTROTECH Corp",
            "companyNameLong": "ASTROTECH Corp (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:04:56-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/0001437749-22-012260.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/0001437749-22-012260-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/astc20220331_10q.htm",
            "entities": [
                {
                    "companyName": "ASTROTECH Corp (Filer)",
                    "cik": "1001907",
                    "irsNo": "911273737",
                    "stateOfIncorporation": "DE",
                    "fiscalYearEnd": "0630",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-34426",
                    "filmNo": "22920739",
                    "sic": "3826 Laboratory Analytical Instruments"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "FORM 10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1001907/000143774922012260/astc20220331_10q.htm",
                    "type": "10-Q",
                    "size": "1071035"
                },
                {
                    "sequence": "2",
                    "description": "EXHIBIT 31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/ex_342909.htm",
                    "type": "EX-31.1",
                    "size": "12642"
                },
                {
                    "sequence": "3",
                    "description": "EXHIBIT 31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/ex_342910.htm",
                    "type": "EX-31.2",
                    "size": "12891"
                },
                {
                    "sequence": "4",
                    "description": "EXHIBIT 32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/ex_342911.htm",
                    "type": "EX-32.1",
                    "size": "6422"
                },
                {
                    "sequence": "10",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/logo.jpg",
                    "type": "GRAPHIC",
                    "size": "10990"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/0001437749-22-012260.txt",
                    "type": " ",
                    "size": "5494279"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "5",
                    "description": "XBRL TAXONOMY EXTENSION SCHEMA",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/astc-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "54099"
                },
                {
                    "sequence": "6",
                    "description": "XBRL TAXONOMY EXTENSION CALCULATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/astc-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "43130"
                },
                {
                    "sequence": "7",
                    "description": "XBRL TAXONOMY EXTENSION DEFINITION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/astc-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "338789"
                },
                {
                    "sequence": "8",
                    "description": "XBRL TAXONOMY EXTENSION LABEL LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/astc-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "317884"
                },
                {
                    "sequence": "9",
                    "description": "XBRL TAXONOMY EXTENSION PRESENTATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/astc-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "372505"
                },
                {
                    "sequence": "63",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1001907/000143774922012260/astc20220331_10q_htm.xml",
                    "type": "XML",
                    "size": "859356"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "2934b548127f2bd7ca4ad3b5b7318b78",
            "accessionNo": "0001104659-22-059984",
            "cik": "1832010",
            "ticker": "OMEG",
            "companyName": "Omega Alpha SPAC",
            "companyNameLong": "Omega Alpha SPAC (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:04:53-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/0001104659-22-059984.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/0001104659-22-059984-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331x10q.htm",
            "entities": [
                {
                    "companyName": "Omega Alpha SPAC (Filer)",
                    "cik": "1832010",
                    "irsNo": "981566615",
                    "stateOfIncorporation": "E9",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-39840",
                    "filmNo": "22920738",
                    "sic": "6770 Blank Checks"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "FORM 10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1832010/000110465922059984/omeg-20220331x10q.htm",
                    "type": "10-Q",
                    "size": "709972"
                },
                {
                    "sequence": "2",
                    "description": "EXHIBIT-31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331xex31d1.htm",
                    "type": "EX-31.1",
                    "size": "12645"
                },
                {
                    "sequence": "3",
                    "description": "EXHIBIT-31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331xex31d2.htm",
                    "type": "EX-31.2",
                    "size": "12657"
                },
                {
                    "sequence": "4",
                    "description": "EXHIBIT-32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331xex32d1.htm",
                    "type": "EX-32.1",
                    "size": "6702"
                },
                {
                    "sequence": "5",
                    "description": "EXHIBIT-32.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331xex32d2.htm",
                    "type": "EX-32.2",
                    "size": "6714"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/0001104659-22-059984.txt",
                    "type": " ",
                    "size": "3494524"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "6",
                    "description": "XBRL TAXONOMY EXTENSION SCHEMA",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "32930"
                },
                {
                    "sequence": "7",
                    "description": "XBRL TAXONOMY EXTENSION CALCULATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "19404"
                },
                {
                    "sequence": "8",
                    "description": "XBRL TAXONOMY EXTENSION DEFINITION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "145953"
                },
                {
                    "sequence": "9",
                    "description": "XBRL TAXONOMY EXTENSION LABEL LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "246927"
                },
                {
                    "sequence": "10",
                    "description": "XBRL TAXONOMY EXTENSION PRESENTATION LINKBASE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "213004"
                },
                {
                    "sequence": "41",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1832010/000110465922059984/omeg-20220331x10q_htm.xml",
                    "type": "XML",
                    "size": "449165"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "790d10e6cc234e78af41d1bc9acc5472",
            "accessionNo": "0001558370-22-008670",
            "cik": "1519117",
            "ticker": "",
            "companyName": "ATEL 15, LLC",
            "companyNameLong": "ATEL 15, LLC (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:03:41-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/0001558370-22-008670.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/0001558370-22-008670-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331x10q.htm",
            "entities": [
                {
                    "companyName": "ATEL 15, LLC (Filer)",
                    "cik": "1519117",
                    "irsNo": "451625956",
                    "stateOfIncorporation": "CA",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "000-54931",
                    "filmNo": "22920734",
                    "sic": "7359 Services-Equipment Rental &amp; Leasing, NEC"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1519117/000155837022008670/tmb-20220331x10q.htm",
                    "type": "10-Q",
                    "size": "1249450"
                },
                {
                    "sequence": "2",
                    "description": "EX-31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331xex31d1.htm",
                    "type": "EX-31.1",
                    "size": "11991"
                },
                {
                    "sequence": "3",
                    "description": "EX-31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331xex31d2.htm",
                    "type": "EX-31.2",
                    "size": "11909"
                },
                {
                    "sequence": "4",
                    "description": "EX-32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331xex32d1.htm",
                    "type": "EX-32.1",
                    "size": "7205"
                },
                {
                    "sequence": "5",
                    "description": "EX-32.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331xex32d2.htm",
                    "type": "EX-32.2",
                    "size": "7272"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/0001558370-22-008670.txt",
                    "type": " ",
                    "size": "5627090"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "6",
                    "description": "EX-101.SCH",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "47655"
                },
                {
                    "sequence": "7",
                    "description": "EX-101.CAL",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "54151"
                },
                {
                    "sequence": "8",
                    "description": "EX-101.DEF",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "147299"
                },
                {
                    "sequence": "9",
                    "description": "EX-101.LAB",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "335103"
                },
                {
                    "sequence": "10",
                    "description": "EX-101.PRE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "259341"
                },
                {
                    "sequence": "53",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1519117/000155837022008670/tmb-20220331x10q_htm.xml",
                    "type": "XML",
                    "size": "1159629"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "06daf9a7ce0af7ba10fabb230a37580d",
            "accessionNo": "0001493152-22-013206",
            "cik": "1865120",
            "ticker": "BRAC",
            "companyName": "Broad Capital Acquisition Corp",
            "companyNameLong": "Broad Capital Acquisition Corp (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:02:09-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/0001493152-22-013206.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/0001493152-22-013206-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/form10-q.htm",
            "entities": [
                {
                    "companyName": "Broad Capital Acquisition Corp (Filer)",
                    "cik": "1865120",
                    "irsNo": "863382967",
                    "stateOfIncorporation": "DE",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-41212",
                    "filmNo": "22920731",
                    "sic": "6770 Blank Checks"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1865120/000149315222013206/form10-q.htm",
                    "type": "10-Q",
                    "size": "476111"
                },
                {
                    "sequence": "2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/ex31-1.htm",
                    "type": "EX-31.1",
                    "size": "11492"
                },
                {
                    "sequence": "3",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/ex31-2.htm",
                    "type": "EX-31.2",
                    "size": "11440"
                },
                {
                    "sequence": "4",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/ex32-1.htm",
                    "type": "EX-32.1",
                    "size": "5759"
                },
                {
                    "sequence": "5",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/ex32-2.htm",
                    "type": "EX-32.2",
                    "size": "5789"
                },
                {
                    "sequence": "6",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/form10-q_001.jpg",
                    "type": "GRAPHIC",
                    "size": "1721"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/0001493152-22-013206.txt",
                    "type": " ",
                    "size": "2351869"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "7",
                    "description": "XBRL SCHEMA FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/brac-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "22424"
                },
                {
                    "sequence": "8",
                    "description": "XBRL CALCULATION FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/brac-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "22985"
                },
                {
                    "sequence": "9",
                    "description": "XBRL DEFINITION FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/brac-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "95014"
                },
                {
                    "sequence": "10",
                    "description": "XBRL LABEL FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/brac-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "176136"
                },
                {
                    "sequence": "11",
                    "description": "XBRL PRESENTATION FILE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/brac-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "139398"
                },
                {
                    "sequence": "34",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1865120/000149315222013206/form10-q_htm.xml",
                    "type": "XML",
                    "size": "205536"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "3ed7bb9ef5ded3281e1e1a6137595645",
            "accessionNo": "0001558370-22-008668",
            "cik": "1463389",
            "ticker": "",
            "companyName": "ATEL 14, LLC",
            "companyNameLong": "ATEL 14, LLC (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T10:00:39-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/0001558370-22-008668.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/0001558370-22-008668-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331x10q.htm",
            "entities": [
                {
                    "companyName": "ATEL 14, LLC (Filer)",
                    "cik": "1463389",
                    "irsNo": "264695354",
                    "stateOfIncorporation": "CA",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "000-54356",
                    "filmNo": "22920724",
                    "sic": "7359 Services-Equipment Rental &amp; Leasing, NEC"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1463389/000155837022008668/tmb-20220331x10q.htm",
                    "type": "10-Q",
                    "size": "1226571"
                },
                {
                    "sequence": "2",
                    "description": "EX-31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331xex31d1.htm",
                    "type": "EX-31.1",
                    "size": "12058"
                },
                {
                    "sequence": "3",
                    "description": "EX-31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331xex31d2.htm",
                    "type": "EX-31.2",
                    "size": "12117"
                },
                {
                    "sequence": "4",
                    "description": "EX-32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331xex32d1.htm",
                    "type": "EX-32.1",
                    "size": "7247"
                },
                {
                    "sequence": "5",
                    "description": "EX-32.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331xex32d2.htm",
                    "type": "EX-32.2",
                    "size": "7310"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/0001558370-22-008668.txt",
                    "type": " ",
                    "size": "5538975"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "6",
                    "description": "EX-101.SCH",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "47485"
                },
                {
                    "sequence": "7",
                    "description": "EX-101.CAL",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "55897"
                },
                {
                    "sequence": "8",
                    "description": "EX-101.DEF",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "152427"
                },
                {
                    "sequence": "9",
                    "description": "EX-101.LAB",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "283284"
                },
                {
                    "sequence": "10",
                    "description": "EX-101.PRE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "262727"
                },
                {
                    "sequence": "53",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1463389/000155837022008668/tmb-20220331x10q_htm.xml",
                    "type": "XML",
                    "size": "1140413"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "9988b5d289fe3bc638b0f87cd55a83cd",
            "accessionNo": "0001213900-22-026194",
            "cik": "1536394",
            "ticker": "USLG",
            "companyName": "U.S. Lighting Group, Inc.",
            "companyNameLong": "U.S. Lighting Group, Inc. (Filer)",
            "formType": "NT 10-Q",
            "description": "Form NT 10-Q - Notification of inability to timely file Form 10-Q or 10-QSB",
            "filedAt": "2022-05-13T09:57:52-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1536394/000121390022026194/0001213900-22-026194.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1536394/000121390022026194/0001213900-22-026194-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1536394/000121390022026194/ea159915-nt10q_uslighting.htm",
            "entities": [
                {
                    "companyName": "U.S. Lighting Group, Inc. (Filer)",
                    "cik": "1536394",
                    "irsNo": "200347908",
                    "stateOfIncorporation": "FL",
                    "fiscalYearEnd": "1231",
                    "type": "NT 10-Q",
                    "act": "34",
                    "fileNo": "000-55689",
                    "filmNo": "22920721",
                    "sic": "3640 Electric Lighting &amp; Wiring Equipment"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "NOTIFICATION OF LATE FILING",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1536394/000121390022026194/ea159915-nt10q_uslighting.htm",
                    "type": "NT 10-Q",
                    "size": "18671"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1536394/000121390022026194/0001213900-22-026194.txt",
                    "type": " ",
                    "size": "19797"
                }
            ],
            "dataFiles": [],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31",
            "effectivenessDate": "2022-05-13"
        },
        {
            "id": "b032057d6b6abf7f113645c5227f6b89",
            "accessionNo": "0001410578-22-001421",
            "cik": "75340",
            "ticker": "PFIN",
            "companyName": "P&F INDUSTRIES INC",
            "companyNameLong": "P&F INDUSTRIES INC (Filer)",
            "formType": "10-Q",
            "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
            "filedAt": "2022-05-13T09:52:29-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/0001410578-22-001421.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/0001410578-22-001421-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331x10q.htm",
            "entities": [
                {
                    "companyName": "P&F INDUSTRIES INC (Filer)",
                    "cik": "75340",
                    "irsNo": "221657413",
                    "stateOfIncorporation": "DE",
                    "fiscalYearEnd": "1231",
                    "type": "10-Q",
                    "act": "34",
                    "fileNo": "001-05332",
                    "filmNo": "22920701",
                    "sic": "3540 Metalworkg Machinery &amp; Equipment"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "description": "10-Q",
                    "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/75340/000141057822001421/tmb-20220331x10q.htm",
                    "type": "10-Q",
                    "size": "1363927"
                },
                {
                    "sequence": "2",
                    "description": "EX-31.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331xex31d1.htm",
                    "type": "EX-31.1",
                    "size": "14403"
                },
                {
                    "sequence": "3",
                    "description": "EX-31.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331xex31d2.htm",
                    "type": "EX-31.2",
                    "size": "14217"
                },
                {
                    "sequence": "4",
                    "description": "EX-32.1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331xex32d1.htm",
                    "type": "EX-32.1",
                    "size": "5581"
                },
                {
                    "sequence": "5",
                    "description": "EX-32.2",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331xex32d2.htm",
                    "type": "EX-32.2",
                    "size": "5794"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/0001410578-22-001421.txt",
                    "type": " ",
                    "size": "5465813"
                }
            ],
            "dataFiles": [
                {
                    "sequence": "6",
                    "description": "EX-101.SCH",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331.xsd",
                    "type": "EX-101.SCH",
                    "size": "31704"
                },
                {
                    "sequence": "7",
                    "description": "EX-101.CAL",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331_cal.xml",
                    "type": "EX-101.CAL",
                    "size": "51512"
                },
                {
                    "sequence": "8",
                    "description": "EX-101.DEF",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331_def.xml",
                    "type": "EX-101.DEF",
                    "size": "125114"
                },
                {
                    "sequence": "9",
                    "description": "EX-101.LAB",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331_lab.xml",
                    "type": "EX-101.LAB",
                    "size": "276711"
                },
                {
                    "sequence": "10",
                    "description": "EX-101.PRE",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331_pre.xml",
                    "type": "EX-101.PRE",
                    "size": "234146"
                },
                {
                    "sequence": "53",
                    "description": "EXTRACTED XBRL INSTANCE DOCUMENT",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/75340/000141057822001421/tmb-20220331x10q_htm.xml",
                    "type": "XML",
                    "size": "999161"
                }
            ],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31"
        },
        {
            "id": "9f86988c2df0a67112b31c7f017c1318",
            "accessionNo": "0001493152-22-013202",
            "cik": "1435617",
            "ticker": "",
            "companyName": "POWERDYNE INTERNATIONAL, INC.",
            "companyNameLong": "POWERDYNE INTERNATIONAL, INC. (Filer)",
            "formType": "NT 10-Q",
            "description": "Form NT 10-Q - Notification of inability to timely file Form 10-Q or 10-QSB",
            "filedAt": "2022-05-13T09:36:22-04:00",
            "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1435617/000149315222013202/0001493152-22-013202.txt",
            "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1435617/000149315222013202/0001493152-22-013202-index.htm",
            "linkToXbrl": "",
            "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1435617/000149315222013202/formnt10-q.htm",
            "entities": [
                {
                    "companyName": "POWERDYNE INTERNATIONAL, INC. (Filer)",
                    "cik": "1435617",
                    "irsNo": "205572576",
                    "stateOfIncorporation": "DE",
                    "fiscalYearEnd": "1231",
                    "type": "NT 10-Q",
                    "act": "34",
                    "fileNo": "000-53259",
                    "filmNo": "22920629",
                    "sic": "7374 Services-Computer Processing &amp; Data Preparation"
                }
            ],
            "documentFormatFiles": [
                {
                    "sequence": "1",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1435617/000149315222013202/formnt10-q.htm",
                    "type": "NT 10-Q",
                    "size": "29037"
                },
                {
                    "sequence": " ",
                    "description": "Complete submission text file",
                    "documentUrl": "https://www.sec.gov/Archives/edgar/data/1435617/000149315222013202/0001493152-22-013202.txt",
                    "type": " ",
                    "size": "30278"
                }
            ],
            "dataFiles": [],
            "seriesAndClassesContractsInformation": [],
            "periodOfReport": "2022-03-31",
            "effectivenessDate": "2022-05-13"
        }
    ]
