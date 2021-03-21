import React, {Suspense} from "react"
import {useAccountItem} from "../hooks/use-account-item.hook"
import {useMarketItem} from "../hooks/use-market-item.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {IDLE} from "../global/constants"
import {
  Tr,
  Td,
  Button,
  Spinner,
  Flex,
  Center,
  Text,
  HStack,
} from "@chakra-ui/react"

// export const ItemImage = ({type}) => {
//   let [item, setItemImage] = useState("")

//   useEffect(() => {
//     async function getImage() {
//       let importedIcon = await import(`../svg/Items/item0${type}.svg`)
//       setItemImage(importedIcon.default)
//     }
//     getImage()
//   }, [type])

//   return <Image maxW="64px" src={item} />
// }

export function AccountItemCluster({address, id}) {
  const item = useAccountItem(address, id)
  const list = useMarketItem(address, id)
  const [cu] = useCurrentUser()

  const BUSY = item.status !== IDLE

  if (address == null) return null
  if (id == null) return null

  return (
    <Tr>
      <Td maxW="50px">
        <Flex>
          <Text as={item.forSale && "del"}>#{item.id}</Text>
        </Flex>
      </Td>
      <Td>
        <Text>{item.name}</Text>
      </Td>
      <Td>
        <Text>{item.country}</Text>
      </Td>
      <Td>
        <Text>{item.year}</Text>
      </Td>
      {/* <Td>
        <ItemImage type={item.type} />
      </Td> */}
      {cu.addr === address && (
        <>
          {!item.forSale ? (
            <Td isNumeric maxW="100px">
              <Button
                colorScheme="blue"
                size="sm"
                disabled={BUSY}
                onClick={() => item.sell("10.0")}
              >
                <HStack>
                  {BUSY && <Spinner mr="2" size="xs" />}{" "}
                  <Text>List for 10 CULTURE TOKEN</Text>
                </HStack>
              </Button>
            </Td>
          ) : (
            <Td isNumeric maxW="50px">
              <Button
                size="sm"
                colorScheme="orange"
                disabled={BUSY}
                onClick={list.cancelListing}
              >
                <HStack>
                  {BUSY && <Spinner mr="2" size="xs" />} <Text>Unlist</Text>
                </HStack>
              </Button>
            </Td>
          )}
        </>
      )}
    </Tr>
  )
}

export default function WrappedAccountItemCluster(props) {
  return (
    <Suspense
      fallback={
        <Tr>
          <Td>
            <Flex>
              <Text>#{props.id}</Text>
              <Center ml="4">
                <Spinner size="xs" />
              </Center>
            </Flex>
          </Td>
          <Td />
          <Td />
          <Td />
        </Tr>
      }
    >
      <AccountItemCluster {...props} />
    </Suspense>
  )
}
