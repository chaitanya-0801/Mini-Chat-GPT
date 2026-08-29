import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SendHorizontal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Brain, User } from "lucide-react";
import FormField from "../FormField";
import useChat from "../../hooks/useChat";
import { getAllMessage, joinChat } from "../../services/chatServices";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "highlight.js/styles/github-dark.css";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ChatScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

  const { activeChat, setRefreshChat } = useChat();

  const { register, handleSubmit, reset, setValue } = useForm();

  const [chatId, setChatId] = useState(searchParams.get("chatId") || "");

  const [messages, setMessages] = useState([]);
  const [sent, setSent] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const bottomRef = useRef(null);

  // Copy Message
  const copyMessage = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy.");
    }
  };

  // Fetch Messages
  const fetchMessage = async (id) => {
    if (!id) {
      setMessages([]);
      setChatId("");
      return;
    }

    try {
      const res = await getAllMessage(id);

      setChatId(id);
      setMessages(res?.data?.chat?.messages || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Load messages
  useEffect(() => {
    const id = activeChat || searchParams.get("chatId");

    if (id) {
      fetchMessage(id);
    }
  }, [activeChat, searchParams]);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sent]);

  // Join Shared Chat
  useEffect(() => {
    if (!(params?.seq && params?.chatId)) return;

    const join = async () => {
      const toastId = toast.loading("Joining chat...");

      try {
        const res = await joinChat(params.seq, params.chatId);

        if (res?.data?.success) {
          toast.success("Added to shared chat!", {
            id: toastId,
          });

          if (res?.data?.link) {
            await navigator.clipboard.writeText(res.data.link);
          }

          setSearchParams({
            chatId: params.chatId,
          });

          navigate(`/?chatId=${params.chatId}`);
        } else {
          toast.error(res?.data?.message || "Could not join.", {
            id: toastId,
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error joining chat.", {
          id: toastId,
        });
      }
    };

    join();
  }, [params.seq, params.chatId]);

  // Submit
  const onSubmit = async (data) => {
    const prompt = data.prompt?.trim();

    if (!prompt || sent) return;

    let tempAIMessage = null;

    try {
      setSent(true);

      // Add user message immediately
      const userMessage = {
        _id: crypto.randomUUID(),
        ownerType: "user",
        content: prompt,
      };

      // Add empty AI message immediately
      tempAIMessage = {
        _id: crypto.randomUUID(),
        ownerType: "AI",
        content: "",
        streaming: true,
      };

      setMessages((prev) => [...prev, userMessage, tempAIMessage]);

      reset();

      // Start streaming request
      const response = await fetch(`${API_URL}/chat/ask/${chatId || ""}`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI response");
      }

      if (!response.body) {
        throw new Error("Response stream is not available");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        // Convert bytes to text
        buffer += decoder.decode(value, {
          stream: true,
        });

        // SSE events are separated by \n\n
        const events = buffer.split("\n\n");

        // Keep incomplete event for next chunk
        buffer = events.pop();

        for (const event of events) {
          if (!event.startsWith("data: ")) continue;

          const jsonData = event.replace("data: ", "");

          let parsedData;

          try {
            parsedData = JSON.parse(jsonData);
          } catch (error) {
            console.error("SSE parsing error:", error);
            continue;
          }

          // AI text chunk
          if (parsedData.type === "text") {
            setMessages((prev) =>
              prev.map((message) =>
                message._id === tempAIMessage._id
                  ? {
                      ...message,
                      content: message.content + parsedData.text,
                    }
                  : message,
              ),
            );
          }

          // Stream finished
          if (parsedData.type === "done") {
            const newChatId = parsedData.chatId;

            if (newChatId) {
              setChatId(newChatId);

              setSearchParams({
                chatId: newChatId,
              });

              setRefreshChat((prev) => !prev);
            }

            // Replace temporary AI ID with real MongoDB ID
            setMessages((prev) =>
              prev.map((message) =>
                message._id === tempAIMessage._id
                  ? {
                      ...message,
                      _id: parsedData.assistantMessage?._id || message._id,
                      streaming: false,
                    }
                  : message,
              ),
            );
          }
        }
      }
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to generate AI response");

      // Remove temporary AI message
      if (tempAIMessage) {
        setMessages((prev) =>
          prev.filter((message) => message._id !== tempAIMessage._id),
        );
      }
    } finally {
      setSent(false);
    }
  };

  return (
    <div className="flex h-[95%] flex-1 flex-col bg-zinc-950 text-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-5xl font-bold">How can I help you today?</h1>

            <p className="mt-4 text-zinc-500">Start a conversation below.</p>

            <div className="mt-10 grid max-w-2xl gap-4 md:grid-cols-2">
              {[
                "Explain React Hooks",
                "Write JWT Authentication",
                "MongoDB Aggregation",
                "Portfolio Project Ideas",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setValue("prompt", item)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-blue-500 hover:bg-zinc-800"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-8">
            {messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`flex items-end gap-3 ${
                  msg.ownerType === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* AI Avatar */}
                {msg.ownerType !== "user" && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                    <Brain size={20} />
                  </div>
                )}

                {/* Message */}
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-md ${
                    msg.ownerType === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <div
                    className="
                    prose
                    prose-invert
                    max-w-none
                    prose-pre:bg-[#161b22]
                    prose-pre:border
                    prose-pre:border-zinc-700
                    prose-code:text-sky-400
                  "
                  >
                    {msg.streaming && !msg.content ? (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-white"></span>

                        <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:.2s]"></span>

                        <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:.4s]"></span>

                        <span className="ml-2 text-sm text-zinc-400">
                          AI is thinking...
                        </span>
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>

                  {/* Copy Button */}
                  {msg.ownerType !== "user" && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(msg.content)
                        }
                        className="text-sm text-zinc-400 transition hover:text-white"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.ownerType === "user" && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}

            {/* Thinking */}
            {/* {sent && (
              <div className="flex items-end gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                  <Brain size={20} />
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:.2s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:.4s]"></span>

                    <span className="ml-2 text-sm text-zinc-400">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )} */}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 bg-zinc-950 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
          <div className="flex items-center rounded-2xl border border-zinc-700 bg-zinc-900 px-4">
            <div className="flex-1">
              <FormField
                id="prompt"
                type="text"
                placeholder="Message ChatGoAI..."
                register={register}
              />
            </div>

            <button
              type="submit"
              disabled={sent}
              className="ml-3 rounded-xl bg-blue-600 p-3 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
