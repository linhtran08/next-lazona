import React, {useContext} from 'react';
import Layout from "../components/Layout";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import NextLink from "next/link";
import db from "../utility/db";
import Product from "../models/Product";
import axios from "axios";
import {useRouter} from "next/router";
import {Store} from "../utility/Store";

export default function Home(props) {
	const router = useRouter()
  const {state, dispatch} = useContext(Store)
  const {products} = props
  const addToCartHandle = async (product) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {data} = await axios.get(`/api/products/${product._id}`)
    const existItem = state.cart.cartItems.find(x => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock')
      return
    }
    dispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}})
    router.push('/cart')
  }
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size="small" color="primary" onClick={() => addToCartHandle(product)}>Add to Cart</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find({}).lean()
  await db.disconnect()
  return {
    props: {
      products: products.map(db.convertDoctoObj)
    }
  }
}