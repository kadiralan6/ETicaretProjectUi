"use client";

import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiTrendingUp, FiBookmark, FiUsers, FiHome } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useTranslation } from "@/providers/TranslationProvider";

const chartData = [
  { name: "2013", CHN: 40, USA: 24, UK: 24 },
  { name: "2014", CHN: 30, USA: 13, UK: 22 },
  { name: "2015", CHN: 20, USA: 98, UK: 22 },
  { name: "2016", CHN: 27, USA: 39, UK: 20 },
  { name: "2017", CHN: 18, USA: 48, UK: 21 },
  { name: "2018", CHN: 23, USA: 38, UK: 25 },
  { name: "2019", CHN: 34, USA: 43, UK: 32 },
];

const pieData = [
  { name: "Search Engines 30%", value: 30, color: "#00d2d3" },
  { name: "Direct Click 30%", value: 30, color: "#10ac84" },
  { name: "Bookmarks Click 40%", value: 40, color: "#ff7675" },
];

const StatCard = ({
  title,
  value,
  subText,
  icon: Icon,
  bgImage,
}: {
  title: string;
  value: string;
  subText: string;
  icon: React.ElementType;
  bgImage: string;
}) => (
  <Box
    bgImage={bgImage}
    color="white"
    p="32px"
    borderRadius="xl"
    position="relative"
    overflow="hidden"
    shadow="md"
  >
    <Flex
      justify="space-between"
      align="flex-start"
      mb="16px"
      position="relative"
      zIndex={1}
    >
      <VStack align="start" gap="4px">
        <Text fontSize="lg" fontWeight="medium" opacity={0.9}>
          {title}
        </Text>
        <Heading size="3xl" letterSpacing="tight" mt="8px">
          {value}
        </Heading>
      </VStack>
      <Box p="8px" bg="whiteAlpha.300" borderRadius="md">
        <Icon size={24} />
      </Box>
    </Flex>
    <Text
      fontSize="sm"
      opacity={0.9}
      position="relative"
      zIndex={1}
      fontWeight="medium"
      mt="16px"
    >
      {subText}
    </Text>
    <Box
      position="absolute"
      right="-5%"
      bottom="-30%"
      w="200px"
      h="200px"
      bg="whiteAlpha.100"
      borderRadius="full"
    />
  </Box>
);

export const AdminDashboardPage = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Flex align="center" gap="12px" mb="32px">
        <Box p="8px" bg="purple.500" color="white" borderRadius="md">
          <FiHome size={20} />
        </Box>
        <Heading color="gray.700" _dark={{ color: "white" }}>
          {t("admin.dashboard")}
        </Heading>
      </Flex>

      {/* Top Cards */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap="24px"
        mb="32px"
      >
        <StatCard
          title={t("admin.weeklySales")}
          value="$ 15,000"
          subText={t("admin.increasedBy")}
          icon={FiTrendingUp}
          bgImage="linear-gradient(to right, #ffbf96, #fe7096)"
        />
        <StatCard
          title={t("admin.weeklyOrders")}
          value="45,6334"
          subText={t("admin.decreasedBy")}
          icon={FiBookmark}
          bgImage="linear-gradient(to right, #90caf9, #047edf 99%)"
        />
        <StatCard
          title={t("admin.visitorsOnline")}
          value="95,5741"
          subText={t("admin.increasedBy5")}
          icon={FiUsers}
          bgImage="linear-gradient(to right, #84d9d2, #07cdae)"
        />
      </Grid>

      {/* Charts */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="24px">
        {/* Bar Chart */}
        <Box
          bg="white"
          _dark={{ bg: "gray.800" }}
          p="32px"
          borderRadius="xl"
          shadow="sm"
        >
          <Heading
            size="md"
            mb="32px"
            color="gray.700"
            _dark={{ color: "white" }}
          >
            {t("admin.visitSalesStats")}
          </Heading>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eee"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888", fontSize: 12 }}
                />
                <RechartsTooltip cursor={{ fill: "transparent" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="CHN"
                  fill="#d9a5f3"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={12}
                />
                <Bar
                  dataKey="USA"
                  fill="#69c5df"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={12}
                />
                <Bar
                  dataKey="UK"
                  fill="#f8b6b0"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Pie Chart */}
        <Box
          bg="white"
          _dark={{ bg: "gray.800" }}
          p="32px"
          borderRadius="xl"
          shadow="sm"
        >
          <Heading
            size="md"
            mb="32px"
            color="gray.700"
            _dark={{ color: "white" }}
          >
            {t("admin.trafficSources")}
          </Heading>
          <Box h="250px" position="relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <VStack align="start" gap="12px" mt="16px">
            {pieData.map((entry, idx) => (
              <Flex key={idx} align="center" gap="12px">
                <Box w="3" h="3" borderRadius="full" bg={entry.color} />
                <Text fontSize="sm" color="gray.500">
                  {entry.name}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
};
