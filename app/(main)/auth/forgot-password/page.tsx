"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Vui lòng nhập email")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, this would send a password reset email
        // For this demo, we'll just show a success message
        setIsSubmitted(true)
      } catch (error) {
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.")
      } finally {
        setIsSubmitting(false)
      }
    }, 1000)
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Quên mật khẩu</CardTitle>
            <CardDescription className="text-center">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSubmitted ? (
              <div className="text-center py-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Kiểm tra email của bạn</h3>
                <p className="text-gray-600 mb-4">
                  Chúng tôi đã gửi một email đến <span className="font-medium">{email}</span> với hướng dẫn để đặt lại
                  mật khẩu của bạn.
                </p>
                <p className="text-sm text-gray-500">
                  Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
                  <button className="text-pink-600 hover:underline" onClick={() => setIsSubmitted(false)}>
                    thử lại
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Gửi liên kết đặt lại"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/auth/login" className="text-sm text-pink-600 hover:underline flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
