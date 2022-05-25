import nc from 'next-connect'
import db from "../../../utility/db";
import Order from "../../../models/Order";
import {onError} from "../../../utility/errors";
import {isAuth} from "../../../utility/auth";

const handler = nc({
	onError,
})
handler.use(isAuth)

handler.get(async (req,res)=>{
	await db.connect()
	const orders = await Order.find({user: req.user._id})
	res.send(orders)
})

export default handler