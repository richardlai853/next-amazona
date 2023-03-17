import {
  Button,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
  CircularProgress,
} from '@material-ui/core';

import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Store } from '../../utils/Store';
import { getError } from '../../utils/error';
import useStyles from '../../utils/style';
import dynamic from 'next/dynamic';
import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { Controller, useForm } from 'react-hook-form';

function PlaceOrder() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [bookedDates, setBookedDates] = useState([]);

  const fetchData = () => {
    if (userInfo) {
      return fetch('/api/bookings/booked', {
        header: { authorization: `Bearer ${userInfo.token}` },
      })
        .then((response) => response.json())
        .then((data) => setBookedDates(data));
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    fetchData();
  }, []);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { state } = useContext(Store);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState();
  const router = useRouter();
  const classes = useStyles();

  const { userInfo } = state;

  const styles = {
    container: {
      width: '60wh',
      height: '60vh',
      margin: '2em',
    },
  };

  const markBooking = async ({ date, remark, phone }) => {
    closeSnackbar();
    if (!selectedDay) {
      return enqueueSnackbar('You must Select a day', { variant: 'error' });
    }
    try {
      setLoading(true);
      date = selectedDay;
      const { data } = await axios.post(
        '/api/bookings',
        {
          date,
          remark,
          phone,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setLoading(false);
      router.push(`/booking/${data._id}`);
    } catch (err) {
      setLoading(false);
      if (err.response.status == 409) {
        enqueueSnackbar('Date already booked', { variant: 'error' });
      } else {
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    }
  };

  const booked = [];

  bookedDates.forEach((bookDate) => {
    booked.push(new Date(bookDate.date).toLocaleDateString());
  });

  const tileDisabled = ({ date }) => {
    return date < new Date() || booked.includes(date.toLocaleDateString());
  };

  return (
    <Layout title="Mark Booking">
      <div style={styles.container}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Calendar
              value={selectedDay}
              onChange={setSelectedDay}
              calendarType="US"
              tileDisabled={tileDisabled}
              className={classes.fullWidth}
              minDetail="month"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <form className={classes.form} onSubmit={handleSubmit(markBooking)}>
              <Typography component="h1" variant="h1">
                Seleded Date:{' '}
                {selectedDay ? selectedDay.toLocaleDateString() : ''}
              </Typography>
              <List>
                <ListItem>
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="phone"
                        label="Phone"
                        inputProps={{ type: 'number' }}
                        error={Boolean(errors.phone)}
                        helperText={
                          errors.phone
                            ? errors.phone.type === 'pattern'
                              ? 'Phone is not valid'
                              : 'Phone is required'
                            : ''
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <ListItem>
                  <Controller
                    name="remark"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="remark"
                        label="Remark"
                        inputProps={{ type: 'text' }}
                        error={Boolean(errors.remark)}
                        helperText={errors.remark ? 'remark is required' : ''}
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    color="primary"
                  >
                    Book
                  </Button>
                </ListItem>
              </List>
            </form>
          </Grid>
        </Grid>
        {loading && (
          <ListItem>
            <CircularProgress />
          </ListItem>
        )}
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
