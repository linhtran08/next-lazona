import React, {useContext} from 'react';
import {Store} from "../utility/Store";
import {useRouter} from "next/router";

const Shipping = () => {
	const { state } = useContext(Store)
	const { userInfo } = state
	const router = useRouter()
	if(!userInfo){
		router.push('/login?redirect=/shipping')
	}
	return (
		<div>
			Shipping
		</div>
	);
};

export default Shipping;
