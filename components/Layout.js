import React, { useContext, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import useStyles from '../utils/style';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart, darkMode, userInfo } = state;
  const router = useRouter();
  const myTheme = createTheme({
    typography: {
      h1: {
        fontSize: '1.8rem',
        fontWeight: 700,
        margin: '1rem, 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem, 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  const classes = useStyles();
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={myTheme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="primary"
              aria-label="menu"
            >
              <HomeIcon />
            </IconButton>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>Products</Typography>
              </Link>
            </NextLink>
            <NextLink href="/booking" passHref>
              <Link>
                <Typography className={classes.brand}>Booking</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={(e) => loginMenuCloseHandler(e, null)}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Order History
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved.</Typography>
        </footer>
      </ThemeProvider>
    </>
  );
}
