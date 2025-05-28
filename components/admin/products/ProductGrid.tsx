import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const ProductGrid = ({
  products,
  categories,
  selectedProducts,
  toggleSelectProduct,
  handleViewProduct,
  handleEditProduct,
  handleDeleteClick,
}: any) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {products.length === 0 ? (
      <div className="col-span-full text-center py-10 text-muted-foreground">
        Không tìm thấy sản phẩm nào
      </div>
    ) : (
      products.map((product: any) => (
        <Card key={product.id} className="overflow-hidden group">
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onCheckedChange={() => toggleSelectProduct(product.id)}
                className="bg-white/80"
              />
            </div>
            <div className="h-48 overflow-hidden bg-gray-100">
              <img
                src={
                  product.images[0] || "/placeholder.svg?height=200&width=200"
                }
                alt={product.tenSanPham}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            {product.featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500">
                Nổi bật
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold truncate">{product.tenSanPham}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">
                {categories.find((cat: any) => cat.id === product.category)
                  ?.name || ""}
              </span>
              <span className="font-medium">
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  product.status === "Còn hàng"
                    ? "bg-green-100 text-green-800"
                    : product.status === "Sắp hết hàng"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.status}
              </span>
              <span className="text-sm">Tồn kho: {product.stock}</span>
            </div>
            <div className="mt-4 flex justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewProduct(product)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditProduct(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))
    )}
  </div>
);

export default ProductGrid;
