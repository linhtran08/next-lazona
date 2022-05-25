import React, {useContext, useEffect} from 'react';
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {Store} from "../utility/Store";
import axios from "axios";
import {
	Button, Card, FormControl, Grid, Link, List, ListItem, ListItemText, TextField, Typography
} from "@mui/material";
import Layout from "../components/Layout";
import useStyles from "../utility/styles";
import NextLink from "next/link";
import {Controller, useForm} from "react-hook-form";
import Cookies from "js-cookie";
import {useSnackbar} from "notistack";
import {getError} from "../utility/errors";

function Profile() {
	const router = useRouter()
	const {state, dispatch} = useContext(Store)
	const {userInfo} = state
	const {handleSubmit, control, formState: {errors}, setValue} = useForm()
	const {redirect} = router.query
	const classes = useStyles
	const {enqueueSnackbar, closeSnackbar} = useSnackbar()
	useEffect(() => {
		if (!userInfo) {
		return router.push('/login')
		}
		setValue('name', userInfo.name)
		setValue('email', userInfo.email)
	}, [])

	const submitHandle = async ({name, email, password, confirmPassword}) => {
		closeSnackbar()
		if (password !== confirmPassword) {
			enqueueSnackbar("Password dont't match", {variant: 'error'})
			return
		}
		try {
			const {data} = await axios.put('api/users/profile', {
				name, email, password, confirmPassword
			},{
				headers: { authorization: `Bearer ${userInfo.token}`}
			})
			dispatch({type: 'USER_LOGIN', payload: data})
			Cookies.set('userInfo', JSON.stringify(data))
			router.push(redirect || '/')
			enqueueSnackbar("Profile Updated Successfully", {variant: 'success'})
		} catch (err) {
			enqueueSnackbar(getError(err), {variant: "error"})
		}
	}

	return (<Layout title={"Profile"}>
		<Grid container spacing={1}>
			<Grid item md={3} xs={12}>
				<Card sx={classes.section}>
					<List>
						<NextLink href={`/profile`} passHref>
							<ListItem selected button>
								<ListItemText primary={"User Profile"}></ListItemText>
							</ListItem>
						</NextLink>
						<NextLink href={`/order-history`} passHref>
							<ListItem button>
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
							<Typography component={"h1"} variant={"h1"}>Profile</Typography>
						</ListItem>
						<ListItem>
							<FormControl
								fullWidth
								component={"form"}
								sx={[classes.form, {display: 'flex'}]}
								onSubmit={handleSubmit(submitHandle)}
							>
								<List>
									<ListItem>
										<Controller
											render={({field}) => (<TextField
												variant={"outlined"}
												fullWidth={true}
												id={"name"}
												label={"Name"}
												inputProps={{type: 'text'}}
												error={Boolean(errors.name)}
												helperText={errors.name ? errors.name.type === 'minLength' ? 'Name length is more than 1' : 'Name is required' : ''}
												{...field}
											></TextField>)}
											name="name"
											control={control}
											defaultValue=""
											rules={{
												required: true, minLength: 2
											}}
										>
										</Controller>
									</ListItem>
									<ListItem>
										<Controller
											name="email"
											control={control}
											defaultValue=""
											rules={{
												required: true, pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												},
											}}
											render={({field}) => (<TextField
												variant={"outlined"}
												fullWidth={true}
												id={"email"}
												label={"Email"}
												inputProps={{type: 'email'}}
												error={Boolean(errors.email)}
												helperText={errors.email ? errors.email.type === 'pattern' ? 'Email is not valid' : 'Email is required' : ''}
												{...field}
											></TextField>)}
										>
										</Controller>
									</ListItem>
									<ListItem>
										<Controller
											name="password"
											control={control}
											defaultValue=""
											rules={{
												validate: (value) => value === '' || value.length > 5 || 'Password length is more than 5'
											}}
											render={({field}) => (<TextField
												variant={"outlined"}
												fullWidth={true}
												id={"password"}
												label={"Password"}
												inputProps={{type: 'password'}}
												error={Boolean(errors.password)}
												helperText={
													errors.confirmPassword
														? 'Password length is more than 5'
														: ''
												}
												{...field}
											></TextField>)}
										>
										</Controller>
									</ListItem>
									<ListItem>
										<Controller
											render={({field}) => (<TextField
												variant={"outlined"}
												fullWidth={true}
												id={"confirmPassword"}
												label={"Confirm Password"}
												error={Boolean(errors.confirmPassword)}
												inputProps={{type: 'password'}}
												helperText={
													errors.confirmPassword
														? 'Confirm Password length is more than 5'
														: ''
												}
												{...field}
											></TextField>)}
											name="confirmPassword"
											control={control}
											defaultValue=""
											rules={{
												validate: (value) => value === '' || value.length > 5 || 'Confirm Password length is more than 5'
											}}
										></Controller>
									</ListItem>
									<ListItem>
										<Button variant={"contained"} type={"submit"} fullWidth={true} color={"primary"}>Register</Button>
									</ListItem>
									<ListItem>
										Already have an account ?&nbsp;
										<NextLink href={`/login?redirect=${redirect || '/'}`}
															passHref={true}><Link>Login</Link></NextLink>
									</ListItem>
								</List>
							</FormControl>
						</ListItem>
					</List>
				</Card>
			</Grid>
		</Grid>
	</Layout>);
}

export default dynamic(() => Promise.resolve(Profile), {ssr: false})