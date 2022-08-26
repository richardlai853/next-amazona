import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#203040',
    '& a': {
      color: '#ffffff',
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '24px',
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    textAlign: 'center',
    marginTop: '10px',
    marginBottom: '10px',
  },
  section: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  form: {
    maxWidth: 800,
    margin: '0 auto',
  },

  navbarButton: {
    color: '#ffffff',
    textTransform: 'initial',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
});

export default useStyles;
