import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductTableProps {
  products: any[];
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[]; // Thêm prop brands
  selectedProducts: number[];
  toggleSelectAll: () => void;
  toggleSelectProduct: (id: number) => void;
  setSortBy: (field: string) => void;
  toggleSortOrder: () => void;
  handleViewProduct: (product: any) => void;
  handleEditProduct: (product: any) => void;
  handleDeleteClick: (id: number) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export default function ProductTable({
  products,
  categories,
  brands, // nhận prop brands
  selectedProducts,
  toggleSelectAll,
  toggleSelectProduct,
  setSortBy,
  toggleSortOrder,
  handleViewProduct,
  handleEditProduct,
  handleDeleteClick,
  sortBy,
  sortOrder,
}: ProductTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px] text-center">
              <Checkbox
                checked={
                  selectedProducts.length === products.length &&
                  products.length > 0
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[50px] text-center">ID</TableHead>
            <TableHead className="w-[120px] text-center">Hình ảnh</TableHead>
            <TableHead className="text-center">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setSortBy("name");
                  toggleSortOrder();
                }}
              >
                Tên sản phẩm
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-center">Danh mục</TableHead>
            <TableHead className="text-center">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setSortBy("price");
                  toggleSortOrder();
                }}
              >
                Giá
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setSortBy("stock");
                  toggleSortOrder();
                }}
              >
                Tồn kho
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>

            <TableHead className="text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-10 text-muted-foreground"
              >
                Không tìm thấy sản phẩm nào
              </TableCell>
            </TableRow>
          ) : (
            products.map((product: any) => (
              <TableRow key={product.id} className="group text-center">
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleSelectProduct(product.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-center">
                  {product.id}
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 mx-auto">
                    <img
                      src={
                        product.images?.[0]?.duongDan ||
                        product.images?.[0]?.duongDan ||
                        product.hinhAnh?.[0]?.duongDan ||
                        product.hinhAnh?.[0]?.duongDan ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={product.tenSanPham}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{product.tenSanPham}</span>
                    {product.featured && (
                      <Badge
                        variant="outline"
                        className="w-fit mt-1 bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Nổi bật
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {categories.find((cat: any) => cat.id === product.category)
                    ?.name || ""}
                </TableCell>
                <TableCell className="text-right font-medium text-center">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-right text-center">
                  {product.stock}
                </TableCell>
                <TableCell className="text-right text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === "ĐANG BÁN"
                        ? "bg-green-100 text-green-800"
                        : product.status === "SẮP HẾT"
                        ? "bg-yellow-100 text-yellow-800"
                        : product.status === "HẾT HÀNG"
                        ? "bg-red-100 text-red-800"
                        : product.status === "SẮP VỀ"
                        ? "bg-blue-100 text-blue-800"
                        : product.status === "NGỪNG BÁN"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="text-right text-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewProduct(product)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
