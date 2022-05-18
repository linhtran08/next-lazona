import React, {useContext, useEffect, useState} from 'react';
import Layout from "../components/Layout";
import {Button, FormControl, Link, List, ListItem, TextField, Typography} from "@mui/material";
import useStyles from "../utility/styles";
import NextLink from "next/link";
import axios from "axios";
import {Store} from "../utility/Store";
import {useRouter} from "next/router";
import Cookies from "js-cookie";

const Login = () => {
	const { state, dispatch } = useContext(Store)
	const { userInfo } = state
	const router = useRouter()
	const { redirect } = router.query
	useEffect(() => {
		if(userInfo){
			router.push('/')
		}
	}, []);

	const classes = useStyles
	const [email, setEmail] = useState('')
	const [password, setPass] = useState('')
	const submitHandle = async (e)=>{
		e.preventDefault()
		try{
			const { data } = await axios.post('api/users/login',{
				email,
				password
			})
			dispatch({type:'USER_LOGIN', payload: data})
			Cookies.set('userInfo',JSON.stringify(data))
			router.push(redirect || '/')
			alert('login susscess')
		}catch (err){
			alert(err.response.data? err.response.data.message : err.message)
		}
	}
	return (
		<Layout title={"login"}>
			<FormControl
				component={"form"}
				sx={[classes.form, {display: 'flex'}]}
				onSubmit={submitHandle}
			>
				<Typography component={"h1"} variant={"h1"}>
					Login
				</Typography>
				<List>
					<ListItem>
						<TextField
							variant={"outlined"}
							fullWidth={true}
							id={"email"}
							label={"Email"}
							inputProps={{type: 'email'}}
							onChange={(e)=> setEmail(e.target.value)}
						></TextField>
					</ListItem>
					<ListItem>
						<TextField
							variant={"outlined"}
							fullWidth={true}
							id={"password"}
							label={"Password"}
							inputProps={{type: 'password'}}
							onChange={ event => setPass(event.target.value)}
						></TextField>
					</ListItem>
					<ListItem>
						<Button variant={"contained"} type={"submit"} fullWidth={true} color={"primary"}>Login</Button>
					</ListItem>
					<ListItem>
						Don&apos;t have an account ?&nbsp;<NextLink href={`/register?redirect=${redirect || '/'}`} passHref={true} ><Link>Register</Link></NextLink>
					</ListItem>
				</List>
			</FormControl>
		</Layout>
	);
};

export default Login;
