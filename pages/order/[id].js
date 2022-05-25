import React, {useEffect, useReducer} from 'react';
import Layout from "../../components/Layout";
import {
	Box,
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
import Image from "next/image";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import useStyles from "../../utility/styles";
import Cookies from "js-cookie";
import CheckoutWizard from "../../components/checkoutWizard";
import axios from "axios";
import {getError} from "../../utility/errors";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useSnackbar} from "notistack";

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return {...state, loading: true, error: ''}
		case 'FETCH_SUCCESS':
			return {...state, loading: false, order: action.payload, error: ''}
		case 'FETCH_FAIL':
			return {...state, loading: false, error: action.payload}
		case 'PAY_REQUEST':
			return {...state, loadingPay: true, error: ''}
		case 'PAY_SUCCESS':
			return {...state, loadingPay: false, successPay: true}
		case 'PAY_FAIL':
			return {...state, loadingPay: false, errorPay: action.payload}
		case 'PAY_RESET':
			return {...state, loadingPay: false, successPay: false, errorPay: ''}
		default:
			return state
	}
}

const Order = ({params}) => {
	const orderId = params.id
	const router = useRouter()
	const classes = useStyles
	const userInfo = JSON.parse(Cookies.get('userInfo'))
	const {enqueueSnackbar} = useSnackbar()
	const [{isPending}, paypalDispatch] = usePayPalScriptReducer()
	const [{loading, error, order, successPay}, dispatch] = useReducer(reducer, {
		loading: true,
		order: {},
		error: ''
	})
	const {
		shippingAddress,
		paymentMethod,
		itemsPrice,
		orderItems,
		taxPrice,
		totalPrice,
		shippingPrice,
		isDelivered,
		deliveredAt,
		isPaid,
		paidAt
	} = order

	useEffect(() => {
		if (!userInfo) {
			return router.push('/login')
		}
		const fetchOrder = async () => {
			try {
				dispatch({type: 'FETCH_REQUEST'})
				const {data} = await axios.get(`/api/orders/${orderId}`, {
					headers: {authorization: `Bearer ${userInfo.token}`}
				})
				dispatch({type: 'FETCH_SUCCESS', payload: data})
			} catch (e) {
				dispatch({type: 'FETCH_ERROR', payload: getError(e)})
			}
		}
		if (!order._id || successPay || (order._id && order._id !== orderId)) {
			fetchOrder()
			if (successPay) {
				dispatch({type: 'PAY_RESET'})
			}
		} else {
			const loadPaypaylScript = async () => {
				const {data: clientId} = await axios.get('/api/keys/paypal', {
					headers: {authorization: `Bearer ${userInfo.token}`}
				})
				paypalDispatch({
					type: 'resetOptions', value: {
						'client-id': clientId,
						currency: 'USD'
					}
				})
				paypalDispatch({type: 'setLoadingStatus', value: 'pending'})
			}
			loadPaypaylScript()
		}
	}, [order, successPay])

	const createOrder = (data, actions) => {
		return actions.order.create({
			purchase_units: [
				{
					amount: {
						value: totalPrice
					}
				}
			]
		}).then((orderID) => {
			return orderID
		})
	}

	const onApprove = (data, actions) => {
		return actions.order.capture().then(async (details) => {
			try {
				dispatch({type: 'PAY_REQUEST'})
				const {data} = await axios.put(`/api/orders/${order._id}/pay`, details, {
					headers: {authorization: `Bearer ${userInfo.token}`}
				})
				dispatch({type: 'PAY_SUCCESS', payload: data})
				enqueueSnackbar('Order is paid', {variant: "success"})
			} catch (e) {
				dispatch({type: 'PAY_FAIL', payload: getError(e)})
				onError(e)
			}
		})
	}

	function onError(err) {
		enqueueSnackbar(getError(err), {variant: 'error'})
	}

	return (
		<Layout title={`Order ${orderId}`}>
			<CheckoutWizard activeStep={3}/>
			<Typography variant={"h1"} component={"h1"}>Order {orderId}</Typography>
			{loading ? (<CircularProgress/>)
				: error ? <Typography sx={classes.error}>{error}</Typography>
					: (
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
										<ListItem>
											Status: {isDelivered ? `delivered at ${deliveredAt}` : 'not delivered'}
										</ListItem>
									</List>
								</Card>
								<Card sx={classes.section}>
									<List>
										<ListItem>
											<Typography variant={"h2"} component={"h2"}>Payment Method</Typography>
										</ListItem>
										<ListItem>
											{paymentMethod}
										</ListItem>
										<ListItem>
											Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
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
														{orderItems.map((item) => (<TableRow key={item._id}>
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
										{
											!isPaid && (
												<ListItem>
													{isPending ? (<CircularProgress/>)
														: (
															<Box component={"div"} sx={{width: "100%"}}>
																<PayPalButtons
																	createOrder={createOrder}
																	onApprove={onApprove}
																	onError={onError}/>
															</Box>)}
												</ListItem>
											)
										}
									</List>
								</Card>
							</Grid>
						</Grid>
					)
			}
		</Layout>
	);
};

export async function getServerSideProps({params}) {
	return {props: {params}}
}

export default dynamic(() => Promise.resolve(Order), {ssr: false})
