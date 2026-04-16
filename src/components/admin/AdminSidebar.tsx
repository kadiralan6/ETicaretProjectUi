"use client"

import { Box, Flex, VStack, Text, Icon } from "@chakra-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiHome, FiBox, FiUsers, FiShoppingCart, FiTag, FiList, FiPlus } from "react-icons/fi"

const MENU_ITEMS = [
  { name: "Anasayfa", icon: FiHome, path: "/admin/dashboard" },
  { 
    name: "Ürünler", 
    icon: FiBox, 
    path: "/admin/products",
    subItems: [
      { name: "Ürün Listesi", icon: FiList, path: "/admin/products" },
      { name: "Ürün Ekle", icon: FiPlus, path: "/admin/products/create" }
    ]
  },
  { 
    name: "Kategoriler", 
    icon: FiTag, 
    path: "/admin/categories",
    subItems: [
      { name: "Kategori Listesi", icon: FiList, path: "/admin/categories" },
      { name: "Kategori Ekle", icon: FiPlus, path: "/admin/categories/create" }
    ]
  },
  { 
    name: "Markalar", 
    icon: FiTag, 
    path: "/admin/brands",
    subItems: [
      { name: "Marka Listesi", icon: FiList, path: "/admin/brands" },
      { name: "Marka Ekle", icon: FiPlus, path: "/admin/brands/create" }
    ]
  },
  { name: "Müşteriler", icon: FiUsers, path: "/admin/customers" },
  { name: "Siparişler", icon: FiShoppingCart, path: "/admin/orders" },
  { name: "Kampanya Tanımlama", icon: FiTag, path: "/admin/campaigns" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Box
      w="250px"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      h="100vh"
      position="sticky"
      top={0}
      p={5}
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
    >
      <Box mb={10} px={4}>
        <Text fontSize="2xl" fontWeight="bold" color="purple.500" letterSpacing="tight">
          E-Ticaret Admin
        </Text>
      </Box>

      <VStack align="stretch" gap={2}>
        {MENU_ITEMS.map((item) => {
          const isMainActive = item.path === '/admin/dashboard' 
            ? pathname === item.path 
            : pathname?.startsWith(item.path);

          return (
            <Box key={item.name}>
              <Link href={item.subItems ? item.subItems[0].path : item.path} passHref>
                <Flex
                  align="center"
                  p={3}
                  mx={2}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={(isMainActive && !item.subItems) ? "purple.50" : "transparent"}
                  color={isMainActive ? "purple.600" : "gray.600"}
                  _hover={{
                    bg: "gray.50",
                    color: "purple.700",
                  }}
                  _dark={{
                    color: isMainActive ? "purple.400" : "gray.400",
                    bg: (isMainActive && !item.subItems) ? "purple.900" : "transparent",
                    _hover: { bg: "whiteAlpha.200", color: "purple.300" }
                  }}
                  transition="all 0.2s"
                >
                  <item.icon size={20} />
                  <Text ml={4} fontWeight={isMainActive ? "bold" : "medium"}>
                    {item.name}
                  </Text>
                </Flex>
              </Link>
              
              {/* Sub Items */}
              {item.subItems && isMainActive && (
                <VStack align="stretch" gap={1} mt={1} pl={10} pr={2}>
                  {item.subItems.map(sub => {
                    const isSubActive = pathname === sub.path
                    return (
                      <Link key={sub.name} href={sub.path} passHref>
                        <Flex
                          align="center"
                          p={2}
                          borderRadius="md"
                          cursor="pointer"
                          bg={isSubActive ? "purple.50" : "transparent"}
                          color={isSubActive ? "purple.600" : "gray.500"}
                          _hover={{ bg: "purple.50", color: "purple.700" }}
                          _dark={{
                            bg: isSubActive ? "purple.900" : "transparent",
                            color: isSubActive ? "purple.300" : "gray.400",
                            _hover: { bg: "whiteAlpha.200", color: "purple.200" }
                          }}
                          fontSize="sm"
                        >
                          <sub.icon size={16} />
                          <Text ml={3} fontWeight={isSubActive ? "semibold" : "normal"}>{sub.name}</Text>
                        </Flex>
                      </Link>
                    )
                  })}
                </VStack>
              )}
            </Box>
          )
        })}
      </VStack>
    </Box>
  )
}
