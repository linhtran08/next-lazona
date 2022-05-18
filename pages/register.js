import React, {useContext, useEffect, useState} from 'react';
import Layout from "../components/Layout";
import {Button, FormControl, Link, List, ListItem, TextField, Typography} from "@mui/material";
import useStyles from "../utility/styles";
import NextLink from "next/link";
import axios from "axios";
import {Store} from "../utility/Store";
import {useRouter} from "next/router";
import Cookies from "js-cookie";

const Register = () => {
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
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPass] = useState('')
	const [confpassword, setConfPass] = useState('')
	const submitHandle = async (e)=>{
		e.preventDefault()
		if (password !== confpassword){
			alert("Password don't match")
			return
		}
		try{
			const { data } = await axios.post('api/users/register',{
				name,
				email,
				password,
				confirmPassword : confpassword
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
		<Layout title={"Register"}>
			<FormControl
				component={"form"}
				sx={[classes.form, {display: 'flex'}]}
				onSubmit={submitHandle}
			>
				<Typography component={"h1"} variant={"h1"}>
					Register
				</Typography>
				<List>
					<ListItem>
						<TextField
							variant={"outlined"}
							fullWidth={true}
							id={"name"}
							label={"Name"}
							inputProps={{type: 'text'}}
							onChange={(e)=> setName(e.target.value)}
						></TextField>
					</ListItem>
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
						<TextField
							variant={"outlined"}
							fullWidth={true}
							id={"confirmPassword"}
							label={"Confirm Password"}
							inputProps={{type: 'password'}}
							onChange={ event => setConfPass(event.target.value)}
						></TextField>
					</ListItem>
					<ListItem>
						<Button variant={"contained"} type={"submit"} fullWidth={true} color={"primary"}>Register</Button>
					</ListItem>
					<ListItem>
						Already have an account ?&nbsp;<NextLink href={`/login?redirect=${redirect || '/'}`} passHref={true} ><Link>Register</Link></NextLink>
					</ListItem>
				</List>
			</FormControl>
		</Layout>
	);
};

export default Register;
