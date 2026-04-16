"use client"

import { Box, Button, Flex, Grid, GridItem, Heading, Input, VStack, Text, Textarea } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { FiSave } from "react-icons/fi"
import { useRouter } from "next/navigation"
import { CREATE_BRAND } from "@/constants/apiEndpoints"

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export default function AdminBrandCreate() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: ""
  })

  // Auto-generate slug when name changes, if slug hasn't been manually heavily edited
  useEffect(() => {
    if (formData.name) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.name) }))
    }
  }, [formData.name])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch(CREATE_BRAND, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert("Marka başarıyla eklendi!")
        router.push("/admin/brands")
      } else {
        alert("Marka eklenirken bir hata oluştu.")
      }
    } catch (error) {
      console.error("Marka ekleme hatası:", error)
      alert("Sunucuya ulaşılamadı veya bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={8} borderRadius="xl" shadow="sm" maxW="4xl">
      <Heading size="lg" mb={6}>Yeni Marka Ekle</Heading>
      
      <form onSubmit={handleSave}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Marka Adı</Text>
            <Input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Örn: Apple" 
              required 
            />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Slug (URL)</Text>
            <Input 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Örn: apple" 
              required 
            />
          </VStack>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Text fontWeight="medium" fontSize="sm">Açıklama</Text>
              <Textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Marka hakkında kısa bir açıklama..." 
                rows={4}
              />
            </VStack>
          </GridItem>
        </Grid>

        <Flex justify="flex-end" mt={8} gap={4}>
          <Button variant="outline" type="button" onClick={() => router.push("/admin/brands")}>İptal</Button>
          <Button colorPalette="purple" type="submit" loading={loading as unknown as boolean}>
            <FiSave />
            <Text ml={2}>Kaydet</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  )
}
