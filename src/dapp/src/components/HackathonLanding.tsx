import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  VStack,
  HStack,
  Badge,
  Icon,
  Flex,
  useColorModeValue,
  Card,
  CardBody,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { FaRocket, FaCode, FaLightbulb, FaChartLine, FaGamepad, FaCoins, FaLock, FaRobot } from "react-icons/fa";
import { ConnectButton } from "./ConnectButton";

const projectCategories = [
  {
    icon: FaCoins,
    title: "DeFi & Payments",
    ideas: ["Cross-chain DEX", "Yield aggregator", "Stablecoin protocol", "P2P lending platform"],
    color: "purple",
    trending: true,
  },
  {
    icon: FaGamepad,
    title: "Gaming & Metaverse",
    ideas: ["Play-to-earn games", "NFT marketplace", "Virtual worlds", "Gaming guilds"],
    color: "pink",
    trending: true,
  },
  {
    icon: FaRobot,
    title: "AI & Oracles",
    ideas: ["AI-powered trading bots", "Decentralized oracles", "Prediction markets", "Data verification"],
    color: "cyan",
    trending: false,
  },
  {
    icon: FaLock,
    title: "Infrastructure",
    ideas: ["Multi-sig wallets", "DAO tooling", "Identity solutions", "Privacy protocols"],
    color: "green",
    trending: false,
  },
  {
    icon: FaChartLine,
    title: "Analytics & Tools",
    ideas: ["Portfolio trackers", "Block explorers", "Developer tools", "Analytics dashboards"],
    color: "orange",
    trending: false,
  },
  {
    icon: FaLightbulb,
    title: "Social & Community",
    ideas: ["Decentralized social", "Creator economy", "Community rewards", "Content platforms"],
    color: "blue",
    trending: true,
  },
];

const HackathonLanding: React.FC = () => {
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Hero Section */}
      <Container maxW="7xl" pt={12} pb={8}>
        <VStack spacing={8} align="center" textAlign="center">
          <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
            TOKEN 2049 SINGAPORE
          </Badge>
          
          <Heading
            as="h1"
            size="4xl"
            bgGradient="linear(to-r, blue.400, purple.600)"
            bgClip="text"
            fontWeight="extrabold"
          >
            Alpha TON Capital
          </Heading>
          
          <Heading as="h2" size="xl" color={textColor}>
            Blockchain Hackathon 2025
          </Heading>
          
          <Text fontSize="xl" color={textColor} maxW="3xl">
            Build the future of Web3 on TON. Join developers worldwide to create innovative dApps 
            using this powerful scaffolding toolkit.
          </Text>
          
          <HStack spacing={4} mt={4}>
            <ConnectButton />
            <Button
              size="lg"
              colorScheme="purple"
              rightIcon={<FaCode />}
              onClick={() => window.open("https://github.com/AlphaTONCapital/ton-scaffolding/blob/main/README.md", "_blank")}
            >
              View Blueprint Docs
            </Button>
          </HStack>
          
          <HStack spacing={8} pt={4}>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="purple.500">$100K</Text>
              <Text color={textColor}>Prize Pool</Text>
            </VStack>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="blue.500">48hrs</Text>
              <Text color={textColor}>Build Time</Text>
            </VStack>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="green.500">10+</Text>
              <Text color={textColor}>Categories</Text>
            </VStack>
          </HStack>
        </VStack>
      </Container>

      <Divider />

      {/* Trending Project Ideas */}
      <Container maxW="7xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl">
              🔥 Trending Project Ideas
            </Heading>
            <Text fontSize="lg" color={textColor}>
              Get inspired by the most popular categories for TON blockchain development
            </Text>
          </VStack>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} w="full">
            {projectCategories.map((category, index) => (
              <GridItem key={index}>
                <Card
                  bg={cardBg}
                  borderWidth={2}
                  borderColor={category.trending ? `${category.color}.200` : "transparent"}
                  _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
                  transition="all 0.3s"
                  position="relative"
                  overflow="hidden"
                >
                  {category.trending && (
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme="red"
                      variant="solid"
                      fontSize="xs"
                    >
                      TRENDING
                    </Badge>
                  )}
                  
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <HStack>
                        <Icon as={category.icon} boxSize={8} color={`${category.color}.500`} />
                        <Heading size="md">{category.title}</Heading>
                      </HStack>
                      
                      <Stack spacing={2}>
                        {category.ideas.map((idea, ideaIndex) => (
                          <HStack key={ideaIndex}>
                            <Text color={`${category.color}.500`}>•</Text>
                            <Text fontSize="sm" color={textColor}>
                              {idea}
                            </Text>
                          </HStack>
                        ))}
                      </Stack>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme={category.color}
                        rightIcon={<FaRocket />}
                        w="full"
                        onClick={() => window.open("https://github.com/AlphaTONCapital/ton-scaffolding", "_blank")}
                      >
                        Start Building
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>

      {/* Getting Started Section */}
      <Box bg={useColorModeValue("gray.50", "gray.900")} py={16}>
        <Container maxW="7xl">
          <VStack spacing={8}>
            <Heading size="xl" textAlign="center">
              Quick Start with Blueprint
            </Heading>
            
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} w="full">
              <Card bg={cardBg}>
                <CardBody>
                  <VStack spacing={3}>
                    <Text fontSize="4xl">1️⃣</Text>
                    <Heading size="md">Clone & Setup</Heading>
                    <Text fontSize="sm" color={textColor} textAlign="center">
                      Clone this scaffold repository and install dependencies
                    </Text>
                    <Box bg="gray.100" p={2} borderRadius="md" w="full">
                      <Text fontSize="xs" fontFamily="mono">npm install</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <VStack spacing={3}>
                    <Text fontSize="4xl">2️⃣</Text>
                    <Heading size="md">Build Smart Contracts</Heading>
                    <Text fontSize="sm" color={textColor} textAlign="center">
                      Use Blueprint to develop and test your TON contracts
                    </Text>
                    <Box bg="gray.100" p={2} borderRadius="md" w="full">
                      <Text fontSize="xs" fontFamily="mono">npm run build</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <VStack spacing={3}>
                    <Text fontSize="4xl">3️⃣</Text>
                    <Heading size="md">Deploy & Ship</Heading>
                    <Text fontSize="sm" color={textColor} textAlign="center">
                      Deploy to testnet/mainnet and launch your dApp
                    </Text>
                    <Box bg="gray.100" p={2} borderRadius="md" w="full">
                      <Text fontSize="xs" fontFamily="mono">npm run deploy</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="7xl" py={16}>
        <Card bg={cardBg} borderWidth={2} borderColor="purple.200">
          <CardBody>
            <VStack spacing={6} textAlign="center" py={8}>
              <Heading size="lg">Ready to Build on TON?</Heading>
              <Text fontSize="lg" color={textColor}>
                Join the hackathon and compete for prizes while building the future of blockchain
              </Text>
              <HStack spacing={4}>
                <Button size="lg" colorScheme="purple">
                  Register Now
                </Button>
                <Button size="lg" variant="outline" colorScheme="purple">
                  Join Discord
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default HackathonLanding;