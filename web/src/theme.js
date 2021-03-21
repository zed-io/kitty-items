import {mode} from "@chakra-ui/theme-tools"
import {extendTheme} from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    body: "'Montserrat', sans-serif",
    heading: "'Montserrat', sans-serif",
  },
  colors: {},
  styles: {
    global: props => ({
      body: {
        color: mode("grey.800", "whiteAlpha.900")(props),
        bg: mode("white", "black")(props),
      },
    }),
  },
  config: {
    initialColorMode: "dark",
  },
})

export default theme
