import {Base} from "../parts/base.comp"
import PageHeader from "../parts/page-header.comp"
import {Link as RouterLink} from "react-router-dom"
import {Center, Link, Text} from "@chakra-ui/layout"

export function Page() {
  return (
    <Base>
      <PageHeader />
      <Center height="500px">
        <Link to="/diaper" as={RouterLink}>
          <Text fontSize="3xl">Machel Montano's Diaper</Text>
        </Link>
      </Center>
    </Base>
  )
}
