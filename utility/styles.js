
const useStyles = {
  navbar: {
		px: 10,
    backgroundColor: "#203040",
    '& a': {
      color: '#fff',
    }
  },
  brand:{
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },
  grow:{
    flexGrow: 1
  },
  main: {
    minHeight: '80vh',
  },
  section: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  footer:{
		my: 5,
    textAlign: 'center',
  },
  fontBold:{
    'li':{
      fontWeight: 700
    }
  },
	form:{
		maxWidth: 800,
		margin: '0 auto'
	},
	navbarButton:{
		color: '#fff',
		textTransform: 'initial'
	}
}
export default useStyles