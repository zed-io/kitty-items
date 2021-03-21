import {Base} from "../parts/base.comp"
import PageHeader from "../parts/page-header.comp"
import {
  Box,
  Spacer,
  Text,
  Stack,
  AspectRatio,
  VStack,
  Flex,
} from "@chakra-ui/layout"

export function Page() {
  return (
    <Base>
      <PageHeader />
      <Spacer />
      <VStack spacing={12}>
        <Box h="64px">
          {/* <Image maxW="256px" src={MACHEL_MONTANO_TEXT_SVG} /> */}
        </Box>
        <Box w="100%" h="400px">
          <Stack
            direction={["column", "row"]}
            h="100%"
            alignItems="center"
            spacing={[0, 32]}
          >
            <Box flex={1}>
              <Text fontSize="5xl" align="right">
                Why a diaper?
              </Text>
            </Box>
            <Box flex={1} w="100%">
              <Flex direction={["column", "row"]}>
                <AspectRatio
                  flex={1}
                  w="100%"
                  maxW="200px"
                  ratio={1}
                  margin={["0 auto", "initial"]}
                >
                  <video loop autoPlay playsInline preload="auto">
                    <source src="/assets/diaper.mp4" type="video/mp4" />
                  </video>
                </AspectRatio>
                <Text alignSelf="flex-end" fontSize="2xl">
                  01 / 10
                </Text>
              </Flex>
            </Box>
          </Stack>
        </Box>
        <Box w="100%" h="400px">
          {/* Story content and assets - Section 2 */}
        </Box>
        <Box w="100%" h="400px">
          {/* Story content and assets - Section 3 */}
        </Box>
      </VStack>
    </Base>
  )
}
