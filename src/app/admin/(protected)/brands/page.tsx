"use client"

import { useState, useEffect } from "react"
import { Box, Flex, Heading, Input, Table, IconButton, Text, Button, Menu } from "@chakra-ui/react"
import { FiSettings, FiPlus, FiMoreVertical, FiTrash2 } from "react-icons/fi"
import Link from "next/link"
import nextApiClient from "@/util/nextApiClient"
interface Brand {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export default function AdminBrandsList() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ name: "", description: "", slug: "" })

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const res = await nextApiClient.get("/brands")
      // BFF mock nesnesi dönüyorsa dönen datanın içinde data olabilir, yoksa gerçeğe bağlı doğrudan dönüyor da olabilir.
      const data = res.data.data || res.data
      setBrands(data)
    } catch (error) {
      console.error("Markalar yüklenirken hata oluştu:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu markayı silmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await nextApiClient.delete(`/brands/${id}`)
      if (res.status === 200 || res.status === 204) {
        alert("Marka başarıyla silindi.")
        fetchBrands()
      } else {
        alert("Silme işlemi başarısız oldu.")
      }
    } catch (error) {
      console.error("Silme hatası:", error)
    }
  }

  // Filter logic
  const filteredBrands = brands?.filter(p => {
    return (
      (p.name || "").toLowerCase().includes(filters.name.toLowerCase()) &&
      (p.description || "").toLowerCase().includes(filters.description.toLowerCase()) &&
      (p.slug || "").toLowerCase().includes(filters.slug.toLowerCase())
    )
  }) || []

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

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

      <Box overflowX="auto">
        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="60px" textAlign="center">İşlem</Table.ColumnHeader>
              <Table.ColumnHeader>Marka Adı</Table.ColumnHeader>
              <Table.ColumnHeader>Açıklama</Table.ColumnHeader>
              <Table.ColumnHeader>Slug</Table.ColumnHeader>
            </Table.Row>
            {/* Filter Row */}
            <Table.Row bg="gray.50" _dark={{ bg: "gray.900" }}>
              <Table.Cell></Table.Cell>
              <Table.Cell py={2}><Input size="sm" placeholder="Ara..." value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} /></Table.Cell>
              <Table.Cell py={2}><Input size="sm" placeholder="Ara..." value={filters.description} onChange={(e) => handleFilterChange('description', e.target.value)} /></Table.Cell>
              <Table.Cell py={2}><Input size="sm" placeholder="Ara..." value={filters.slug} onChange={(e) => handleFilterChange('slug', e.target.value)} /></Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py={10}>Yükleniyor...</Table.Cell>
              </Table.Row>
            ) : filteredBrands.map(p => (
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
                        <Menu.Item
                          value="view"
                          asChild
                          px={3}
                          py={2}
                          cursor="pointer"
                          _hover={{ bg: "gray.50" }}
                          _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                          borderRadius="sm"
                        >
                          <Link href={`/admin/brands/${p.id}`} style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none' }}>
                            <FiSettings style={{ marginRight: '8px' }} color="gray" />
                            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium" color="gray.700" _dark={{ color: "gray.200" }}>Detay Görüntüle</Text>
                          </Link>
                        </Menu.Item>
                        <Menu.Item
                          value="delete"
                          px={3}
                          py={2}
                          cursor="pointer"
                          _hover={{ bg: "red.50" }}
                          _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                          borderRadius="sm"
                          onClick={() => handleDelete(p.id)}
                        >
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
                <Table.Cell>{p.description}</Table.Cell>
                <Table.Cell>{p.slug}</Table.Cell>
              </Table.Row>
            ))}
            {!loading && filteredBrands.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py={10} color="gray.500">Kayıt bulunamadı.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  )
}
