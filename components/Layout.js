import React, {useContext, useEffect, useState} from 'react';
import Head from "next/head";
import NextLink from 'next/link'
import {
	AppBar,
	Badge,
	Box,
	Button,
	Container,
	CssBaseline,
	Link,
	Menu, MenuItem,
	Switch,
	Toolbar,
	Typography
} from "@mui/material";
import useStyles from "../utility/styles";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Store} from "../utility/Store";
import Cookies from 'js-cookie'
import {useRouter} from "next/router";

const Layout = ({children, title, desc}) => {
	const router = useRouter()
	const {state, dispatch} = useContext(Store)
	const {darkMode, cart, userInfo} = state

	useEffect(() => {
		const checkCookies = Cookies.get('darkMode') === 'ON'
		dispatch({type: checkCookies ? 'DARK_MODE_ON' : 'DARK_MODE_OFF'})
	}, [])

	useEffect(() => {
		let first = []
		if (Cookies.get('cartItems')) {
			first = JSON.parse(Cookies.get('cartItems'))
		}
		dispatch({type: 'CART_FIRST', payload: first})
	}, [])

	useEffect(() => {
		return () => {
			if (Cookies.get('userInfo')) {
				dispatch({type: 'USER_LOGIN' , payload: JSON.parse(Cookies.get('userInfo'))})
			}
		};
	}, []);

	useEffect(() => {
		return () => {
			if(Cookies.get('shippingAddress')){
				dispatch({type: 'SAVE_SHIPPING_ADDRESS', payload: JSON.parse(Cookies.get('shippingAddress'))})
			}
		};
	}, []);


	
	const theme = createTheme({
		typography: {
			h1: {
				fontSize: '1.6rem',
				fontWeight: 400,
				margin: '1rem 0'
			},
			h2: {
				fontSize: '1.4rem',
				fontWeight: 400,
				margin: '1rem 0'
			}
		},
		palette: {
			mode: darkMode ? 'dark' : 'light',
			primary: {
				main: '#f0c000'
			},
			secondary: {
				main: '#208080'
			}
		}
	})
	const classes = useStyles

	const handleMode = () => {
		dispatch({type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON'})
		const newDarkMode = !darkMode
		Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF')
	}

	const [anchorEl, setAnchorEl ] = useState(null)
	const loginClickHandle = (e) =>{
		setAnchorEl(e.currentTarget)
	}
	const loginMenuCloseHandler = ()=>{
		setAnchorEl(null)
	}
	const logoutMenuCloseHandler = ()=>{
		setAnchorEl(null)
		dispatch({type: 'USER_LOGOUT'})
		router.push('/')
	}
	return (
		<div>
			<Head>
				<title>{title ? `${title} - Next lazona` : 'Next lazona'}</title>
				{desc && <meta name="description" content={desc}/>}
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline>
					<AppBar position="static" sx={classes.navbar}>
						<Toolbar>
							<NextLink href="/" passHref>
								<Link>
									<Typography sx={classes.brand}>Lazona</Typography>
								</Link>
							</NextLink>
							<Box sx={classes.grow}></Box>
							<div>
								<Switch checked={darkMode} onChange={handleMode}/>
								<NextLink href="/cart" passHref>
									<Link sx={{marginRight: 2}}>
										{cart.cartItems.length > 0 ? (
												<Badge
													color={"secondary"}
													badgeContent={cart.cartItems.length}>Cart</Badge>)
											: (
												'cart'
											)
										}
									</Link>
								</NextLink>
								{userInfo ? (
									<>
										<Button
											sx={classes.navbarButton}
											aria-controls={"simple-menu"}
											aria-haspopup={"true"}
											onClick={loginClickHandle}
										>
											{userInfo.name}
										</Button>
										<Menu
											id={"simple-menu"}
											anchorEl={anchorEl}
											keepMounted
											open={Boolean(anchorEl)}
											onClose={loginMenuCloseHandler}>
											<MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
											<MenuItem onClick={loginMenuCloseHandler}>My account</MenuItem>
											<MenuItem onClick={logoutMenuCloseHandler}>Logout</MenuItem>
										</Menu>
									</>
								) : (
									<NextLink href="/shipping" passHref>
										<Link>Login</Link>
									</NextLink>
								)}
							</div>
						</Toolbar>
					</AppBar>
					<Container sx={classes.main}>
						{children}
					</Container>
					<Box component="footer" sx={classes.footer}>
						<Typography>All rights reserved. Next Lazona</Typography>
					</Box>
				</CssBaseline>
			</ThemeProvider>
		</div>
	)
};

export default Layout;