"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  ArrowRight,
  CheckCircle2,
  Clock,
  RefreshCw, // thêm icon refresh
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link"; // Thêm nếu dùng Next.js, nếu không thì dùng thẻ <a>

// Định nghĩa các loại tin nhắn
type MessageStatus = "sending" | "sent" | "received" | "read";
type MessageSender = "user" | "bot" | "agent";

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

interface ProductInfo {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  status: MessageStatus;
  quickReplies?: QuickReply[];
  product?: ProductInfo;
  uniqueKey?: string; // Thêm trường này để đảm bảo key là duy nhất
}

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [chatSummaries, setChatSummaries] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tải lịch sử chat từ localStorage khi component được mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        // Chuyển đổi chuỗi timestamp thành đối tượng Date
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Lỗi khi phân tích lịch sử chat:", error);
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
        uniqueKey: createUniqueKey(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Tải tóm tắt hội thoại từ localStorage khi component được mount
  useEffect(() => {
    const savedSummaries = localStorage.getItem("chatSummary");
    if (savedSummaries) {
      try {
        setChatSummaries(JSON.parse(savedSummaries));
      } catch {
        setChatSummaries([]);
      }
    }
  }, []);

  // Lưu tin nhắn vào localStorage khi messages thay đổi
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // Lưu tóm tắt hội thoại vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("chatSummary", JSON.stringify(chatSummaries));
  }, [chatSummaries]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Khởi tạo WebSocket khi mở chat
  useEffect(() => {
    if (isOpen && !ws) {
      const socket = new WebSocket(
        `${process.env.NEXT_PUBLIC_API_WEBSOCKET}/api/ws/chat`
      );
      setWs(socket);

      socket.onopen = () => setWsConnected(true);
      socket.onclose = () => setWsConnected(false);
      socket.onerror = () => setWsConnected(false);

      socket.onmessage = (event) => {
        setIsTyping(false);
        // Mỗi phản hồi là 1 message string, có thể nhận nhiều lần cho 1 câu hỏi
        const botMessage: Message = {
          id: Date.now().toString(),
          text: event.data,
          sender: "bot",
          timestamp: new Date(),
          status: "received",
          uniqueKey: createUniqueKey(),
        };
        setMessages((prev) => [...prev, botMessage]);
      };
    }
    // Đóng ws khi đóng chat
    if (!isOpen && ws) {
      ws.close();
      setWs(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Hàm chuyển đổi messages FE sang history cho backend
  const buildHistory = () => {
    // Lấy chỉ số đã tóm tắt cuối cùng
    const lastSummarizedIndex = Number(
      localStorage.getItem("lastSummarizedIndex") || "0"
    );
    // Chỉ lấy các message mới hơn lần tóm tắt cuối
    return messages
      .filter(
        (msg, idx) =>
          (msg.sender === "user" || msg.sender === "bot") &&
          idx >= lastSummarizedIndex
      )
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
      uniqueKey: createUniqueKey(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
    }, 500);

    // Nếu đang ở agent mode thì xử lý như cũ (giả lập)
    if (isAgentMode) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const agentResponse: Message = {
          id: Date.now().toString(),
          text: "Cảm ơn bạn đã liên hệ. Tôi là Hương, nhân viên tư vấn của Thanh Tâm Cosmetics. Tôi có thể giúp gì cho bạn ạ?",
          sender: "agent",
          timestamp: new Date(),
          status: "received",
          uniqueKey: createUniqueKey(),
        };
        setMessages((prev) => [...prev, agentResponse]);
      }, 1500);
      return;
    }

    // Gửi message tới backend qua WebSocket (dạng JSON)
    if (ws && wsConnected) {
      setIsTyping(true);
      const payload = {
        message: input,
        history: buildHistory(),
        summary: chatSummaries, // gửi summary cùng history
      };
      ws.send(JSON.stringify(payload));
    } else {
      // Nếu ws chưa sẵn sàng, chỉ báo lỗi
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Không thể kết nối tới máy chủ chatbot. Vui lòng thử lại sau.",
          sender: "bot",
          timestamp: new Date(),
          status: "received",
          uniqueKey: createUniqueKey(),
        },
      ]);
    }
  };

  const handleQuickReply = (action: string, text: string) => {
    // Thêm lựa chọn của người dùng vào chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
      uniqueKey: createUniqueKey(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Nếu đang ở agent mode thì xử lý như cũ
    if (isAgentMode) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const agentResponse: Message = {
          id: Date.now().toString(),
          text: "Cảm ơn bạn đã liên hệ. Tôi là Hương, nhân viên tư vấn của Thanh Tâm Cosmetics. Tôi có thể giúp gì cho bạn ạ?",
          sender: "agent",
          timestamp: new Date(),
          status: "received",
          uniqueKey: createUniqueKey(),
        };
        setMessages((prev) => [...prev, agentResponse]);
      }, 1500);
      return;
    }

    // Gửi action/text tới backend qua WebSocket (dạng JSON)
    if (ws && wsConnected) {
      setIsTyping(true);
      const payload = {
        message: text,
        history: buildHistory(),
        summary: chatSummaries, // gửi summary cùng history
      };
      ws.send(JSON.stringify(payload));
    } else {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Không thể kết nối tới máy chủ chatbot. Vui lòng thử lại sau.",
          sender: "bot",
          timestamp: new Date(),
          status: "received",
          uniqueKey: createUniqueKey(),
        },
      ]);
    }
  };

  // Tóm tắt sau mỗi 5 tin nhắn (user+bot)
  useEffect(() => {
    const lastSummarizedIndex = Number(
      localStorage.getItem("lastSummarizedIndex") || "0"
    );
    const chatMsgs = messages.filter(
      (msg) => msg.sender === "user" || msg.sender === "bot"
    );
    if (chatMsgs.length - lastSummarizedIndex >= 5) {
      const msgsToSummarize = chatMsgs.slice(lastSummarizedIndex);
      // Gộp summary trước đó (nếu có) với 5 history mới nhất để tạo summary mới
      const prevSummary =
        chatSummaries.length > 0 ? chatSummaries[chatSummaries.length - 1] : "";
      const payload: any = {
        messages: msgsToSummarize.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        })),
      };
      if (prevSummary) {
        payload.prev_summary = prevSummary;
      }
      import("@/utils/axios-instance").then(({ default: axiosInstance }) => {
        axiosInstance
          .post("/chat/summary", payload)
          .then((res) => {
            const data = res.data;
            if (data.summary) {
              setChatSummaries((prev) => [...prev, data.summary]);
              localStorage.setItem(
                "lastSummarizedIndex",
                String(chatMsgs.length)
              );
            }
          })
          .catch(() => {});
      });
    }
  }, [messages]);

  const resetChat = () => {
    // Xóa lịch sử chat và tóm tắt chỉ khi bấm nút bắt đầu trò chuyện mới
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("chatSummary");
    localStorage.removeItem("lastSummarizedIndex");
    setIsAgentMode(false);
    setChatSummaries([]);

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
      uniqueKey: createUniqueKey(),
    };

    setMessages([welcomeMessage]);
  };

  // Hiển thị trạng thái tin nhắn
  const renderMessageStatus = (status: MessageStatus) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400" />;
      case "sent":
        return <CheckCircle2 className="h-3 w-3 text-gray-400" />;
      case "received":
        return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
      case "read":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  // Hàm tạo unique key cho message
  const createUniqueKey = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString() + Math.random().toString(36).slice(2);

  // Hàm parse message dạng sản phẩm
  function parseProductMessage(text: string) {
    // Ví dụ: 📦 Sản phẩm 01 💰 Giá: 120,000đ
    // 🖼️ Hình ảnh: ... (có thể có hoặc không)
    // 🔗 Xem chi tiết: /products/8
    const nameMatch = text.match(/📦\s*([^\n💰]+)/);
    const priceMatch = text.match(/💰\s*Giá:\s*([0-9.,]+)đ/);
    const linkMatch = text.match(/🔗\s*Xem chi tiết:\s*(\/products\/\d+)/);
    const imgMatch = text.match(/🖼️\s*Hình ảnh:\s*([^\n]+)/);

    if (nameMatch && priceMatch && linkMatch) {
      return {
        name: nameMatch[1].trim(),
        price: priceMatch[1].replace(/,/g, "").trim(),
        link: linkMatch[1].trim(),
        image: imgMatch ? imgMatch[1].trim() : null,
      };
    }
    return null;
  }

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-pink-600 hover:bg-pink-700 z-50"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 shadow-xl z-50 overflow-hidden flex flex-col h-[500px]">
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <div className="bg-pink-600 text-white p-4 flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="font-medium text-lg leading-tight">
                  Trợ lý Thanh Tâm
                </h3>
                <p className="text-xs opacity-90">
                  {isAgentMode
                    ? "Đang nói chuyện với nhân viên"
                    : "Hỗ trợ trực tuyến 24/7"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="p-1 h-8 w-8 rounded-full border border-white/30 hover:bg-pink-700"
                  onClick={resetChat}
                  type="button"
                  title="Bắt đầu chat mới"
                >
                  <RefreshCw className="h-4 w-4 text-white" />
                </Button>
                {/* <TabsList className="bg-pink-700 ml-1">
                  <TabsTrigger
                    value="chat"
                    className="text-white data-[state=active]:bg-pink-800"
                  >
                    Chat
                  </TabsTrigger>
                  Ẩn tab FAQ bằng cách không render TabsTrigger FAQ
                  <TabsTrigger
                    value="faq"
                    className="text-white data-[state=active]:bg-pink-800"
                  >
                    FAQ
                  </TabsTrigger>
                </TabsList> */}
              </div>
            </div>

            <TabsContent
              value="chat"
              className="flex-1 flex flex-col p-0 m-0 overflow-hidden"
            >
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                {messages.map((msg, idx) => {
                  // Nếu là tin nhắn bot và có dạng sản phẩm thì parse
                  const productParsed =
                    msg.sender === "bot" ? parseProductMessage(msg.text) : null;
                  // Always use a guaranteed unique key
                  const key = msg.uniqueKey || `${msg.id}-${idx}`;
                  return (
                    <div key={key} className="flex flex-col">
                      <div
                        className={`flex items-start gap-2 ${
                          msg.sender !== "user"
                            ? "flex-row"
                            : "flex-row-reverse"
                        }`}
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
                          className={`max-w-[80%] flex flex-col ${
                            msg.sender === "user" ? "items-end" : "items-start"
                          }`}
                        >
                          {/* Nếu là sản phẩm thì hiển thị đẹp */}
                          {productParsed ? (
                            <div className="bg-white border rounded-lg p-3 w-full flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                {productParsed.image ? (
                                  <img
                                    src={productParsed.image}
                                    alt={productParsed.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                    <Bot className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {productParsed.name}
                                  </p>
                                  <p className="text-pink-600 text-sm font-semibold">
                                    {Number(productParsed.price).toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ
                                  </p>
                                </div>
                                <a
                                  href={`${process.env.NEXT_PUBLIC_APP_URL}${productParsed.link}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    size="sm"
                                    className="bg-pink-600 hover:bg-pink-700"
                                  >
                                    <ArrowRight className="h-4 w-4" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                          ) : (
                            // Nếu không phải sản phẩm thì hiển thị như cũ
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
                          )}

                          {/* Hiển thị sản phẩm nếu có (cũ) */}
                          {msg.product && (
                            <div className="mt-2 bg-white border rounded-lg p-2 w-full">
                              <div className="flex items-center gap-2">
                                <img
                                  src={msg.product.image || "/placeholder.svg"}
                                  alt={msg.product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {msg.product.name}
                                  </p>
                                  <p className="text-pink-600 text-sm font-semibold">
                                    {formatCurrency(msg.product.price)}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-pink-600 hover:bg-pink-700"
                                >
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
                                  onClick={() =>
                                    handleQuickReply(reply.action, reply.text)
                                  }
                                >
                                  {reply.text}
                                </Button>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {msg.sender === "user" && (
                              <span className="ml-1">
                                {renderMessageStatus(msg.status)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

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
                        <span
                          className="animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        >
                          .
                        </span>
                        <span
                          className="animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        >
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
              {/* ĐÃ BỎ nút "Bắt đầu cuộc trò chuyện mới" ở đây */}
            </TabsContent>

            {/* Ẩn hoàn toàn TabsContent FAQ */}
            {/* <TabsContent value="faq" className="flex-1 p-0 m-0 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Câu hỏi thường gặp</h3>

                    <div className="space-y-3">
                      <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium">
                          Làm thế nào để đặt hàng?
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Bạn có thể đặt hàng trực tuyến thông qua website hoặc
                          gọi điện đến số hotline 1900 xxxx.
                        </p>
                      </div>

                      <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium">
                          Chính sách đổi trả như thế nào?
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Thanh Tâm Cosmetics chấp nhận đổi trả trong vòng 30
                          ngày kể từ ngày mua hàng.
                        </p>
                      </div>

                      <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium">
                          Phí vận chuyển là bao nhiêu?
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Miễn phí vận chuyển cho đơn hàng từ 500.000đ. Đơn hàng
                          dưới 500.000đ, phí vận chuyển là 30.000đ.
                        </p>
                      </div>

                      <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium">Thời gian giao hàng?</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Thời gian giao hàng từ 2-5 ngày làm việc tùy thuộc vào
                          khu vực.
                        </p>
                      </div>

                      <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium">
                          Làm thế nào để theo dõi đơn hàng?
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào
                          tài khoản hoặc sử dụng mã đơn hàng được gửi qua email.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent> */}
          </Tabs>
        </Card>
      )}
    </>
  );
}
