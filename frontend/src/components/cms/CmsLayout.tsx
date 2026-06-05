import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  ConfigProvider,
} from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  OrderedListOutlined,
  GiftOutlined,
  TeamOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../features/auth/store/authSlice";

const { Header, Sider, Content } = Layout;

export const CmsLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/cms",
      icon: <DashboardOutlined style={{ fontSize: "16px" }} />,
      label: "Bảng điều khiển",
      onClick: () => navigate("/cms"),
    },
    {
      key: "/cms/products",
      icon: <ShoppingOutlined style={{ fontSize: "16px" }} />,
      label: "Sản phẩm",
      onClick: () => navigate("/cms/products"),
    },
    {
      key: "/cms/orders",
      icon: <OrderedListOutlined style={{ fontSize: "16px" }} />,
      label: "Đơn hàng",
      onClick: () => navigate("/cms/orders"),
    },
    {
      key: "/cms/coupons",
      icon: <GiftOutlined style={{ fontSize: "16px" }} />,
      label: "Mã giảm giá",
      onClick: () => navigate("/cms/coupons"),
    },
    {
      key: "/cms/customers",
      icon: <TeamOutlined style={{ fontSize: "16px" }} />,
      label: "Khách hàng",
      onClick: () => navigate("/cms/customers"),
    },
    {
      key: "/cms/payments",
      icon: <CreditCardOutlined style={{ fontSize: "16px" }} />,
      label: "Thanh toán",
      onClick: () => navigate("/cms/payments"),
    },
    // {
    //   key: "/",
    //   icon: <HomeOutlined style={{ fontSize: "16px" }} />,
    //   label: "Cửa hàng chính",
    //   onClick: () => navigate("/"),
    // },
  ];

  const userMenu = {
    items: [
      {
        key: "profile",
        label: (
          <div style={{ padding: "8px 12px", minWidth: "180px" }}>
            <div
              style={{ fontWeight: 600, color: "#0f172a", fontSize: "13px" }}
            >
              {user?.fullName || "Administrator"}
            </div>
            <div
              style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}
            >
              {user?.email || "admin@southcape.com"}
            </div>
            <div
              style={{
                display: "inline-block",
                fontSize: "9px",
                color: "#c8a96e",
                border: "1px solid #c8a96e",
                padding: "1px 6px",
                marginTop: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: "bold",
              }}
            >
              {user?.role || "Admin"}
            </div>
          </div>
        ),
      },
      {
        type: "divider" as const,
      },
      {
        key: "logout",
        icon: <LogoutOutlined style={{ color: "#ef4444" }} />,
        label: (
          <span style={{ color: "#ef4444", fontWeight: 500 }}>Đăng xuất</span>
        ),
        onClick: handleLogout,
      },
    ],
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: "#0f172a", // Deep slate primary
          colorInfo: "#c8a96e", // Gold accent
          colorSuccess: "#10b981",
          colorWarning: "#f59e0b",
          colorError: "#ef4444",
          borderRadius: 6, // Modern rounded edges
          fontFamily:
            "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        },
        components: {
          Layout: {
            siderBg: "#0f172a", // Deep slate sidebar
            headerBg: "#ffffff",
            bodyBg: "#fafafa", // Clean light background
          },
          Menu: {
            darkItemBg: "#0f172a",
            darkItemColor: "#94a3b8", // Muted slate color
            darkItemSelectedBg: "rgba(200, 169, 110, 0.15)", // Light gold overlay
            darkItemSelectedColor: "#c8a96e", // Golden active text
            darkItemHoverBg: "rgba(255, 255, 255, 0.03)",
            darkItemHoverColor: "#ffffff",
            itemHeight: 48,
          },
          // Table: {
          //   headerBg: "#f8fafc",
          //   headerColor: "#0f172a",
          //   rowHoverBg: "#f1f5f9",
          //   borderRadius: 6,
          // },
          // Card: {
          //   borderRadius: 6,
          //   colorBgContainer: "#ffffff",
          // },
        },
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
          fontFamily:
            "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        }}
      >
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="dark"
          width={260}
          style={{
            boxShadow: "4px 0 24px rgba(0, 0, 0, 0.05)",
            zIndex: 10,
            borderRight: "1px solid rgba(200, 169, 110, 0.1)",
            position: "sticky",
            top: 0,
            left: 0,
            height: "100vh",
          }}
        >
          <div
            style={{
              height: "72px",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              paddingLeft: collapsed ? "0" : "28px",
              borderBottom: "1px solid rgba(200, 169, 110, 0.15)",
              background: "#090d16", // Darker slate background for logo
              transition: "all 0.3s",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                color: "#c8a96e", // Gold accent
                fontFamily:
                  "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
                fontSize: collapsed ? "18px" : "15px",
                fontWeight: 700,
                letterSpacing: collapsed ? "0" : "2.5px",
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                transition: "all 0.3s",
              }}
            >
              {collapsed ? "SC" : "Southcape CMS"}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 72px)",
              justifyContent: "space-between",
            }}
          >
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{
                padding: "24px 12px",
                background: "transparent",
                border: "none",
              }}
            />

            {/* {!collapsed && (
              <div style={{
                padding: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Version 1.0.0
                </div>
              </div>
            )} */}
          </div>
        </Sider>

        <Layout style={{ background: "#fafafa" }}>
          <Header
            style={{
              background: "#ffffff",
              padding: "0 32px",
              height: "72px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e5e7eb",
              zIndex: 9,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.01)",
            }}
          >
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ color: "#0f172a" }} />
                ) : (
                  <MenuFoldOutlined style={{ color: "#0f172a" }} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "18px",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                background: "#fafafa",
                border: "1px solid #e5e7eb",
              }}
            />

            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Space
                style={{
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  background: "transparent",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#0f172a",
                    color: "#c8a96e",
                    border: "none",
                  }}
                  size="small"
                />
                <span
                  style={{
                    fontWeight: 600,
                    color: "#0f172a",
                    fontSize: "13px",
                    letterSpacing: "0.3px",
                  }}
                >
                  {user?.fullName || "Admin"}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#64748b",
                    marginLeft: "2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ▼
                </span>
              </Space>
            </Dropdown>
          </Header>

          <Content
            style={{
              margin: "32px",
              padding: "0",
              minHeight: "auto",
              background: "transparent",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                padding: "32px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.01)",
                minHeight: "calc(100vh - 180px)",
                overflowY: "auto",
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default CmsLayout;
