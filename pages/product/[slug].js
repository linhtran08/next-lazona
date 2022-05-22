import React, {useContext} from 'react';
import Layout from "../../components/Layout";
import NextLink from "next/link";
import {Box, Button, Card, Grid, Link, List, ListItem, Typography} from "@mui/material";
import useStyles from "../../utility/styles";
import Image from "next/image";
import db from "../../utility/db";
import Product from "../../models/Product";
import axios from "axios";
import {Store} from "../../utility/Store";
import {useRouter} from "next/router";

const ProductScreen = (props) => {
	const router = useRouter()
	const { state, dispatch} = useContext(Store)
	const {product} = props
  const classes = useStyles
  if(!product){
    return <div>Product not found</div>
  }

	const addToCartHandle = async () => {
		const {data} = await axios.get(`/api/products/${product._id}`)
    const existItem = state.cart.cartItems.find(x => x._id === product._id)
		const quantity = existItem ? existItem.quantity+1 : 1
    if (data.countInStock < quantity){
			window.alert('Sorry. Product is out of stock')
			return
		}
		dispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}})
		router.push('/cart')
	}

	return (
    <Layout title={product.name} desc={product.description}>
      <Box sx={classes.section}>
        <NextLink href='/' passHref>
          <Link>back to products</Link>
        </NextLink>
      </Box>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
            ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem><Typography variant="h1">{product.name}</Typography></ListItem>
            <ListItem><Typography>Category: {product.category}</Typography></ListItem>
            <ListItem><Typography>Brand: {product.brand}</Typography></ListItem>
            <ListItem><Typography>Rating: {product.rating} stars ({product.numReviews}) reviews</Typography></ListItem>
            <ListItem><Typography>Description: {product.description}</Typography></ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{product.countInStock > 0 ? 'In Stock' : 'Unavailable' }</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
									fullWidth
									variant="contained"
									color="primary"
									onClick={addToCartHandle}
								>
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
};

export async function getServerSideProps(context){
	const {params} = context
	const {slug} = params
	await db.connect()
	const product = await Product.findOne({slug}).lean()
	await db.disconnect()
	return {
		props: {
			product : db.convertDoctoObj(product),
		}
	}
}

export default ProductScreen;