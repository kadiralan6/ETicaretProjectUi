import { Box, Flex } from "@chakra-ui/react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex minH="100vh" bg="gray.50" _dark={{ bg: "gray.950" }}>
      {/* Fixed Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <Box flex={1} overflowY="auto">
        <AdminHeader />

        {/* Page Content */}
        <Box p={8}>
          {children}
        </Box>
      </Box>
    </Flex>
  )
}
