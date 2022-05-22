import React, {useContext, useEffect} from 'react';
import Layout from "../components/Layout";
import {Button, FormControl, Link, List, ListItem, TextField, Typography} from "@mui/material";
import useStyles from "../utility/styles";
import NextLink from "next/link";
import axios from "axios";
import {Store} from "../utility/Store";
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import {Controller, useForm} from "react-hook-form";
import {useSnackbar} from "notistack";

const Login = () => {
	const {state, dispatch} = useContext(Store)
	const {userInfo} = state
	const {handleSubmit, control, formState: {errors}} = useForm()
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()
	const router = useRouter()
	const {redirect} = router.query
	useEffect(() => {
		if (userInfo) {
			router.push('/')
		}
	}, []);

	const classes = useStyles
	const submitHandle = async ({email, password}) => {
		closeSnackbar()
		try {
			const {data} = await axios.post('api/users/login', {
				email,
				password
			})
			dispatch({type: 'USER_LOGIN', payload: data})
			Cookies.set('userInfo', JSON.stringify(data))
			router.push(redirect || '/')
			enqueueSnackbar("Login Success", {variant: 'success'})
		} catch (err) {
			enqueueSnackbar(
				err.response.data ? err.response.data.message : err.message,
				{variant: 'error'}
			)
		}
	}
	return (
		<Layout title={"login"}>
			<FormControl
				component={"form"}
				sx={[classes.form, {display: 'flex'}]}
				onSubmit={handleSubmit(submitHandle)}
			>
				<Typography component={"h1"} variant={"h1"}>
					Login
				</Typography>
				<List>
					<ListItem>
						<Controller
							name="email"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								},
							}}
							render={({field}) => (
								<TextField
									variant={"outlined"}
									fullWidth={true}
									id={"email"}
									label={"Email"}
									inputProps={{type: 'email'}}
									error={Boolean(errors.email)}
									helperText={
										errors.email
											? errors.email.type === 'pattern'
												? 'Email is not valid'
												: 'Email is required'
											: ''
									}
									{...field}
								></TextField>
							)}
						>
						</Controller>
					</ListItem>
					<ListItem>
						<Controller
							name="password"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 6
							}}
							render={({field}) => (
								<TextField
									variant={"outlined"}
									fullWidth={true}
									id={"password"}
									label={"Password"}
									inputProps={{type: 'password'}}
									error={Boolean(errors.password)}
									helperText={
										errors.password
											? errors.password.type === 'minLength'
												? 'Password length is more than 5'
												: 'password is required'
											: ''
									}
									{... field}
								></TextField>
							)}
						>
						</Controller>
					</ListItem>
					<ListItem>
						<Button variant={"contained"} type={"submit"} fullWidth={true} color={"primary"}>Login</Button>
					</ListItem>
					<ListItem>
						Don&apos;t have an account ?&nbsp;<NextLink href={`/register?redirect=${redirect || '/'}`}
																												passHref={true}><Link>Register</Link></NextLink>
					</ListItem>
				</List>
			</FormControl>
		</Layout>
	);
};

export default Login;
