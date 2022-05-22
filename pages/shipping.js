import React, {useContext, useEffect} from 'react';
import Layout from "../components/Layout";
import {Button, FormControl, List, ListItem, TextField, Typography} from "@mui/material";
import useStyles from "../utility/styles";
import {Store} from "../utility/Store";
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import {Controller, useForm} from "react-hook-form";
import CheckoutWizard from "../components/checkoutWizard";

const Shipping = () => {
	const { state, dispatch } = useContext(Store)
	const { userInfo , cart: {shippingAddress} } = state
	const {handleSubmit, control, formState: {errors} , setValue } = useForm()
	const router = useRouter()
	useEffect(() => {
		if(!userInfo){
			router.push('/login?redirect=/shipping')
		}
		setValue('fullName', shippingAddress.fullName)
		setValue('address', shippingAddress.address)
		setValue('city', shippingAddress.city)
		setValue('postalCode', shippingAddress.postalCode)
		setValue('country', shippingAddress.country)
	}, []);

	const classes = useStyles
	const submitHandle = ({ fullName, address, city, postalCode, country })=>{
			dispatch({type:'SAVE_SHIPPING_ADDRESS', payload: { fullName, address, city, postalCode, country }})
			Cookies.set('shippingAddress',JSON.stringify({ fullName, address, city, postalCode, country }))
			router.push('/payment')
	}
	return (
		<Layout title={"Shipping address"}>
			<CheckoutWizard activeStep={1}/>
			<FormControl
				component={"form"}
				sx={[classes.form, {display: 'flex'}]}
				onSubmit={handleSubmit(submitHandle)}
			>
				<Typography component={"h1"} variant={"h1"}>
					Shipping address
				</Typography>
				<List>
					<ListItem>
						<Controller
							render={({field})=>(
								<TextField
									variant={"outlined"}
									fullWidth={true}
									id={"fullName"}
									label={"Full Name"}
									error={Boolean(errors.fullName)}
									helperText={
										errors.fullName
											? errors.fullName.type === 'minLength'
												? 'Full Name length is more than 1'
												: 'Full Name is required'
											: ''
									}
									{...field}
								></TextField>
							)}
							name="fullName"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 2
							}}
						>
						</Controller>
					</ListItem>
					<ListItem>
						<Controller
							render={({field})=>(
								<TextField
									variant={"outlined"}
									fullWidth={true}
									id={"address"}
									label={"Address"}
									error={Boolean(errors.address)}
									helperText={
										errors.address
											? errors.address.type === 'minLength'
												? 'Address length is more than 1'
												: 'Address is required'
											: ''
									}
									{...field}
								></TextField>
							)}
							name="address"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 2
							}}
						>
						</Controller>
					</ListItem>
					<ListItem>
						<Controller
							render={({field})=>(
								<TextField
									variant={"outlined"}
									fullWidth={true}
									id={"city"}
									label={"City"}
									error={Boolean(errors.city)}
									helperText={
										errors.city
											? errors.city.type === 'minLength'
												? 'City length is more than 1'
												: 'City is required'
											: ''
									}
									{...field}
								></TextField>
							)}
							name="city"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 2
							}}
						>
						</Controller>
					</ListItem>
					<ListItem>
						<Controller
							render={({field})=>(
								<TextField
									variant={"outlined"}
									fullWidth={true}
									id={"postalCode"}
									label={"Postal Code"}
									error={Boolean(errors.postalCode)}
									helperText={
										errors.postalCode
											? errors.postalCode.type === 'minLength'
												? 'Postal Code length is more than 1'
												: 'Postal Code is required'
											: ''
									}
									{...field}
								></TextField>
							)}
							name="postalCode"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 2
							}}
						>
						</Controller>
					</ListItem>
					<ListItem>
						<Controller
							render={({field})=>(
								<TextField
									variant={"outlined"}
									fullWidth={true}
									id={"country"}
									label={"Country"}
									error={Boolean(errors.country)}
									helperText={
										errors.country
											? errors.country.type === 'minLength'
												? 'Country length is more than 1'
												: 'Country is required'
											: ''
									}
									{...field}
								></TextField>
							)}
							name="country"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 2
							}}
						>
						</Controller>
					</ListItem>
					<ListItem>
						<Button variant={"contained"} type={"submit"} fullWidth={true} color={"primary"}>Continue</Button>
					</ListItem>
				</List>
			</FormControl>
		</Layout>
	);
};

export default Shipping;
