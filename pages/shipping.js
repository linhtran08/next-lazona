import React, {useContext, useEffect} from 'react';
import {Store} from "../utility/Store";
import {useRouter} from "next/router";


const Shipping = () => {
	const router = useRouter();
	const { state } = useContext(Store)
	const { userInfo } = state
	useEffect(() => {
		if(!userInfo){
			router.push('/login?redirect=/shipping')
		}
	}, [userInfo]);

	return (
		<div>
			Shipping
		</div>
	);
};

export default Shipping;
