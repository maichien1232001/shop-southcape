import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Tabs, Button, Upload } from "antd";
import { Plus } from "lucide-react";
import { Product } from "../../interfaces/product.interface";
import { SupportedLocale } from "../../constants/languages";
import { STATUS_FORM_OPTIONS, CATEGORY_FORM_OPTIONS } from "../../constants/selectOptions";


interface ProductFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Product>) => void;
  initialValues?: Product | null;
  confirmLoading?: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  confirmLoading,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Load values into form when open or initialValues change
  useEffect(() => {
    if (open) {
      if (initialValues) {
        const initialImages = initialValues.images || [];
        setFileList(
          initialImages.map((url, idx) => ({
            uid: `-1-${idx}`,
            name: `image-${idx}.png`,
            status: "done",
            url: url,
          }))
        );
        form.setFieldsValue({
          sku: initialValues.sku,
          category: initialValues.category,
          subCategory: initialValues.subCategory,
          price_VND: initialValues.prices?.VND?.price,
          comparePrice_VND: initialValues.prices?.VND?.compare_at_price,
          price_USD: initialValues.prices?.USD?.price,
          comparePrice_USD: initialValues.prices?.USD?.compare_at_price,
          inventory: initialValues.inventory,
          status: initialValues.status,
          colors: initialValues.colors?.join(", "),
          sizes: initialValues.sizes?.join(", "),

          name_vi: initialValues.name?.vi,
          name_en: initialValues.name?.en,
          name_ja: initialValues.name?.ja,

          description_vi: initialValues.description?.vi,
          description_en: initialValues.description?.en,
          description_ja: initialValues.description?.ja,

          seoTitle_vi: initialValues.seoTitle?.vi,
          seoTitle_en: initialValues.seoTitle?.en,
          seoTitle_ja: initialValues.seoTitle?.ja,

          seoDescription_vi: initialValues.seoDescription?.vi,
          seoDescription_en: initialValues.seoDescription?.en,
          seoDescription_ja: initialValues.seoDescription?.ja,
        });
      } else {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [open, initialValues, form]);

  const handlePreview = async (file: any) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setPreviewImage(src);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    const updatedFileList = newFileList.map((file: any) => {
      if (file.status === "done" && file.response) {
        file.url = file.response.secure_url;
      }
      return file;
    });
    setFileList(updatedFileList);
  };

  const handleCustomUpload = async ({
    file,
    onSuccess,
    onError,
  }: any) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      onSuccess(data);
    } catch (err: any) {
      onError(err);
    }
  };


  interface ProductFormValues {
    sku: string;
    category: "women" | "men" | "accessories";
    subCategory: string;
    price_VND: number;
    comparePrice_VND?: number;
    price_USD: number;
    comparePrice_USD?: number;
    inventory?: number;
    status?: "active" | "draft" | "archived";
    imageUrl?: string;
    colors?: string;
    sizes?: string;
    name_vi: string;
    name_en: string;
    name_ja: string;
    description_vi: string;
    description_en: string;
    description_ja: string;
    seoTitle_vi?: string;
    seoTitle_en?: string;
    seoTitle_ja?: string;
    seoDescription_vi?: string;
    seoDescription_en?: string;
    seoDescription_ja?: string;
  }

  const handleFinish = (values: ProductFormValues) => {
    const prices: Record<string, { price: number; compare_at_price?: number }> =
      {};

    if (values.price_VND) {
      prices.VND = {
        price: values.price_VND,
        compare_at_price: values.comparePrice_VND || undefined,
      };
    }
    if (values.price_USD) {
      prices.USD = {
        price: values.price_USD,
        compare_at_price: values.comparePrice_USD || undefined,
      };
    }

    const imageUrls = fileList
      .filter((file) => file.status === "done" && file.url)
      .map((file) => file.url);

    const formattedProduct: Partial<Product> = {
      sku: values.sku,
      category: values.category,
      subCategory: values.subCategory,
      prices,
      inventory: values.inventory || 0,
      status: values.status || "active",
      images: imageUrls,
      colors: values.colors
        ? values.colors.split(",").map((c: string) => c.trim())
        : [],
      sizes: values.sizes
        ? values.sizes.split(",").map((s: string) => s.trim())
        : [],
      name: {
        vi: values.name_vi,
        en: values.name_en,
        ja: values.name_ja,
      },
      description: {
        vi: values.description_vi,
        en: values.description_en,
        ja: values.description_ja,
      },
      seoTitle: {
        vi: values.seoTitle_vi || "",
        en: values.seoTitle_en || "",
        ja: values.seoTitle_ja || "",
      },
      seoDescription: {
        vi: values.seoDescription_vi || "",
        en: values.seoDescription_en || "",
        ja: values.seoDescription_ja || "",
      },
    };

    onSubmit(formattedProduct);
  };

  const locales: { key: SupportedLocale; label: string }[] = [
    { key: "vi", label: "Tiếng Việt" },
    { key: "en", label: "English" },
    { key: "ja", label: "日本語" },
  ];

  const tabItems = locales.map((loc) => ({
    key: loc.key,
    label: loc.label,
    children: (
      <div className="space-y-4 pt-2">
        <Form.Item
          label={
            <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
              Tên sản phẩm ({loc.key.toUpperCase()})
            </span>
          }
          name={`name_${loc.key}`}
          rules={[
            { required: true, message: `Nhập tên sản phẩm bằng ${loc.label}` },
          ]}
        >
          <Input
            className="rounded-none border-brand-border"
            placeholder={`Nhập tên sản phẩm bằng ${loc.label}`}
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
              Mô tả sản phẩm ({loc.key.toUpperCase()})
            </span>
          }
          name={`description_${loc.key}`}
          rules={[{ required: true, message: `Nhập mô tả bằng ${loc.label}` }]}
        >
          <Input.TextArea
            className="rounded-none border-brand-border"
            rows={3}
            placeholder={`Nhập mô tả sản phẩm bằng ${loc.label}`}
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
              SEO Title ({loc.key.toUpperCase()} - Tùy chọn)
            </span>
          }
          name={`seoTitle_${loc.key}`}
        >
          <Input
            className="rounded-none border-brand-border"
            placeholder="SEO Title"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
              SEO Description ({loc.key.toUpperCase()} - Tùy chọn)
            </span>
          }
          name={`seoDescription_${loc.key}`}
        >
          <Input.TextArea
            className="rounded-none border-brand-border"
            rows={2}
            placeholder="SEO Description"
          />
        </Form.Item>
      </div>
    ),
  }));

  return (
    <Modal
      title={
        <span className="font-serif text-lg tracking-wider font-semibold text-brand-dark uppercase">
          {initialValues
            ? "Cập Nhật Sản Phẩm (CMS)"
            : "Thêm Sản Phẩm Mới (CMS)"}
        </span>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={650}
      destroyOnClose
      className="rounded-none"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="font-sans text-xs pt-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Mã SKU
              </span>
            }
            name="sku"
            rules={[{ required: true, message: "Nhập mã SKU sản phẩm" }]}
          >
            <Input
              className="rounded-none border-brand-border"
              placeholder="Ví dụ: SKU-WOM-PLEATED-001"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Trạng thái
              </span>
            }
            name="status"
            initialValue="active"
          >
            <Select className="rounded-none" options={STATUS_FORM_OPTIONS} />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Danh mục
              </span>
            }
            name="category"
            initialValue="women"
          >
            <Select className="rounded-none" options={CATEGORY_FORM_OPTIONS} />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Phân loại cụ thể
              </span>
            }
            name="subCategory"
            rules={[
              {
                required: true,
                message: "Nhập phân loại, ví dụ: Skirt, Polo, Cap...",
              },
            ]}
          >
            <Input
              className="rounded-none border-brand-border"
              placeholder="Ví dụ: Skirt"
            />
          </Form.Item>
        </div>

        <div className="border border-brand-border/60 p-4 mb-4 bg-brand-border/10">
          <h4 className="font-sans text-[11px] font-bold text-brand-forest uppercase tracking-wider mb-3">
            Định giá & Tiền tệ (VND / USD)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={
                <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                  Giá bán (VND)
                </span>
              }
              name="price_VND"
              rules={[{ required: true, message: "Nhập giá bán VND" }]}
            >
              <InputNumber
                className="w-full rounded-none border-brand-border"
                min={0 as number}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  (value
                    ? value.replace(/\$\s?|(,*)/g, "")
                    : "") as unknown as number
                }
                placeholder="Ví dụ: 4,600,000"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                  Giá gốc (VND - Tùy chọn)
                </span>
              }
              name="comparePrice_VND"
            >
              <InputNumber
                className="w-full rounded-none border-brand-border"
                min={0 as number}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  (value
                    ? value.replace(/\$\s?|(,*)/g, "")
                    : "") as unknown as number
                }
                placeholder="Ví dụ: 5,500,000"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={
                <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                  Giá bán (USD)
                </span>
              }
              name="price_USD"
              rules={[{ required: true, message: "Nhập giá bán USD" }]}
            >
              <InputNumber
                className="w-full rounded-none border-brand-border"
                min={0}
                placeholder="Ví dụ: 185"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                  Giá gốc (USD - Tùy chọn)
                </span>
              }
              name="comparePrice_USD"
            >
              <InputNumber
                className="w-full rounded-none border-brand-border"
                min={0}
                placeholder="Ví dụ: 220"
              />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Tồn kho
              </span>
            }
            name="inventory"
            initialValue={50}
            rules={[{ required: true, message: "Nhập số lượng tồn kho" }]}
          >
            <InputNumber
              className="w-full rounded-none border-brand-border"
              min={0}
              placeholder="Ví dụ: 50"
            />
          </Form.Item>
        </div>

        <div className="mb-4">
          <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-2">
            Ảnh sản phẩm (Tải lên nhiều ảnh)
          </span>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleUploadChange}
            customRequest={handleCustomUpload}
            multiple
          >
            {fileList.length >= 8 ? null : (
              <div className="flex flex-col items-center justify-center text-brand-gray hover:text-brand-dark transition-colors cursor-pointer">
                <Plus size={16} />
                <div style={{ marginTop: 8 }} className="text-[10px] uppercase font-semibold">Tải ảnh lên</div>
              </div>
            )}
          </Upload>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Màu sắc (phân cách bằng dấu phẩy)
              </span>
            }
            name="colors"
            initialValue="Off-White, Navy Blue"
          >
            <Input
              className="rounded-none border-brand-border"
              placeholder="Off-White, Navy Blue"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Kích cỡ (phân cách bằng dấu phẩy)
              </span>
            }
            name="sizes"
            initialValue="S, M, L"
          >
            <Input
              className="rounded-none border-brand-border"
              placeholder="S, M, L"
            />
          </Form.Item>
        </div>

        {/* Khối Tabs đa ngôn ngữ cho Name & Description */}
        <div className="border border-brand-border/60 p-4 mb-4 rounded-none bg-brand-light">
          <span className="text-xs font-semibold text-brand-forest uppercase tracking-wider block mb-2">
            Thông tin Dịch Thuật Đa Ngôn Ngữ
          </span>
          <Tabs items={tabItems} type="card" size="small" />
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-brand-border/40 mt-4">
          <Button onClick={onCancel} className="rounded-none">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={confirmLoading}
            className="rounded-none bg-brand-forest border-brand-forest hover:bg-[#22442d] hover:border-[#22442d]"
          >
            Lưu lại
          </Button>
        </div>
      </Form>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Modal>
  );
};
