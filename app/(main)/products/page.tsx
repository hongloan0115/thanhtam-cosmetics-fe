"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/product-card";
import { Search, SlidersHorizontal } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ProductService, Product } from "@/services/api/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProductService.getAll()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "skincare", name: "Chăm sóc da" },
    { id: "makeup", name: "Trang điểm" },
    { id: "haircare", name: "Chăm sóc tóc" },
    { id: "bodycare", name: "Chăm sóc cơ thể" },
    { id: "fragrance", name: "Nước hoa" },
  ];

  const brands = [
    { id: "thanhtam", name: "Thanh Tâm" },
    { id: "loreal", name: "L'Oréal" },
    { id: "maybelline", name: "Maybelline" },
    { id: "nivea", name: "Nivea" },
    { id: "innisfree", name: "Innisfree" },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Sản phẩm</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 space-y-8">
          <div>
            <h3 className="font-medium mb-4">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Checkbox id={`category-${category.id}`} />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Thương hiệu</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center">
                  <Checkbox id={`brand-${brand.id}`} />
                  <label
                    htmlFor={`brand-${brand.id}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Giá</h3>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 1000000]}
                min={0}
                max={1000000}
                step={50000}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatCurrency(0)}</span>
                <span className="text-sm">{formatCurrency(1000000)}</span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-pink-600 hover:bg-pink-700">
            Áp dụng
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Search and filter bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm sản phẩm..." className="pl-9" />
            </div>

            <Button
              variant="outline"
              className="sm:w-auto md:hidden flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Lọc
            </Button>

            <select className="border rounded-md px-3 py-2">
              <option value="popular">Phổ biến nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
            </select>
          </div>

          {/* Mobile category tabs */}
          <div className="md:hidden mb-6">
            <Tabs defaultValue="all">
              <TabsList className="w-full overflow-x-auto">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                Đang tải sản phẩm...
              </div>
            ) : (
              products.map((product, idx) => (
                <ProductCard
                  key={product.maSanPham}
                  product={{
                    id: product.maSanPham,
                    name: product.tenSanPham,
                    price: product.giaBan,
                    image:
                      product.hinhAnh && product.hinhAnh.length > 0
                        ? product.hinhAnh.find((img) => img.laAnhChinh)
                            ?.duongDanAnh || product.hinhAnh[0].duongDanAnh
                        : "/placeholder.svg",
                    // Các trường không có trong API, giữ nguyên logic cũ hoặc random
                    rating: 4.5 + (idx % 5) * 0.1,
                    reviewCount: 50 + ((idx * 13) % 100),
                    category: categories[idx % categories.length].name,
                    isNew: idx % 3 === 0,
                  }}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-1">
              <Button variant="outline" size="icon" disabled>
                &lt;
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-pink-600 text-white"
              >
                1
              </Button>
              <Button variant="outline" size="icon">
                2
              </Button>
              <Button variant="outline" size="icon">
                3
              </Button>
              <Button variant="outline" size="icon">
                &gt;
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
