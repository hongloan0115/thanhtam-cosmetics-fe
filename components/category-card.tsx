import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  category: {
    id: number
    name: string
    image: string
    count: number
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.id}`}>
      <Card className="overflow-hidden h-full group">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-square overflow-hidden bg-pink-50">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
              <h3 className="font-medium text-lg">{category.name}</h3>
              <p className="text-sm opacity-90">{category.count} sản phẩm</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
