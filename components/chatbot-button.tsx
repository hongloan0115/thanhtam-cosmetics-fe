"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, User, Bot, ArrowRight, CheckCircle2, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

// Định nghĩa các loại tin nhắn
type MessageStatus = "sending" | "sent" | "received" | "read"
type MessageSender = "user" | "bot" | "agent"

interface QuickReply {
  id: string
  text: string
  action: string
}

interface ProductInfo {
  id: number
  name: string
  price: number
  image: string
}

interface Message {
  id: string
  text: string
  sender: MessageSender
  timestamp: Date
  status: MessageStatus
  quickReplies?: QuickReply[]
  product?: ProductInfo
}

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isAgentMode, setIsAgentMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Tải lịch sử chat từ localStorage khi component được mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory")
    if (savedMessages) {
      try {
        // Chuyển đổi chuỗi timestamp thành đối tượng Date
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(parsedMessages)
      } catch (error) {
        console.error("Lỗi khi phân tích lịch sử chat:", error)
      }
    } else {
      // Tin nhắn chào mừng mặc định nếu không có lịch sử
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Xin chào! Tôi có thể giúp bạn tìm sản phẩm, kiểm tra đơn hàng hoặc tư vấn ưu đãi hôm nay. Bạn cần gì ạ?",
        sender: "bot",
        timestamp: new Date(),
        status: "received",
        quickReplies: [
          { id: "search", text: "🔍 Tìm kiếm sản phẩm", action: "search" },
          { id: "order", text: "📦 Kiểm tra đơn hàng", action: "order" },
          { id: "support", text: "💬 Gặp nhân viên hỗ trợ", action: "support" },
        ],
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Lưu tin nhắn vào localStorage khi messages thay đổi
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages))
    }
  }, [messages])

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Thêm tin nhắn của người dùng
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Cập nhật trạng thái tin nhắn thành "sent" sau 500ms
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "sent" } : msg)))
    }, 500)

    // Hiển thị "đang nhập" cho bot/agent
    setIsTyping(true)

    // Xử lý phản hồi
    setTimeout(() => {
      setIsTyping(false)

      if (isAgentMode) {
        // Phản hồi từ nhân viên
        const agentResponse: Message = {
          id: Date.now().toString(),
          text: "Cảm ơn bạn đã liên hệ. Tôi là Hương, nhân viên tư vấn của Thanh Tâm Cosmetics. Tôi có thể giúp gì cho bạn ạ?",
          sender: "agent",
          timestamp: new Date(),
          status: "received",
        }
        setMessages((prev) => [...prev, agentResponse])
      } else {
        // Xử lý phản hồi từ chatbot dựa trên input
        handleBotResponse(input.toLowerCase())
      }
    }, 1500)
  }

  const handleBotResponse = (userInput: string) => {
    let botResponse: Message

    // Xử lý các từ khóa phổ biến
    if (userInput.includes("sản phẩm") || userInput.includes("mua") || userInput.includes("tìm")) {
      // Hiển thị sản phẩm gợi ý
      botResponse = {
        id: Date.now().toString(),
        text: "Đây là một số sản phẩm phổ biến của chúng tôi:",
        sender: "bot",
        timestamp: new Date(),
        status: "received",
        product: {
          id: 1,
          name: "Kem dưỡng ẩm Thanh Tâm",
          price: 450000,
          image: "/placeholder.svg?height=100&width=100",
        },
        quickReplies: [
          { id: "more", text: "Xem thêm sản phẩm", action: "more_products" },
          { id: "details", text: "Chi tiết sản phẩm", action: "product_details" },
        ],
      }
    } else if (userInput.includes("đơn hàng") || userInput.includes("kiểm tra") || userInput.includes("theo dõi")) {
      botResponse = {
        id: Date.now().toString(),
        text: "Để kiểm tra đơn hàng, vui lòng cung cấp mã đơn hàng hoặc đăng nhập vào tài khoản của bạn.",
        sender: "bot",
        timestamp: new Date(),
        status: "received",
        quickReplies: [
          { id: "login", text: "Đăng nhập", action: "login" },
          { id: "order_id", text: "Nhập mã đơn hàng", action: "enter_order_id" },
        ],
      }
    } else if (userInput.includes("nhân viên") || userInput.includes("tư vấn") || userInput.includes("hỗ trợ")) {
      botResponse = {
        id: Date.now().toString(),
        text: "Tôi sẽ kết nối bạn với nhân viên tư vấn. Vui lòng đợi trong giây lát.",
        sender: "bot",
        timestamp: new Date(),
        status: "received",
      }

      // Chuyển sang chế độ nhân viên sau 2 giây
      setTimeout(() => {
        setIsAgentMode(true)
        const agentMessage: Message = {
          id: Date.now().toString(),
          text: "Xin chào! Tôi là Hương, nhân viên tư vấn của Thanh Tâm Cosmetics. Tôi có thể giúp gì cho bạn ạ?",
          sender: "agent",
          timestamp: new Date(),
          status: "received",
        }
        setMessages((prev) => [...prev, agentMessage])
      }, 2000)
    } else if (userInput.includes("giá") || userInput.includes("khuyến mãi") || userInput.includes("ưu đãi")) {
      botResponse = {
        id: Date.now().toString(),
        text: "Hiện tại chúng tôi đang có chương trình khuyến mãi giảm 20% cho tất cả sản phẩm mới. Bạn có muốn xem các sản phẩm đang khuyến mãi không?",
        sender: "bot",
        timestamp: new Date(),
        status: "received",
        quickReplies: [
          { id: "promo", text: "Xem sản phẩm khuyến mãi", action: "view_promotions" },
          { id: "no_thanks", text: "Không, cảm ơn", action: "no_thanks" },
        ],
      }
    } else {
      // Phản hồi mặc định
      botResponse = {
        id: Date.now().toString(),
        text: "Cảm ơn bạn đã liên hệ. Bạn có thể cho tôi biết thêm về nhu cầu của bạn để tôi có thể hỗ trợ tốt hơn?",
        sender: "bot",
        timestamp: new Date(),
        status: "received",
        quickReplies: [
          { id: "search", text: "🔍 Tìm kiếm sản phẩm", action: "search" },
          { id: "order", text: "📦 Kiểm tra đơn hàng", action: "order" },
          { id: "support", text: "💬 Gặp nhân viên hỗ trợ", action: "support" },
        ],
      }
    }

    setMessages((prev) => [...prev, botResponse])
  }

  const handleQuickReply = (action: string, text: string) => {
    // Thêm lựa chọn của người dùng vào chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    }

    setMessages((prev) => [...prev, userMessage])

    // Hiển thị "đang nhập" cho bot
    setIsTyping(true)

    // Xử lý hành động dựa trên nút được nhấn
    setTimeout(() => {
      setIsTyping(false)

      switch (action) {
        case "search":
          handleBotResponse("tìm sản phẩm")
          break
        case "order":
          handleBotResponse("kiểm tra đơn hàng")
          break
        case "support":
          handleBotResponse("gặp nhân viên hỗ trợ")
          break
        case "more_products":
          const productsResponse: Message = {
            id: Date.now().toString(),
            text: "Bạn có thể xem tất cả sản phẩm của chúng tôi tại trang sản phẩm:",
            sender: "bot",
            timestamp: new Date(),
            status: "received",
            quickReplies: [{ id: "go_products", text: "Đi đến trang sản phẩm", action: "go_to_products" }],
          }
          setMessages((prev) => [...prev, productsResponse])
          break
        case "view_promotions":
          const promoResponse: Message = {
            id: Date.now().toString(),
            text: "Đây là một số sản phẩm đang được khuyến mãi:",
            sender: "bot",
            timestamp: new Date(),
            status: "received",
            product: {
              id: 3,
              name: "Phấn nước Thanh Tâm",
              price: 550000,
              image: "/placeholder.svg?height=100&width=100",
            },
          }
          setMessages((prev) => [...prev, promoResponse])
          break
        case "login":
        case "go_to_products":
          // Trong thực tế, bạn sẽ chuyển hướng người dùng đến trang tương ứng
          const redirectResponse: Message = {
            id: Date.now().toString(),
            text: `Đang chuyển hướng bạn đến trang ${action === "login" ? "đăng nhập" : "sản phẩm"}...`,
            sender: "bot",
            timestamp: new Date(),
            status: "received",
          }
          setMessages((prev) => [...prev, redirectResponse])
          break
        default:
          handleBotResponse(text)
      }
    }, 1000)
  }

  const resetChat = () => {
    // Xóa lịch sử chat và bắt đầu lại
    localStorage.removeItem("chatHistory")
    setIsAgentMode(false)

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: "Xin chào! Tôi có thể giúp bạn tìm sản phẩm, kiểm tra đơn hàng hoặc tư vấn ưu đãi hôm nay. Bạn cần gì ạ?",
      sender: "bot",
      timestamp: new Date(),
      status: "received",
      quickReplies: [
        { id: "search", text: "🔍 Tìm kiếm sản phẩm", action: "search" },
        { id: "order", text: "📦 Kiểm tra đơn hàng", action: "order" },
        { id: "support", text: "💬 Gặp nhân viên hỗ trợ", action: "support" },
      ],
    }

    setMessages([welcomeMessage])
  }

  // Hiển thị trạng thái tin nhắn
  const renderMessageStatus = (status: MessageStatus) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400" />
      case "sent":
        return <CheckCircle2 className="h-3 w-3 text-gray-400" />
      case "received":
        return <CheckCircle2 className="h-3 w-3 text-blue-500" />
      case "read":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-pink-600 hover:bg-pink-700 z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 shadow-xl z-50 overflow-hidden flex flex-col h-[500px]">
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <div className="bg-pink-600 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Trợ lý Thanh Tâm</h3>
                <p className="text-sm opacity-90">
                  {isAgentMode ? "Đang nói chuyện với nhân viên" : "Hỗ trợ trực tuyến 24/7"}
                </p>
              </div>
              <TabsList className="bg-pink-700">
                <TabsTrigger value="chat" className="text-white data-[state=active]:bg-pink-800">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="faq" className="text-white data-[state=active]:bg-pink-800">
                  FAQ
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col">
                    <div
                      className={`flex items-start gap-2 ${msg.sender !== "user" ? "flex-row" : "flex-row-reverse"}`}
                    >
                      {msg.sender === "user" ? (
                        <Avatar className="h-8 w-8 bg-pink-100">
                          <User className="h-4 w-4 text-pink-600" />
                        </Avatar>
                      ) : msg.sender === "agent" ? (
                        <Avatar className="h-8 w-8 bg-blue-100">
                          <User className="h-4 w-4 text-blue-600" />
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8 bg-gray-100">
                          <Bot className="h-4 w-4 text-gray-600" />
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[80%] flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`p-3 rounded-lg ${
                            msg.sender === "user"
                              ? "bg-pink-100 text-gray-800"
                              : msg.sender === "agent"
                                ? "bg-blue-100 text-gray-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {msg.text}
                        </div>

                        {/* Hiển thị sản phẩm nếu có */}
                        {msg.product && (
                          <div className="mt-2 bg-white border rounded-lg p-2 w-full">
                            <div className="flex items-center gap-2">
                              <img
                                src={msg.product.image || "/placeholder.svg"}
                                alt={msg.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{msg.product.name}</p>
                                <p className="text-pink-600 text-sm font-semibold">
                                  {formatCurrency(msg.product.price)}
                                </p>
                              </div>
                              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Quick replies */}
                        {msg.quickReplies && msg.quickReplies.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.quickReplies.map((reply) => (
                              <Button
                                key={reply.id}
                                variant="outline"
                                size="sm"
                                className="text-pink-600 border-pink-200 hover:bg-pink-50"
                                onClick={() => handleQuickReply(reply.action, reply.text)}
                              >
                                {reply.text}
                              </Button>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {msg.sender === "user" && <span className="ml-1">{renderMessageStatus(msg.status)}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Hiển thị "đang nhập" */}
                {isTyping && (
                  <div className="flex items-start gap-2">
                    {isAgentMode ? (
                      <Avatar className="h-8 w-8 bg-blue-100">
                        <User className="h-4 w-4 text-blue-600" />
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8 bg-gray-100">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </Avatar>
                    )}
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                          .
                        </span>
                        <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                          .
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="border-t p-3 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1"
                />
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="faq" className="flex-1 p-4 overflow-y-auto m-0">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Câu hỏi thường gặp</h3>

                <div className="space-y-3">
                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium">Làm thế nào để đặt hàng?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Bạn có thể đặt hàng trực tuyến thông qua website hoặc gọi điện đến số hotline 1900 xxxx.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium">Chính sách đổi trả như thế nào?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Thanh Tâm Cosmetics chấp nhận đổi trả trong vòng 30 ngày kể từ ngày mua hàng.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium">Phí vận chuyển là bao nhiêu?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Miễn phí vận chuyển cho đơn hàng từ 500.000đ. Đơn hàng dưới 500.000đ, phí vận chuyển là 30.000đ.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium">Thời gian giao hàng?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Thời gian giao hàng từ 2-5 ngày làm việc tùy thuộc vào khu vực.
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium">Làm thế nào để theo dõi đơn hàng?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản hoặc sử dụng mã đơn hàng được gửi
                      qua email.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 border-pink-600 text-pink-600 hover:bg-pink-50"
                  onClick={() => resetChat()}
                >
                  Bắt đầu cuộc trò chuyện mới
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </>
  )
}
