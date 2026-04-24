import { Box, Flex } from "@chakra-ui/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { TranslationProvider } from "@/providers/TranslationProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider lang="tr">
      <Flex minH="100vh" bg="gray.50" _dark={{ bg: "gray.950" }}>
        <AdminSidebar />
        <Box flex={1} overflowY="auto">
          <AdminHeader />
          <Box p={8}>
            {children}
          </Box>
        </Box>
      </Flex>
    </TranslationProvider>
  );
}
