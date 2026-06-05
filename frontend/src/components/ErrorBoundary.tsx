import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Result, Button, Collapse, Typography } from 'antd';
import { HomeOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

// --- Global Error Boundary (React Class Component) ---
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{ maxWidth: '600px', width: '100%', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
            <Result
              status="error"
              title="Đã xảy ra sự cố nghiêm trọng"
              subTitle="Ứng dụng gặp lỗi không thể tự phục hồi. Vui lòng tải lại trang hoặc quay lại trang chủ."
              extra={[
                <Button type="primary" key="reload" icon={<ReloadOutlined />} onClick={this.handleReload} size="large">
                  Tải lại trang
                </Button>,
                <Button key="home" icon={<HomeOutlined />} onClick={this.handleGoHome} size="large" style={{ marginLeft: '12px' }}>
                  Về trang chủ
                </Button>,
              ]}
            >
              {isDev && this.state.error && (
                <div style={{ marginTop: '24px', textAlign: 'left' }}>
                  <Collapse
                    ghost
                    items={[
                      {
                        key: '1',
                        label: <Text type="danger" strong>Chi tiết lỗi (Chỉ hiển thị ở môi trường phát triển)</Text>,
                        children: (
                          <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
                            <Paragraph>
                              <Text strong>Thông điệp:</Text> {this.state.error.toString()}
                            </Paragraph>
                            {this.state.errorInfo && (
                              <pre style={{ fontSize: '12px', color: '#666', whiteSpace: 'pre-wrap' }}>
                                {this.state.errorInfo.componentStack}
                              </pre>
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              )}
            </Result>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Route Error Boundary (React Functional Component using React Router hooks) ---
export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  console.error('Route Error Boundary caught an error:', error);

  let status: '403' | '404' | '500' | 'error' = 'error';
  let title = 'Có lỗi xảy ra';
  let subTitle = 'Đã xảy ra lỗi không mong muốn trong quá trình xử lý.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      status = '404';
      title = '404 - Không tìm thấy trang';
      subTitle = 'Trang bạn đang cố gắng truy cập không tồn tại hoặc đã bị di chuyển.';
    } else if (error.status === 403) {
      status = '403';
      title = '403 - Truy cập bị từ chối';
      subTitle = 'Bạn không có quyền truy cập vào tài nguyên hoặc trang này.';
    } else if (error.status === 500) {
      status = '500';
      title = '500 - Lỗi máy chủ';
      subTitle = 'Máy chủ gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.';
    } else {
      title = `Lỗi ${error.status}`;
      subTitle = error.statusText || error.data?.message || subTitle;
    }
  } else if (error instanceof Error) {
    status = '500';
    title = 'Lỗi ứng dụng';
    subTitle = error.message;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '24px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', width: '100%', padding: '40px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
        <Result
          status={status}
          title={title}
          subTitle={subTitle}
          extra={[
            <Button type="primary" key="home" icon={<HomeOutlined />} onClick={handleGoHome} size="large">
              Về trang chủ
            </Button>,
            <Button key="back" icon={<ArrowLeftOutlined />} onClick={handleGoBack} size="large" style={{ marginLeft: '12px' }}>
              Quay lại
            </Button>,
          ]}
        >
          {isDev && !!error && (
            <div style={{ marginTop: '24px', textAlign: 'left' }}>
              <Collapse
                ghost
                items={[
                  {
                    key: '1',
                    label: <Text type="danger" strong>Chi tiết lỗi (Chỉ hiển thị ở môi trường phát triển)</Text>,
                    children: (
                      <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
                        <pre style={{ fontSize: '12px', color: '#666', whiteSpace: 'pre-wrap' }}>
                          {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
                        </pre>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </Result>
      </div>
    </div>
  );
};
