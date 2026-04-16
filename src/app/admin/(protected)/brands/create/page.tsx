"use client"

import { Box, Button, Flex, Grid, GridItem, Heading, Input, VStack, Text, Textarea } from "@chakra-ui/react"
import { useState } from "react"
import { FiSave } from "react-icons/fi"
import { useRouter } from "next/navigation"
import axios from "axios"

// Yardımcı Fonksiyon: Slug oluşturucu (Türkçe karakterleri dönüştürür)
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Boşlukları tireye çevir
    .replace(/[ç]+Ref/g, 'c')       // Özel karakterleri handle edebilmek için manuel replace kullanmak iyidir
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ı/g, 'i')
    .replace(/[^\w\-]+/g, '')       // Alfanumerik olmayanları sil
    .replace(/\-\-+/g, '-')         // Birden fazla tireyi tek tire yap
    .replace(/^-+/, '')             // Baştaki tireyi sil
    .replace(/-+$/, '');            // Sondaki tireyi sil
}

export default function AdminBrandCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // DTO: CreateBrandDto
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Eğer 'name' değişiyorsa ve kullanıcı slug'a manuel dokunmadıysa, slug'ı otomatik doldur
    if (name === "name") {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: generateSlug(value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post("/api/brands/create", formData)
      alert("Marka başarıyla kaydedildi!")
      router.push("/admin/brands")
    } catch (error: any) {
      console.error("Marka kaydedilirken hata:", error)
      alert(error.response?.data?.error || "Kayıt işlemi başarısız oldu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={8} borderRadius="xl" shadow="sm" maxW="3xl">
      <Heading size="lg" mb={6}>Yeni Marka Ekle</Heading>
      
      <form onSubmit={handleSave}>
        <Grid templateColumns={{ base: "1fr" }} gap={6}>
          
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Marka Adı <Text as="span" color="red.500">*</Text></Text>
            <Input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Örn: Apple" 
              required 
            />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Açıklama</Text>
            <Textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Marka hakkında kısa bir açıklama girin..." 
              rows={4}
            />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Arama Motoru Uzantısı (Slug) <Text as="span" color="red.500">*</Text></Text>
            <Input 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Örn: apple" 
              required 
            />
            <Text fontSize="xs" color="gray.500">Bu alan URL üzerinde görünür. Genellikle Marka adından otomatik doldurulur.</Text>
          </VStack>

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
