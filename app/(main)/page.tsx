"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Star, TrendingUp } from "lucide-react";
import CategoryCard from "@/components/category-card";
import TestimonialCard from "@/components/testimonial-card";
import ChatbotButton from "@/components/chatbot-button";
import { CategoryService, Category } from "@/services/api/category";
import { ProductService, Product } from "@/services/api/product";
import { useRouter } from "next/navigation";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  // State cho sản phẩm mới nhất (trong 1 tháng gần đây)
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    CategoryService.getAll()
      .then((data) => setCategories(data))
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    ProductService.getAll()
      .then((products) => {
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        // Lọc sản phẩm tạo trong 1 tháng gần đây
        const filtered = products.filter((p) => {
          const created = new Date(p.ngayTao);
          return created >= oneMonthAgo && created <= now;
        });
        // Sắp xếp mới nhất lên đầu
        filtered.sort(
          (a, b) =>
            new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime()
        );
        setRecentProducts(filtered);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  // Thêm hiệu ứng chuyển động mượt mà cho carousel
  const [isSliding, setIsSliding] = useState(false);

  // Bỏ auto slide carousel
  // useEffect(() => {
  //   if (recentProducts.length <= 4) return;
  //   if (autoSlideRef.current) clearInterval(autoSlideRef.current);

  //   autoSlideRef.current = setInterval(() => {
  //     handleNext(true);
  //   }, 3500);

  //   return () => {
  //     if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [recentProducts, carouselIndex]);

  // Khi click nút trái/phải, reset lại auto slide (không cần reset nữa)
  const handlePrev = () => {
    setIsSliding(true);
    setTimeout(() => {
      setCarouselIndex((i) => {
        if (i === 0) {
          // Nếu đang ở đầu, chuyển về cuối (chia hết 4)
          const lastIndex =
            recentProducts.length <= 4
              ? 0
              : Math.floor((recentProducts.length - 1) / 4) * 4;
          return lastIndex;
        }
        return Math.max(0, i - 4);
      });
      setIsSliding(false);
    }, 300);
  };
  const handleNext = () => {
    setIsSliding(true);
    setTimeout(() => {
      setCarouselIndex((i) => {
        const nextIndex = i + 4;
        if (nextIndex >= recentProducts.length) {
          return 0;
        }
        return nextIndex;
      });
      setIsSliding(false);
    }, 300);
  };

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Hương",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      comment:
        "Sản phẩm chất lượng, giao hàng nhanh. Tôi rất hài lòng với dịch vụ của Thanh Tâm.",
    },
    {
      id: 2,
      name: "Trần Văn Minh",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      comment:
        "Kem dưỡng ẩm Thanh Tâm đã cải thiện làn da của tôi rất nhiều. Sẽ tiếp tục ủng hộ!",
    },
    {
      id: 3,
      name: "Lê Thị Hà",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
      comment:
        "Son lì Thanh Tâm lên màu đẹp, bền màu và không làm khô môi. Rất đáng để thử!",
    },
  ];

  return (
    <div className="pb-16">
      {/* Hero section */}
      <section
        className="relative bg-pink-50 py-16 md:py-24"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dqubxptyg/image/upload/v1748589676/v1a_Hyrbid-Blush_Launch_HP_desktop_0104_1_wsbokh.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">
              Mới ra mắt
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Khám phá bí mật làm đẹp cùng Thanh Tâm
            </h1>
            <p className="text-lg text-gray-600">
              Sản phẩm mỹ phẩm chất lượng cao, an toàn và hiệu quả. Chăm sóc làn
              da của bạn với những sản phẩm tốt nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => router.push("/products")}
              >
                Mua sắm ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-pink-600 text-pink-600 hover:bg-pink-50"
                onClick={() => router.push("/products")}
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
          {/* <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-pink-100 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dqubxptyg/image/upload/v1748586932/gt1507_web_qjmolt.jpg"
                alt="Thanh Tâm Cosmetics"
                className="object-cover"
              />
            </div>
          </div> */}
        </div>
      </section>

      {/* Categories section */}
      <section className="py-16">
        <div className="container">
          {loadingCategories ? (
            <div className="col-span-4 text-center text-gray-400 py-8">
              Đang tải danh mục...
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-4 text-center text-gray-400 py-8">
              Không có danh mục nào
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-5 justify-center">
                {categories.map((category) => (
                  <div
                    key={category.maDanhMuc}
                    className="w-48 rounded-lg border bg-white p-3 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
                  >
                    <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-2 text-pink-600 text-xl font-bold">
                      {category.tenDanhMuc?.charAt(0) || "?"}
                    </div>
                    <span className="text-base font-semibold text-pink-700 mb-1 truncate w-full">
                      {category.tenDanhMuc}
                    </span>
                    <span className="text-xs text-gray-500 line-clamp-2">
                      {category.moTa}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured products section - Sản phẩm mới nhất trong 1 tháng gần đây */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Sản phẩm mới của chúng tôi</h2>
            <Link
              href="/products"
              className="text-pink-600 hover:text-pink-700 flex items-center"
            >
              Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {loadingProducts ? (
            <div className="text-center text-gray-400 py-8">
              Đang tải sản phẩm...
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Không có sản phẩm mới trong 1 tháng gần đây
            </div>
          ) : (
            <div className="relative">
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6
                  transition-transform duration-500 ease-in-out
                  ${isSliding ? "opacity-80 translate-x-2" : "opacity-100"}
                `}
                style={{
                  willChange: "transform, opacity",
                }}
              >
                {recentProducts
                  .slice(carouselIndex, carouselIndex + 4)
                  .map((product) => (
                    <ProductCard
                      key={product.maSanPham}
                      product={{
                        id: product.maSanPham,
                        name: product.tenSanPham,
                        price: product.giaBan,
                        image:
                          product.hinhAnh?.find((img) => img.laAnhChinh)
                            ?.duongDan ||
                          "/placeholder.svg?height=300&width=300",
                        rating: 0,
                        reviewCount: 0,
                        category: "",
                        isNew: true,
                      }}
                    />
                  ))}
              </div>
              {recentProducts.length > 4 && (
                <>
                  {/* Nút sang trái */}
                  <button
                    className={`
                      absolute left-[-32px] top-1/2 -translate-y-1/2 z-20
                      flex items-center justify-center
                      w-12 h-12 rounded-full border-2 border-pink-500
                      bg-white/80 shadow-lg
                      transition-all duration-200
                      hover:scale-110 hover:bg-pink-50
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                    onClick={handlePrev}
                    disabled={carouselIndex === 0}
                    aria-label="Xem sản phẩm trước"
                  >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="none" />
                      <path
                        d="M15 19l-7-7 7-7"
                        stroke="#ec4899"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {/* Nút sang phải */}
                  <button
                    className={`
                      absolute right-[-32px] top-1/2 -translate-y-1/2 z-20
                      flex items-center justify-center
                      w-12 h-12 rounded-full border-2 border-pink-500
                      bg-white/80 shadow-lg
                      transition-all duration-200
                      hover:scale-110 hover:bg-pink-50
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                    onClick={handleNext}
                    disabled={recentProducts.length <= 4}
                    aria-label="Xem sản phẩm tiếp theo"
                  >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="none" />
                      <path
                        d="M9 5l7 7-7 7"
                        stroke="#ec4899"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Banner section */}
      <section className="py-16">
        <div className="container">
          <div className="relative rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-pink-600 opacity-90"></div>
            <div
              className="relative z-10 p-8 md:p-12 text-white"
              style={{
                backgroundImage:
                  "url('https://res.cloudinary.com/dqubxptyg/image/upload/v1748588637/nhuong-quyen-gia-cong-my-pham-blog-coanmy-5_ggzbpk.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "0.75rem", // rounded-lg
              }}
            >
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <Badge className="bg-white text-pink-600 hover:bg-white">
                  Khuyến mãi đặc biệt
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Giảm giá 20% cho tất cả sản phẩm mới
                </h2>
                <p className="text-lg opacity-90">
                  Chỉ áp dụng trong thời gian giới hạn. Nhanh tay mua sắm ngay
                  hôm nay!
                </p>
                <Button
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-gray-100"
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá trải nghiệm của khách hàng với sản phẩm và dịch vụ của
              Thanh Tâm Cosmetics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Sản phẩm chất lượng cao
                </h3>
                <p className="text-gray-600">
                  Tất cả sản phẩm của chúng tôi đều được kiểm tra nghiêm ngặt về
                  chất lượng và an toàn.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Dịch vụ khách hàng 24/7
                </h3>
                <p className="text-gray-600">
                  Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Cam kết hoàn tiền
                </h3>
                <p className="text-gray-600">
                  Không hài lòng với sản phẩm? Chúng tôi sẽ hoàn tiền 100% trong
                  vòng 30 ngày.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chatbot button */}
      <ChatbotButton />
    </div>
  );
}
