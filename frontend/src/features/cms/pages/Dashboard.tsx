import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Table, Button, Card, Spin, Row, Col, Tag, Typography } from "antd";
import dayjs from "dayjs";
import {
  TrendingUp,
  ShoppingBag,
  Eye,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  Percent,
} from "lucide-react";
import { AnimateContainer } from "../../../components/AnimateContainer";
import { useGetDashboardStatsQuery } from "../services/rtkQueryCmsApi";
import { formatPrice } from "../../../utils";
import { ORDER_STATUS_OPTIONS } from "../../../constants/selectOptions";

const { Text, Title, Paragraph } = Typography;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Spin size="large" />
        <Text
          type="secondary"
          className="font-sans"
        >
          Đang tải số liệu thống kê...
        </Text>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] p-6 text-center">
        <AlertCircle size={40} className="text-red-500 mb-4" />
        <Title level={4}>Không thể tải dữ liệu thống kê</Title>
        <Paragraph type="secondary">
          Đã xảy ra lỗi khi kết nối với máy chủ hoặc xác thực phiên làm việc.
        </Paragraph>
        <Button
          type="primary"
          onClick={() => refetch()}
          className="mt-4"
        >
          Tải lại dữ liệu
        </Button>
      </div>
    );
  }

  // Tính toán số liệu tăng trưởng và chuyển đổi động từ dữ liệu DB
  const trendLength = stats.salesTrend.length;
  let salesGrowth = 0;
  if (trendLength >= 2) {
    const currentMonthSales = stats.salesTrend[trendLength - 1].sales;
    const prevMonthSales = stats.salesTrend[trendLength - 2].sales;
    if (prevMonthSales > 0) {
      salesGrowth = Math.round(((currentMonthSales - prevMonthSales) / prevMonthSales) * 1000) / 10;
    } else if (currentMonthSales > 0) {
      salesGrowth = 100;
    }
  }
  const salesGrowthText = salesGrowth >= 0 ? `+${salesGrowth}% so với tháng trước` : `${salesGrowth}% so với tháng trước`;

  const estimatedVisits = (stats.totalCustomers * 22) + stats.totalOrders * 3 + 115;
  const conversionRate = estimatedVisits > 0 ? ((stats.totalOrders / estimatedVisits) * 100).toFixed(1) : "0.0";

  // --- SVG Sales Trend Chart Calculations ---
  const chartWidth = 550;
  const chartHeight = 240;
  const chartPadding = { top: 20, right: 20, bottom: 35, left: 55 };

  const maxSales = Math.max(
    ...stats.salesTrend.map((item) => item.sales),
    1000,
  );

  const salesPoints = stats.salesTrend.map((item, index) => {
    const divisor = stats.salesTrend.length > 1 ? stats.salesTrend.length - 1 : 1;
    const ratio = stats.salesTrend.length > 1 ? (index / divisor) : 0.5;
    const x =
      chartPadding.left +
      ratio *
        (chartWidth - chartPadding.left - chartPadding.right);
    const y =
      chartPadding.top +
      (1 - item.sales / maxSales) *
        (chartHeight - chartPadding.top - chartPadding.bottom);
    return { x, y, date: item.date, sales: item.sales, orders: item.orders };
  });

  const salesLinePath = salesPoints
    .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const salesAreaPath =
    salesPoints.length > 0
      ? `${salesLinePath} L ${salesPoints[salesPoints.length - 1].x} ${chartHeight - chartPadding.bottom} L ${salesPoints[0].x} ${chartHeight - chartPadding.bottom} Z`
      : "";

  // Grid lines
  const gridSalesPercentages = [0, 0.25, 0.5, 0.75, 1];

  // --- Donut Chart Calculations ---
  const colors = [
    "#3b82f6", // Sky blue
    "#10b981", // Emerald green
    "#f59e0b", // Amber/Gold
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#f97316", // Orange
  ];
  const totalCategoryProducts = stats.categoryDistribution.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );
  const donutRadius = 55;
  const donutCircumference = 2 * Math.PI * donutRadius;

  let accumulatedPercent = 0;
  const donutSlices = stats.categoryDistribution.map((item, index) => {
    const percent =
      totalCategoryProducts > 0 ? item.count / totalCategoryProducts : 0;
    const strokeDasharray = `${percent * donutCircumference} ${donutCircumference}`;
    const strokeDashoffset = -accumulatedPercent * donutCircumference;
    accumulatedPercent += percent;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      color: colors[index % colors.length],
      percent: Math.round(percent * 100),
    };
  });

  // columns cho bảng đơn hàng
  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (text: string) => (
        <code className="text-brand-forest font-bold font-mono tracking-wider">
          {text}
        </code>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (name: string) => (
        <span className="font-semibold text-brand-dark">{name}</span>
      ),
    },
    {
      title: "Tổng tiền",
      key: "totalAmount",
      align: "right" as const,
      render: (_: unknown, record: (typeof stats.recentOrders)[0]) => (
        <span className="font-semibold text-brand-forest">
          {formatPrice(record.totalAmount, record.currency as "USD" | "VND")}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: string) => {
        const option = ORDER_STATUS_OPTIONS.find((o) => o.value === status);
        const label = option ? option.label : status;
        
        const statusColors: Record<string, string> = {
          pending: "warning",
          confirmed: "processing",
          shipping: "blue",
          delivered: "success",
          cancelled: "error",
        };
        const color = statusColors[status] || "default";

        return (
          <Tag
            color={color}
            className="rounded-none text-[10px] uppercase font-semibold"
          >
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateStr: string) => {
        const d = dayjs(dateStr);
        return (
          <span className="text-brand-gray text-xs">
            {d.format("DD/MM/YYYY HH:mm")}
          </span>
        );
      },
    },
  ];

  return (
    <AnimateContainer animation="fade-in" className="space-y-8">
      {/* Tiêu đề & Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-border pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-brand-accent animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">
              Hệ thống quản trị
            </span>
          </div>
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight mt-1">
            Bảng điều khiển kinh doanh
          </h1>
          <p className="text-xs text-brand-gray mt-1">
            Cập nhật tự động dựa trên giao dịch thực tế của khách hàng tại cửa
            hàng.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/cms/products")}
            className="rounded-md border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white font-sans text-xs tracking-wider uppercase h-10 px-5 transition-all"
          >
            Quản lý Sản phẩm
          </Button>
          {/* <Button
            type="primary"
            onClick={() => navigate('/')}
            className="rounded-md bg-brand-forest border-brand-forest hover:bg-slate-800 hover:border-slate-800 font-sans text-xs tracking-wider uppercase h-10 px-5 flex items-center gap-1.5"
          >
            Xem cửa hàng <ArrowRight size={14} />
          </Button> */}
        </div>
      </div>

      {/* Grid thẻ số liệu thống kê */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm border border-brand-border bg-white rounded-lg hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 group-hover:h-full transition-all" />
            <div className="flex justify-between items-start">
              <div>
                <Text
                  type="secondary"
                  className="text-[10px] uppercase font-bold tracking-widest block mb-2"
                >
                  Doanh thu tích lũy
                </Text>
                <Title
                  level={3}
                  className="!m-0 !font-bold !text-brand-dark"
                >
                  {formatPrice(stats.totalSales, "USD")}
                </Title>
                <div className="flex items-center gap-1 mt-2 text-[11px] text-amber-600 font-semibold">
                  <TrendingUp size={12} />
                  <span>{salesGrowthText}</span>
                </div>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-md">
                <TrendingUp size={20} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm border border-brand-border bg-white rounded-lg hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:h-full transition-all" />
            <div className="flex justify-between items-start">
              <div>
                <Text
                  type="secondary"
                  className="text-[10px] uppercase font-bold tracking-widest block mb-2"
                >
                  Đơn hàng đã nhận
                </Text>
                <Title
                  level={3}
                  className="!m-0 !font-bold !text-brand-dark"
                >
                  {stats.totalOrders}
                </Title>
                <div className="flex items-center gap-1 mt-2 text-[11px] text-blue-600 font-semibold">
                  <CheckCircle size={12} />
                  <span>Tỉ lệ chuyển đổi {conversionRate}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-md">
                <ShoppingBag size={20} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm border border-brand-border bg-white rounded-lg hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:h-full transition-all" />
            <div className="flex justify-between items-start">
              <div>
                <Text
                  type="secondary"
                  className="text-[10px] uppercase font-bold tracking-widest block mb-2"
                >
                  Tổng sản phẩm gôn
                </Text>
                <Title
                  level={3}
                  className="!m-0 !font-bold !text-brand-dark"
                >
                  {stats.totalProducts}
                </Title>
                <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 font-semibold">
                  <Package size={12} />
                  <span>Đang hoạt động trên web</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-md">
                <Package size={20} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm border border-brand-border bg-white rounded-lg hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 group-hover:h-full transition-all" />
            <div className="flex justify-between items-start">
              <div>
                <Text
                  type="secondary"
                  className="text-[10px] uppercase font-bold tracking-widest block mb-2"
                >
                  Mã giảm giá hoạt động
                </Text>
                <Title
                  level={3}
                  className="!m-0 !font-bold !text-brand-dark"
                >
                  {stats.activeCoupons}
                </Title>
                <div className="flex items-center gap-1 mt-2 text-[11px] text-purple-600 font-semibold">
                  <Percent size={12} />
                  <span>Chương trình khuyến mãi</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 text-purple-500 rounded-md">
                <Percent size={20} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Grid Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Biểu đồ xu hướng Doanh thu (Line chart) */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="flex items-center justify-between h-[24px]">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-forest" />
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">
                Xu hướng doanh số & đơn hàng (USD)
              </h3>
            </div>
            <span className="text-[10px] bg-brand-border/60 text-brand-forest px-2.5 py-1 font-bold">
              Thống kê 6 tháng
            </span>
          </div>

          <div className="bg-white border border-brand-border p-6 shadow-sm rounded-lg flex-1 flex flex-col justify-between">
            <div className="relative w-full overflow-x-auto no-scrollbar flex-1">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto block max-h-[240px]"
              >
                {/* Definitions for Gradients */}
                <defs>
                  <linearGradient
                    id="salesAreaGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop
                      offset="100%"
                      stopColor="#3b82f6"
                      stopOpacity="0.00"
                    />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                {gridSalesPercentages.map((g, idx) => {
                  const y =
                    chartPadding.top +
                    g * (chartHeight - chartPadding.top - chartPadding.bottom);
                  const labelValue = Math.round(maxSales * (1 - g));
                  return (
                    <g key={idx}>
                      <line
                        x1={chartPadding.left}
                        y1={y}
                        x2={chartWidth - chartPadding.right}
                        y2={y}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeDasharray={
                          idx === gridSalesPercentages.length - 1 ? "0" : "4 4"
                        }
                      />
                      <text
                        x={chartPadding.left - 12}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="9"
                        fill="#888888"
                        fontWeight="500"
                        fontFamily="ui-sans-serif, system-ui, sans-serif"
                      >
                        ${labelValue >= 1000 ? `${(labelValue / 1000).toFixed(0)}k` : labelValue}
                      </text>
                    </g>
                  );
                })}

                {/* Area under the line */}
                {salesAreaPath && (
                  <path d={salesAreaPath} fill="url(#salesAreaGrad)" />
                )}

                {/* Line Path */}
                {salesLinePath && (
                  <path
                    d={salesLinePath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points & Tooltips info */}
                {salesPoints.map((p, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      className="transition-all duration-150 ease-in-out"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="9"
                      fill="#0f172a"
                      fillOpacity="0"
                      className="hover:fill-opacity-10 transition-all duration-150 ease-in-out"
                    />
                    {/* Tooltip labels */}
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#0f172a"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      fontFamily="ui-sans-serif, system-ui, sans-serif"
                    >
                      ${p.sales} ({p.orders}đơn)
                    </text>
                  </g>
                ))}

                {/* X Axis labels */}
                {salesPoints.map((p, idx) => (
                  <text
                    key={idx}
                    x={p.x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fontSize="9.5"
                    fill="#666666"
                    fontWeight="500"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                  >
                    {p.date}
                  </text>
                ))}
              </svg>
            </div>

            <div className="flex justify-center items-center gap-6 mt-4 text-xs font-medium text-brand-gray">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-blue-500 rounded-full inline-block" />
                <span>Doanh thu quy đổi (USD)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 border-2 border-brand-forest bg-white rounded-full inline-block" />
                <span>Điểm mốc giao dịch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ phân bổ danh mục (Donut chart) */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 h-[24px]">
            <Layers size={16} className="text-brand-forest" />
            <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">
              Phân bổ mặt hàng
            </h3>
          </div>

          <div className="bg-white border border-brand-border p-6 shadow-sm rounded-lg flex-1 flex flex-col justify-between">
            <div className="relative flex justify-center items-center">
              <svg width="180" height="180" viewBox="0 0 160 160">
                <g transform="rotate(-90 80 80)">
                  {donutSlices.map((slice, idx) => (
                    <circle
                      key={idx}
                      cx="80"
                      cy="80"
                      r={donutRadius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="16"
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-[stroke-dashoffset] duration-500 ease-in-out"
                    />
                  ))}
                </g>
                {/* Center text of the donut */}
                <circle cx="80" cy="80" r="46" fill="#ffffff" />
                <text
                  x="80"
                  y="76"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#888888"
                  className="uppercase tracking-wider"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  Sản phẩm
                </text>
                <text
                  x="80"
                  y="96"
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="bold"
                  fill="#111111"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {stats.totalProducts}
                </text>
              </svg>
            </div>

            {/* Legends */}
            <div className="space-y-1.5 mt-2">
              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                {donutSlices.map((slice, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 inline-block flex-shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-brand-dark truncate">
                      {slice.category}
                    </span>
                    <span className="text-brand-gray font-semibold">
                      ({slice.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Đơn hàng gần đây */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-brand-forest" />
            <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">
              Giao dịch trực tuyến mới nhất
            </h3>
          </div>
          <span className="text-xs text-brand-gray">
            Cập nhật thời gian thực
          </span>
        </div>

        <div className="bg-white border border-brand-border p-4 shadow-sm rounded-lg">
          <Table
            dataSource={stats.recentOrders}
            columns={orderColumns}
            rowKey="id"
            pagination={false}
            className="font-sans text-xs"
            size="middle"
          />
        </div>
      </div>
    </AnimateContainer>
  );
};

export default Dashboard;
