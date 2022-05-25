import React, {useContext, useEffect, useReducer} from 'react';
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {Store} from "../utility/Store";
import axios from "axios";
import {getError} from "../utility/errors";
import {
	Button,
	Card,
	CircularProgress,
	Grid,
	List,
	ListItem, ListItemText, Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from "@mui/material";
import Layout from "../components/Layout";
import useStyles from "../utility/styles";
import NextLink from "next/link";


function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return {...state, loading: true, error: ''}
		case 'FETCH_SUCCESS':
			return {...state, loading: false, orders: action.payload, error: ''}
		case 'FETCH_FAIL':
			return {...state, loading: false, errors: action.payload}
		default:
			return state
	}
}

function OrderHistory() {
	const router = useRouter()
	const {state} = useContext(Store)
	const {userInfo} = state
	const classes = useStyles
	const [{loading, error, orders}, dispatch] = useReducer(reducer, {
		loading: true, order: {}, error: ''
	})
	useEffect(() => {
		if (!userInfo) {
			router.push('/login')
		}
		const fetchOrder = async () => {
			try {
				dispatch({type: 'FETCH_REQUEST'})
				const {data} = await axios.get(`/api/orders/history`, {
					headers: {authorization: `Bearer ${userInfo.token}`}
				})
				dispatch({type: 'FETCH_SUCCESS', payload: data})
			} catch (e) {
				dispatch({type: 'FETCH_ERROR', payload: getError(e)})
			}
		}
		fetchOrder()
	}, [])
	return (<Layout title={"Orders history"}>
		<Grid container spacing={1}>
			<Grid item md={3} xs={12}>
				<Card sx={classes.section}>
					<List>
						<NextLink href={`/profile`} passHref>
							<ListItem button>
								<ListItemText primary={"User Profile"}></ListItemText>
							</ListItem>
						</NextLink>
						<NextLink href={`/order-history`} passHref>
							<ListItem selected button>
								<ListItemText primary={"Order History"}></ListItemText>
							</ListItem>
						</NextLink>
					</List>
				</Card>
			</Grid>
			<Grid item md={9} xs={12}>
				<Card sx={classes.section}>
					<List>
						<ListItem>
							<Typography component={"h1"} variant={"h1"}>Order History</Typography>
						</ListItem>
						<ListItem>
							{loading ? (<CircularProgress/>) : error ? <Typography sx={classes.error}>{error}</Typography> : (
								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>ID</TableCell>
												<TableCell>DATE</TableCell>
												<TableCell>TOTAL</TableCell>
												<TableCell>PAID</TableCell>
												<TableCell>DELIVERED</TableCell>
												<TableCell>ACTION</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{orders.map( order =>(
												<TableRow key={order._id}>
													<TableCell>{order._id.substring(20,24)}</TableCell>
													<TableCell>{order.createdAt}</TableCell>
													<TableCell>${order.totalPrice}</TableCell>
													<TableCell>
														{order.isPaid
														? `paid at ${order.paidAt}`
															: `not Paid`
														}
													</TableCell>
													<TableCell>{
														order.isDelivered
														? `Delivered at ${order.deliveredAt}`
															: `Not delivered`
													}</TableCell>
													<TableCell>
														<NextLink href={`/order/${order._id}`} passHref>
															<Button variant={"contained"}>Details</Button>
														</NextLink>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</ListItem>
					</List>
				</Card>
			</Grid>
		</Grid>
	</Layout>);
}

export default dynamic(() => Promise.resolve(OrderHistory), {ssr: false})