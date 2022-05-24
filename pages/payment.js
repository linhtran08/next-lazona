import React, {useContext, useEffect, useState} from 'react';
import {Store} from "../utility/Store";
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/checkoutWizard";
import useStyles from "../utility/styles";
import {Button, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography} from "@mui/material";
import {useSnackbar} from "notistack";

const Payment = () => {
	const router = useRouter()
	const { state, dispatch } = useContext(Store)
	const [ paymentMethod, setPaymentMethod ] = useState('')
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()
	const { cart : {shippingAddress} } = state
	const classes = useStyles
	useEffect(() => {
		return () => {
			if(!shippingAddress.address){
				router.push('/shipping')
			}else {
				setPaymentMethod(Cookies.get('paymentMethod') || '')
			}
		};
	}, []);

	const submitHandle = (e) =>{
		closeSnackbar()
		e.preventDefault()
		if(!paymentMethod){
			enqueueSnackbar('Payment method is required ', {variant: 'error'})
		}else {
			dispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod})
			Cookies.set('paymentMethod', paymentMethod)
			router.push('placeorder')
		}
	}
	return (
		<Layout title={"Payment Method"}>
			<CheckoutWizard activeStep={2}/>
			<FormControl
				component={"form"}
				sx={[classes.form, {display: 'flex'}]}
				onSubmit={submitHandle}
			>
				<Typography variant={"h1"} component={"h1"}>Payment Method</Typography>
				<FormControl component={"fieldset"}>
					<List>
						<ListItem>
							<RadioGroup
								aria-label={"Payment Method"}
								name={"paymentMethod"}
								value={paymentMethod}
								onChange={ event => setPaymentMethod(event.target.value)}
							>
								<FormControlLabel control={<Radio />} label={"Paypal"} value={"Paypal"}/>
								<FormControlLabel control={<Radio />} label={"Stripe"} value={"Stripe"}/>
								<FormControlLabel control={<Radio />} label={"Cash"} value={"Cash"}/>
							</RadioGroup>
						</ListItem>
						<ListItem>
							<Button fullWidth={true} type={"submit"} variant={"contained"} color={"primary"}>Continue</Button>
						</ListItem>
						<ListItem>
							<Button fullWidth={true} type={"button"} variant={"contained"} color="inherit" onClick={ () => router.push('/shipping') } >Back</Button>
						</ListItem>
					</List>

				</FormControl>
			</FormControl>
		</Layout>
	);
};

export default Payment;
