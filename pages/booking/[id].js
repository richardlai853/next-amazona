import React, { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import {
  Grid,
  CardContent,
  CardActionArea,
  CardActions,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  Card,
  List,
  ListItem,
} from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import useStyles from '../../utils/style';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingPay: false,
        successPay: false,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      state;
  }
}

function Booking({ params }) {
  const bookingId = params.id;
  const isPending = false;
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    { loading, error, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  const {
    user,
    date,
    remark,
    phone,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/bookings/${bookingId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== bookingId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [order, successPay, successDeliver]);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  async function deliverOrderHandler() {
    closeSnackbar();
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/bookings/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      enqueueSnackbar('Order is delivered', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }

  async function payOrderHandler() {
    closeSnackbar();
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(
        `/api/bookings/${order._id}/pay`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      enqueueSnackbar('Order is paid', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }

  return (
    <Layout title={`Order ${bookingId}`}>
      <Typography component="h1" variant="h1">
        Booking {bookingId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item md={7} xs={12}>
            <Card className={classes.section}>
              <CardActionArea>
                <CardContent>
                  <CardMedia
                    className={classes.media}
                    component="img"
                    image="/images/new-year.jpg"
                  />
                  <Typography
                    color="primary"
                    gutterBottom
                    variant="h4"
                    component="h2"
                  >
                    {user.name}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="h3">
                    {new Date(date).toLocaleDateString()}
                  </Typography>
                  Contact: {phone}, Remark: {remark}
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button variant="outlined" size="small" color="inherit">
                  Share
                </Button>
                <Button variant="outlined" size="small" color="inherit">
                  Add to Calender
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item md={5} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  Status:{' '}
                  {isDelivered
                    ? `delivered at ${deliveredAt}`
                    : 'not delivered'}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>Payment Method: {paymentMethod}</ListItem>
                <ListItem>
                  Payment Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
                </ListItem>
              </List>
            </Card>
            {!isPaid && userInfo.isAdmin && (
              <ListItem>
                {isPending ? (
                  <CircularProgress />
                ) : (
                  <div className={classes.fullWidth}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={payOrderHandler}
                    >
                      Pay
                    </Button>
                  </div>
                )}
              </ListItem>
            )}
            {userInfo.isAdmin && !order.isDelivered && (
              <ListItem>
                {loadingDeliver && <CircularProgress />}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={deliverOrderHandler}
                >
                  Deliver Order
                </Button>
              </ListItem>
            )}
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Booking), { ssr: false });
