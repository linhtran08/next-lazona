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

const Register = () => {
	const { state, dispatch } = useContext(Store)
	const { userInfo } = state
	const {handleSubmit, control, formState: {errors}} = useForm()
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()
	const router = useRouter()
	const { redirect } = router.query
	useEffect(() => {
		if(userInfo){
			router.push('/')
		}
	}, []);

	const classes = useStyles
	const submitHandle = async ({name, email, password, confirmPassword})=>{
		closeSnackbar()
		if (password !== confirmPassword){
			enqueueSnackbar("Password dont't match", {variant: 'error'})
			return
		}
		try{
			const { data } = await axios.post('api/users/register',{
				name,
				email,
				password,
				confirmPassword
			})
			dispatch({type:'USER_LOGIN', payload: data})
			Cookies.set('userInfo',JSON.stringify(data))
			router.push(redirect || '/')
			enqueueSnackbar("Register Account Success", {variant: 'success'})
		}catch (err){
			enqueueSnackbar(
				err.response.data ? err.response.data.message : err.message,
				{variant: 'error'}
			)
		}
	}
	return (
		<Layout title={"Register"}>
			<FormControl
				component={"form"}
				sx={[classes.form, {display: 'flex'}]}
				onSubmit={handleSubmit(submitHandle)}
			>
				<Typography component={"h1"} variant={"h1"}>
					Register
				</Typography>
				<List>
					<ListItem>
						<Controller
							render={({field})=>(
							<TextField
								variant={"outlined"}
								fullWidth={true}
								id={"name"}
								label={"Name"}
								inputProps={{type: 'text'}}
								error={Boolean(errors.name)}
								helperText={
									errors.name
										? errors.name.type === 'minLength'
											? 'Name length is more than 1'
											: 'Name is required'
										: ''
								}
								{...field}
							></TextField>
						)}
							name="name"
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
						<Controller
							render={({field}) => (
								<TextField
									variant={"outlined"}
									fullWidth={true}
									id={"confirmPassword"}
									label={"Confirm Password"}
									error={Boolean(errors.confirmPassword)}
									inputProps={{type: 'password'}}
									helperText={
										errors.confirmPassword
											? errors.confirmPassword.type === 'minLength'
												? 'Confirm Password length is more than 5'
												: 'Confirm Password is required'
											: ''
									}
									{...field}
								></TextField>
							)}
							name="confirmPassword"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 6
							}}
						></Controller>
					</ListItem>
					<ListItem>
						<Button variant={"contained"} type={"submit"} fullWidth={true} color={"primary"}>Register</Button>
					</ListItem>
					<ListItem>
						Already have an account ?&nbsp;<NextLink href={`/login?redirect=${redirect || '/'}`} passHref={true} ><Link>Login</Link></NextLink>
					</ListItem>
				</List>
			</FormControl>
		</Layout>
	);
};

export default Register;
