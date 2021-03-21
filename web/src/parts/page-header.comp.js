import {useCurrentUser} from "../hooks/use-current-user.hook"
import {useRef} from "react"
import {Link as RouterLink} from "react-router-dom"
import {
  Box,
  Button,
  Flex,
  Center,
  Heading,
  IconButton,
  Text,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Link,
  // DrawerHeader,
} from "@chakra-ui/react"
import {HamburgerIcon} from "@chakra-ui/icons"

// import Logo from "../svg/logo-kv.svg"

export function PageHeader() {
  const [user, loggedIn, {signUp, logIn}] = useCurrentUser()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const drawerBtnRef = useRef()

  const onSignUp = () => {
    onClose()
    signUp()
  }
  const onLogIn = () => {
    onClose()
    logIn()
  }

  return (
    <>
      <Box p="4">
        <Flex>
          <IconButton
            ref={drawerBtnRef}
            aria-label="Open left menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
          />
          <Center ml="4">
            <Link to="/" as={RouterLink}>
              {/* <Image src={Logo} /> */}
              <Heading size="lg">Culture Exchange</Heading>
            </Link>
          </Center>
        </Flex>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={drawerBtnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            {/* <DrawerHeader>Culture Exchange</DrawerHeader> */}
            <DrawerBody>
              <Center h="100%">
                {loggedIn ? (
                  <Text>Welcome {user.addr}</Text>
                ) : (
                  <>
                    <Button mr="4" colorScheme="blue" onClick={onSignUp}>
                      Log In
                    </Button>
                    <Button mr="4" colorScheme="blue" onClick={onLogIn}>
                      Sign Up
                    </Button>
                  </>
                )}
              </Center>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default PageHeader
