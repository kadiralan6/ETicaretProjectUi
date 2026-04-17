"use client"

import { useState, useEffect } from "react"
import { Box, Flex, Heading, Input, Table, IconButton, Text, Badge, Button, Menu, Spinner } from "@chakra-ui/react"
import { FiPlus, FiMoreVertical, FiTrash2, FiSettings } from "react-icons/fi"
import Link from "next/link"
import axios from "axios"
import toast from "react-hot-toast"

interface Brand {
  id: number;
  name: string;
  description: string;
  slug: string;
  isActive: boolean | null;
  isDeleted: boolean;
  createdAt: string;
  createdBy: number | null;
  modifiedAt: string | null;
  modifiedBy: number | null;
  deletedAt: string | null;
  deletedBy: number | null;
}

export default function AdminBrandsList() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [pageCount, setPageCount] = useState(1)
  const [rowCount, setRowCount] = useState(0)

  // BaseFilterDto states
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const fetchBrands = async () => {
    setLoading(true)
    try {
      // Proxying via our Next.js API Route Server we just created
      const res = await axios.get("/api/brands/getAll", {
        params: {
          Page: page,
          PageSize: 10,
          Search: search || undefined
        }
      })
      // API: { isSuccess, data: { results: [...], pageCount, rowCount, ... } }
      const paged = res.data?.data
      setBrands(paged?.results ?? [])
      setPageCount(paged?.pageCount ?? 1)
      setRowCount(paged?.rowCount ?? 0)
    } catch (error: any) {
      console.error("Markaları çekerken hata:", error)
      toast.error(error.response?.data?.message || "Markalar yüklenirken bir sorun oluştu.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBrands()
    }, 500) // Debounce search

    return () => clearTimeout(delayDebounceFn)
  }, [page, search])

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" shadow="sm">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Marka Listesi</Heading>
        <Link href="/admin/brands/create" passHref>
          <Button colorPalette="purple" size="sm">
            <FiPlus />
            <Text ml={2}>Yeni Marka Ekle</Text>
          </Button>
        </Link>
      </Flex>

      <Flex mb={4}>
        <Input 
          placeholder="Marka Ara (İsim veya Slug ile)" 
          maxW="300px" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Flex>
      
      <Box overflowX="auto" position="relative" minH="200px">
        {loading && (
           <Flex position="absolute" top={0} left={0} w="full" h="full" bg="whiteAlpha.700" _dark={{ bg: "blackAlpha.600" }} zIndex={10} justify="center" align="center">
             <Spinner size="lg" color="purple.500" />
           </Flex>
        )}
        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="60px" textAlign="center">İşlem</Table.ColumnHeader>
              <Table.ColumnHeader>Marka Adı</Table.ColumnHeader>
              <Table.ColumnHeader>Slug</Table.ColumnHeader>
              <Table.ColumnHeader>Açıklama</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Durum</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {brands?.length > 0 ? brands.map(p => (
              <Table.Row key={p.id}>
                <Table.Cell textAlign="center" position="relative" overflow="visible">
                  <Menu.Root positioning={{ placement: "bottom-start" }}>
                    <Menu.Trigger asChild>
                      <IconButton aria-label="Settings" variant="ghost" size="sm" color="gray.500">
                        <FiMoreVertical />
                      </IconButton>
                    </Menu.Trigger>
                    <Menu.Positioner style={{ position: 'absolute', zIndex: 20 }}>
                      <Menu.Content
                        position="absolute"
                        top="100%"
                        mt={1}
                        minW="160px"
                        bg="white"
                        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                        boxShadow="xl"
                        border="1px solid"
                        borderColor="gray.100"
                        borderRadius="md"
                        p={1}
                        zIndex={20}
                      >
                        <Menu.Item value="view" asChild px={3} py={2} cursor="pointer" _hover={{ bg: "gray.50" }} _dark={{ _hover: { bg: "whiteAlpha.200" } }} borderRadius="sm">
                          <Link href={`/admin/brands/${p.id}`} style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none' }}>
                            <FiSettings style={{ marginRight: '8px' }} color="gray" />
                            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium" color="gray.700" _dark={{ color: "gray.200" }}>Detay Görüntüle</Text>
                          </Link>
                        </Menu.Item>
                        <Menu.Item value="delete" px={3} py={2} cursor="pointer" _hover={{ bg: "red.50" }} _dark={{ _hover: { bg: "whiteAlpha.200" } }} borderRadius="sm">
                          <Flex align="center" w="full">
                            <FiTrash2 style={{ marginRight: '8px' }} color="red" />
                            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium" color="red.500">Sil</Text>
                          </Flex>
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Table.Cell>
                <Table.Cell fontWeight="medium">{p.name}</Table.Cell>
                <Table.Cell color="gray.500">{p.slug}</Table.Cell>
                <Table.Cell>{p.description?.substring(0, 50)}{p.description?.length > 50 ? '...' : ''}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Badge colorPalette={p.isActive === false ? "red" : "green"}>
                    {p.isActive === false ? "Pasif" : "Aktif"}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            )) : (
              !loading && (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center" py={10} color="gray.500">
                    Kayıt bulunamadı.
                  </Table.Cell>
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Basic Pagination Controls */}
      <Flex justify="space-between" align="center" mt={4}>
        <Text fontSize="sm" color="gray.500">Sayfa {page} / {pageCount} &bull; Toplam {rowCount} kayıt</Text>
        <Flex gap={2}>
          <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Önceki</Button>
          <Button size="sm" variant="outline" disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>Sonraki</Button>
        </Flex>
      </Flex>

    </Box>
  )
}
