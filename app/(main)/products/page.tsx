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
import { CategoryService, Category } from "@/services/api/category";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho filter và search
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("popular");

  // Thêm state cho categories từ API
  const [categories, setCategories] = useState<Category[]>([]);
  // Thêm state cho brands từ API
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  // Thay đổi state
  const [selectedCategory, setSelectedCategory] = useState<string>("0");

  // Thêm state cho notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Hàm fetch sản phẩm mặc định
  const fetchProducts = async () => {
    setLoading(true);
    const data = await ProductService.getAll();
    setProducts(data);
    setLoading(false);
  };

  // Lấy danh sách danh mục từ API
  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAll();
      // Thêm "Tất cả" vào đầu danh sách
      setCategories([
        { maDanhMuc: 0, tenDanhMuc: "Tất cả" } as Category,
        ...data,
      ]);
    } catch (e) {
      setCategories([{ maDanhMuc: 0, tenDanhMuc: "Tất cả" } as Category]);
    }
  };

  // Lấy danh sách thương hiệu từ API
  const fetchBrands = async () => {
    try {
      const data = await (
        await import("@/services/api/brands")
      ).BrandService.getAll();
      setBrands(
        data.map((brand: any) => ({
          id: String(brand.maThuongHieu),
          name: brand.tenThuongHieu,
        }))
      );
    } catch (e) {
      setBrands([]);
    }
  };

  // Hàm tìm kiếm sản phẩm
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }
    setLoading(true);
    const data = await ProductService.search(searchTerm.trim());
    setProducts(data);
    setLoading(false);
  };

  // Hàm lọc sản phẩm
  const handleFilter = async () => {
    setLoading(true);
    const maDanhMuc =
      selectedCategory !== "all" && selectedCategory !== "0"
        ? selectedCategory
        : undefined;
    const thuongHieu = selectedBrands.length > 0 ? selectedBrands : undefined;
    const [giaMin, giaMax] = priceRange;
    const params: any = {};
    if (maDanhMuc) params.maDanhMuc = maDanhMuc;
    if (thuongHieu) params.thuongHieu = thuongHieu;
    if (giaMin !== 0) params.giaMin = giaMin;
    if (giaMax !== 1000000) params.giaMax = giaMax;
    const data = await ProductService.filter(params);
    setProducts(data);
    setLoading(false);
  };

  // Xử lý chọn danh mục (chỉ chọn một)
  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
  };

  // Xử lý chọn thương hiệu
  const handleBrandChange = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Xử lý slider giá
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  // Gọi filter khi người dùng nhả chuột khỏi slider giá
  const handlePriceCommit = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    handleFilter();
  };

  // Xử lý enter trong ô tìm kiếm
  const handleSearchInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    // Gọi API lọc mỗi khi selectedCategory hoặc selectedBrands thay đổi
    if (selectedCategory !== undefined) {
      handleFilter();
    }
  }, [selectedCategory, selectedBrands]);

  return (
    <div className="container py-8">
      {notification && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
          <button
            className="float-right ml-4 text-lg font-bold"
            onClick={() => setNotification(null)}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8">Sản phẩm</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 space-y-8">
          <div>
            <h3 className="font-medium mb-4">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.maDanhMuc} className="flex items-center">
                  {/* Sử dụng radio thay vì checkbox */}
                  <input
                    type="radio"
                    id={`category-${category.maDanhMuc}`}
                    name="category"
                    checked={selectedCategory === String(category.maDanhMuc)}
                    onChange={() =>
                      handleCategoryChange(String(category.maDanhMuc))
                    }
                    className="accent-pink-600"
                  />
                  <label
                    htmlFor={`category-${category.maDanhMuc}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.tenDanhMuc}
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
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => handleBrandChange(brand.id)}
                  />
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
                value={priceRange}
                min={0}
                max={1000000}
                step={50000}
                onValueChange={handlePriceChange}
                onValueCommit={handlePriceCommit}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatCurrency(priceRange[0])}</span>
                <span className="text-sm">{formatCurrency(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Search and filter bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchInputKeyDown}
              />
              {/* Nút tìm kiếm */}
              <Button
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                variant="ghost"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              className="sm:w-auto md:hidden flex items-center gap-2"
              // Có thể mở modal lọc cho mobile ở đây nếu muốn
            >
              <SlidersHorizontal className="h-4 w-4" />
              Lọc
            </Button>

            <select
              className="border rounded-md px-3 py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
            </select>
          </div>

          {/* Mobile category tabs */}
          <div className="md:hidden mb-6">
            <Tabs
              defaultValue="0"
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val)}
            >
              <TabsList className="w-full overflow-x-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.maDanhMuc}
                    value={String(category.maDanhMuc)}
                  >
                    {category.tenDanhMuc}
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
                            ?.duongDan || product.hinhAnh[0].duongDan
                        : "/placeholder.svg",
                    // Các trường không có trong API, giữ nguyên logic cũ hoặc random
                    rating: 4.5 + (idx % 5) * 0.1,
                    reviewCount: 50 + ((idx * 13) % 100),
                    category:
                      categories.find(
                        (c) => String(c.maDanhMuc) === String(product.maDanhMuc)
                      )?.tenDanhMuc ??
                      categories[idx % categories.length]?.tenDanhMuc ??
                      "",
                    isNew: idx % 3 === 0,
                  }}
                  {...(ProductCard.length > 1 && {
                    onAddToCartSuccess: () =>
                      setNotification({
                        type: "success",
                        message: "Thêm vào giỏ hàng thành công!",
                      }),
                  })}
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
