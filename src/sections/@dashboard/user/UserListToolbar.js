import PropTypes from 'prop-types';
// material
import {useEffect,useState} from "react";
import {styled} from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, CircularProgress} from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

import {useDispatch, useSelector} from "react-redux";
import {getAuth} from "firebase/auth";
import {doc, arrayUnion,updateDoc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {db} from "../../../firebase";

import {serverTimestamp} from "firebase/firestore";
import {setResponse} from "../../../app/slices/userSlice";
import {useQuery} from "react-query";

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
    clearSelection: PropTypes.func,
};

export default function UserListToolbar({clearSelection,selected, numSelected, filterName, onFilterName}) {

    const user = useSelector(state => state.user)
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const {
        userData: {
            uid,
            phone
        }
    } = user


    //const washingtonRef = db.collection('cities').doc('DC');


    const {data} = useQuery('watchlist-q', () => getDoc(doc(db, 'watchlist', uid)),{

    })

    const addWatchList = async () => {
        const docRef = doc(db, "watchlist", uid);
        setLoading(true)
        if(!data?.data()) {


            await setDoc(docRef, {
                tickers: arrayUnion(...selected),
                createdAt: serverTimestamp(),
                sendText: true,
                phone
            }).then(r => {
                    dispatch(setResponse({
                        responseMessage: 'Items added to watchlist',
                        responseState: true,
                        responseType: 'info',
                    }))
                    clearSelection()
                    setLoading(false)
                }
            )
                .catch(err => {
                    clearSelection()
                    setLoading(false)
                })
        }else{
            if(data?.data().tickers.length>99){
                dispatch(setResponse({
                    responseMessage: 'Maximum watchlist reached!',
                    responseState: true,
                    responseType: 'error',
                }))
            }else {
                await updateDoc(docRef, {
                    tickers: arrayUnion(...selected),
                    createdAt: serverTimestamp(),

                }).then(r => {
                        dispatch(setResponse({
                            responseMessage: 'Items added to watchlist',
                            responseState: true,
                            responseType: 'info',
                        }))
                        clearSelection()
                        setLoading(false)
                    }
                )
                    .catch(err => {
                        clearSelection()
                        setLoading(false)
                    })
            }
        }
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
                    <IconButton disabled={loading} onClick={addWatchList}>
                        {loading ?  <CircularProgress color="secondary" size={30}/> :  <Iconify icon="eva:plus-square-fill"/> }
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Action">
                    <IconButton>
             {/*           <Iconify icon="ic:round-filter-list"/>*/}
                    </IconButton>
                </Tooltip>
            )}
        </RootStyle>
    );
}
