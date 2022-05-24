import nc from 'next-connect'
import db from "../../../../utility/db";
import Order from "../../../../models/Order";
import {isAuth} from "../../../../utility/auth";

const handler = nc()
handler.use(isAuth)
handler.get( async (req, res) =>{
	await db.connect()
	const order = await Order.findById(req.query.id)
	await db.disconnect()
	res.send(order)
})

export default handler