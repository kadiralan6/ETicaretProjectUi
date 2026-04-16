"use client"

import { Box, Flex, HStack, Text, Avatar, Button, IconButton } from "@chakra-ui/react"
import { FiLogOut, FiBell, FiMenu, FiSearch } from "react-icons/fi"
import { useRouter } from "next/navigation"

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    // Session cleaning logic will go here later
    router.push("/admin/login")
  }

  return (
    <Box 
      h="70px" 
      bg="white" 
      borderBottom="1px solid" 
      borderColor="gray.200"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      w="full"
      px={8}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex h="full" align="center" justify="space-between">
        {/* Left Side: Mobile Menu toggle & Search (placeholders) */}
        <HStack gap={4}>
          <IconButton aria-label="Menu" variant="ghost" size="sm" display={{ base: "flex", md: "none" }}>
            <FiMenu />
          </IconButton>
          <HStack color="gray.400" display={{ base: "none", md: "flex" }}>
            <FiSearch />
            <Text fontSize="sm">Search projects...</Text>
          </HStack>
        </HStack>

        {/* Right Side: Profile & Actions */}
        <HStack gap={6}>
          <IconButton aria-label="Notifications" variant="ghost" size="sm" color="gray.500">
            <FiBell size={20} />
          </IconButton>

          <HStack gap={3}>
            <Avatar.Root size="sm">
              <Avatar.Fallback name="Admin User" />
              <Avatar.Image src="https://i.pravatar.cc/150?u=admin" />
            </Avatar.Root>
            <Box display={{ base: "none", md: "block" }}>
              <Text fontSize="sm" fontWeight="semibold">David Greymaax</Text>
              <Text fontSize="xs" color="gray.500">Project Manager</Text>
            </Box>
          </HStack>

          <Button 
            variant="ghost" 
            colorPalette="red" 
            size="sm" 
            onClick={handleLogout}
          >
            <FiLogOut />
            <Text ml={2} display={{ base: "none", md: "block" }}>Çıkış Yap</Text>
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}
