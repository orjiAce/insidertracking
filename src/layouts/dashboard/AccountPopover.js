import {useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
// @mui
import {alpha} from '@mui/material/styles';
import {Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton} from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../app/slices/userSlice";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
    {
        label: 'Dashboard',
        icon: 'eva:home-fill',
        linkTo: '/dashboard/app',
    },
    {
        label: 'Watchlist',
        icon: 'eva:eye-fill',
        linkTo: '/dashboard/watchlist',

    },
    {
        label: 'Settings',
        icon: 'eva:settings-2-fill',
        linkTo: '/dashboard/user',
    },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const anchorRef = useRef(null);
    const dispatch = useDispatch()
    const [open, setOpen] = useState(null);

    const user = useSelector(state => state.user)

    const {
        userData: {
            email,
            phone,
            lastName, firstName
        }
    } = user
    const handleOpen = (event) => {

        setOpen(event.currentTarget);
    };

    const handleClose = () => {

        setOpen(null);
    };

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar src={account.photoURL} alt="photoURL"/>
            </IconButton>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    p: 0,
                    mt: 1.5,
                    ml: 0.75,
                    '& .MuiMenuItem-root': {
                        typography: 'body2',
                        borderRadius: 0.75,
                    },
                }}
            >
                <Box sx={{my: 1.5, px: 2.5}}>
                    <Typography variant="subtitle2" noWrap>
                        {lastName} {firstName}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                        {email}
                    </Typography>
                </Box>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <Stack sx={{p: 1}}>
                    {MENU_OPTIONS.map((option) => (
                        <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <MenuItem onClick={() => {
                    handleClose()
                    dispatch(logoutUser())
                }} sx={{m: 1}}>
                    Logout
                </MenuItem>
            </MenuPopover>
        </>
    );
}
