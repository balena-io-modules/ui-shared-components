import { createTheme } from "@mui/material/styles";
import { Theme } from "./theme.d";

export const theme: Theme = createTheme({
  typography: {
    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
    h1: {
      fontSize: "2.75rem",
      "@media (min-width:600px)": {
        fontSize: "4.25rem",
      },
      fontWeight: "bold",
    },
    h2: {
      fontSize: "2.375rem",
      "@media (min-width:600px)": {
        fontSize: "3.125rem",
      },
      fontWeight: "600",
    },
    h3: {
      fontSize: "2rem",
      "@media (min-width:600px)": {
        fontSize: "2.375rem",
      },
      fontWeight: "600",
    },
    h4: {
      fontSize: "1.5rem",
      "@media (min-width:600px)": {
        fontSize: "2.125rem",
      },
      fontWeight: "600",
    },
    h5: {
      fontSize: "1.125rem",
      "@media (min-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    h6: {
      fontSize: "1rem",
      "@media (min-width:600px)": {
        fontSize: "1.125 rem",
      },
    },
    bodyLarge: {
      fontSize: "1.125rem",
      "@media (min-width:600px)": {
        fontSize: "1.25 rem",
      },
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    smallText: {
      fontSize: "12px",
      color: "#828282",
    },
    link: {
      fontSize: "13px",
      color: "#00AEEF",
    },
  },
  palette: {
    secondary: {
      light: "#8F9297",
      main: "#3C3E42",
      dark: "#0C0C0C",
      contrastText: "#F4F4F4",
    },
    hubBlue: {
      xlight: "#E5F8FF",
      light: "#CAF0FF",
      main: "#00AEEF",
      dark: "#2A506F",
    },
    hubYellow: {
      main: "#FFC100",
      contrastText: "#FFFFFF",
    },
    hubGreen: {
      xlight: "#DBF9F6",
    },
    hubPurple: {
      main: "#594A83",
      xlight: "#F2EDFF",
    },
    hubGrey: {
      xlight: "#F4F4F4",
      light: "#8F9297",
      main: "#3C3E42",
      dark: "#0C0C0C",
    },
    background: {
      default: "#F8F9FD",
    },
    text: {
      primary: "#2A506F",
      secondary: "#3C3E42",
      tertiary: "#8F9297",
    },
  },
  spacing: [0, 4, 8, 16, 32, 64, 128],
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          img: {
            objectFit: "contain",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "24px",
          boxShadow: "none",
          border: "1px solid #E3E6F2",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
        },
        avatar: {
          width: "56px",
          height: "56px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          paddingTop: "24px",
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#DEE1EF",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
				a[data-underline="false"] {
					text-decoration: none
				}
			`,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "24px",
          paddingLeft: "32px",
          paddingRight: "32px",
        },
        outlined: {
          textTransform: "none",
        },
        contained: {
          textTransform: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
});
