import PropTypes from 'prop-types';
// material
import {styled} from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment} from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

import {useDispatch, useSelector} from "react-redux";
import {getAuth} from "firebase/auth";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {db} from "../../../firebase";
import {useEffect} from "react";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({theme}) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({theme}) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {width: 320, boxShadow: theme.customShadows.z8},
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`,
    },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
    numSelected: PropTypes.number,
    selected: PropTypes.array,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
};

export default function UserListToolbar({selected, numSelected, filterName, onFilterName}) {

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const {
        responseMessage,
        responseState,
        responseType,
        userData: {
            email,
            uid,
            lastName, firstName
        }
    } = user

    const WatchlistData = {
        tickers: [...selected],
        createdAt: Date.now()
    }
   const  tickers = getDoc(doc(db, 'watchlist',uid));
    useEffect(() => {
        tickers.then(res =>{
            console.log(res.data().createdAt)
        })

    }, []);

    //const washingtonRef = db.collection('cities').doc('DC');

    const addWatchList = () => {
        const docRef = doc(db, "watchlist", uid);

        setDoc(docRef, {...WatchlistData},{  merge: true}).then(() => {
            console.log("Added successfully")
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <RootStyle
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <SearchStyle
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="Search company..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{color: 'text.disabled', width: 20, height: 20}}/>
                        </InputAdornment>
                    }
                />
            )}

            {numSelected > 0 ? (
                <Tooltip title="Add watchlist">
                    <IconButton onClick={addWatchList}>
                        <Iconify icon="eva:plus-square-fill"/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Iconify icon="ic:round-filter-list"/>
                    </IconButton>
                </Tooltip>
            )}
        </RootStyle>
    );
}
