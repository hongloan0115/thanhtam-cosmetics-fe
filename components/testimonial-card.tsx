import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  testimonial: {
    id: number
    name: string
    avatar: string
    rating: number
    comment: string
  }
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
            <img
              src={testimonial.avatar || "/placeholder.svg"}
              alt={testimonial.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h4 className="font-medium">{testimonial.name}</h4>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-600 italic">"{testimonial.comment}"</p>
      </CardContent>
    </Card>
  )
}
