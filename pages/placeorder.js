import React, {useContext, useEffect, useState} from 'react';
import Layout from "../components/Layout";
import {
	Button,
	Card, CircularProgress,
	Grid,
	Link,
	List,
	ListItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from "@mui/material";
import NextLink from "next/link";
import {Store} from "../utility/Store";
import Image from "next/image";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import useStyles from "../utility/styles";
import Cookies from "js-cookie";
import CheckoutWizard from "../components/checkoutWizard";
import {useSnackbar} from "notistack";
import {getError} from "../utility/errors";
import axios from "axios";


const PlaceOrder = () => {
	const router = useRouter()
	const {state , dispatch} = useContext(Store)
	const {cart: {cartItems, shippingAddress}} = state
	const classes = useStyles
	const round2 = num => Math.round(num * 100 + Number.EPSILON) / 100
	const itemsPrice = cartItems.reduce((a, b) => a + b.price * b.quantity, 0)
	const shippingPrice = itemsPrice > 200 ? 0 : 15
	const taxPrice = round2(itemsPrice * 0.15)
	const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
	const {enqueueSnackbar, closeSnackbar} = useSnackbar()
	const userInfo = JSON.parse(Cookies.get('userInfo'))
	useEffect(() => {
		if (!Cookies.get('paymentMethod')) {
			router.push('/payment')
		}
		if(cartItems.length === 0){
			router.push('/')
		}
	}, [])

	const [loading, setLoading] = useState(false)
	const placeOrderHandler = async () => {
		closeSnackbar();
		try {
			setLoading(true)
			const {data} = await axios.post('/api/orders',
				{
					orderItems: cartItems,
					shippingAddress,
					paymentMethod: Cookies.get('paymentMethod'),
					itemsPrice,
					shippingPrice,
					taxPrice,
					totalPrice
				},{
				headers: {
					authorization: `Bearer ${userInfo.token}`
				}
				})
			dispatch({type: 'CART_CLEAR'})
			Cookies.remove('cartItems')
			setLoading(false)
			router.push(`/order/${data._id}`)
		} catch (err) {
			enqueueSnackbar(getError(err), {variant: 'error'})
		}
	}

	return (<Layout title={"Place Order"}>
		<CheckoutWizard activeStep={3}/>
		<Typography variant={"h1"} component={"h1"}>Place Order</Typography>
		<Grid container spacing={1}>
			<Grid item md={9} xs={12}>
				<Card sx={classes.section}>
					<List>
						<ListItem>
							<Typography variant={"h2"} component={"h2"}>Shipping Address</Typography>
						</ListItem>
						<ListItem>
							{shippingAddress.fullName}, {shippingAddress.address}, {' '}
							{shippingAddress.city}, {shippingAddress.postalCode}, {' '}
							{shippingAddress.country}
						</ListItem>
					</List>
				</Card>
				<Card sx={classes.section}>
					<List>
						<ListItem>
							<Typography variant={"h2"} component={"h2"}>Payment Method</Typography>
						</ListItem>
						<ListItem>
							{Cookies.get('paymentMethod')}
						</ListItem>
					</List>
				</Card>
				<Card sx={classes.section}>
					<List>
						<ListItem>
							<Typography variant={"h2"} component={"h2"}>Order Items</Typography>
						</ListItem>
						<ListItem>
							<TableContainer>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Image</TableCell>
											<TableCell>Name</TableCell>
											<TableCell align={"right"}>Quantity</TableCell>
											<TableCell align={"right"}>Price</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{cartItems.map((item) => (<TableRow key={item._id}>
											<TableCell>
												<NextLink href={`/product/${item.slug}`} passHref>
													<Link>
														<Image
															src={item.image}
															alt={item.name}
															width={50}
															height={50}/>
													</Link>
												</NextLink>
											</TableCell>
											<TableCell>
												<NextLink href={`/product/${item.slug}`} passHref>
													<Link>
														<Typography>{item.name}</Typography>
													</Link>
												</NextLink>
											</TableCell>
											<TableCell align={"right"}>
												<Typography>{item.quantity}</Typography>
											</TableCell>
											<TableCell align={"right"}><Typography>${item.price}</Typography></TableCell>
										</TableRow>))}
									</TableBody>
								</Table>
							</TableContainer>
						</ListItem>
					</List>
				</Card>
			</Grid>
			<Grid item md={3} xs={12}>
				<Card sx={classes.section}>
					<List>
						<ListItem>
							<Typography variant={"h2"}>
								Order Summary
							</Typography>
						</ListItem>
						<ListItem>
							<Grid container>
								<Grid item xs={6}><Typography>Items: </Typography></Grid>
								<Grid item xs={6}><Typography align={"right"}>${itemsPrice}</Typography></Grid>
							</Grid>
						</ListItem>
						<ListItem>
							<Grid container>
								<Grid item xs={6}><Typography>Tax: </Typography></Grid>
								<Grid item xs={6}><Typography align={"right"}>${taxPrice}</Typography></Grid>
							</Grid>
						</ListItem>
						<ListItem>
							<Grid container>
								<Grid item xs={6}><Typography>Shipping: </Typography></Grid>
								<Grid item xs={6}><Typography align={"right"}>${shippingPrice}</Typography></Grid>
							</Grid>
						</ListItem>
						<ListItem>
							<Grid container>
								<Grid item xs={6}><Typography><strong>Total: </strong></Typography></Grid>
								<Grid item xs={6}><Typography align={"right"}><strong>${totalPrice}</strong></Typography></Grid>
							</Grid>
						</ListItem>
						<ListItem>
							<Button
								variant={"contained"}
								color={"primary"}
								fullWidth
								onClick={placeOrderHandler}
							>
								Place Order
							</Button>
						</ListItem>
						{loading && (
							<ListItem>
								<CircularProgress/>
							</ListItem>
						)}
					</List>
				</Card>
			</Grid>
		</Grid>
	</Layout>);
};

export default dynamic(() => Promise.resolve(PlaceOrder), {ssr: false})
