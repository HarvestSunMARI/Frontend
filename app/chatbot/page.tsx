"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageCircle, Send, User, Bot } from "lucide-react";



const suggestionsList = [
  "Apa tanaman terbaik untuk musim hujan?",
  "Bagaimana cara mengatasi hama pada padi?",
  "Kapan waktu panen terbaik untuk tomat?",
  "Apa pupuk organik yang disarankan?",
  "Bagaimana sistem irigasi tetes bekerja?",
  "Cuaca minggu ini cocok untuk menanam apa?",
  "Bagaimana mendeteksi penyakit pada daun?",
  "Apa strategi pemasaran hasil panen?",
  "Bagaimana membuat kompos alami sendiri?"
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "👋 Halo! Saya siap membantu pertanyaan seputar pertanian digital. Silakan tanya apa saja." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    showRandomSuggestions();
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  function showRandomSuggestions() {
    const shuffled = [...suggestionsList].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  }

  function addMessage(role: string, text: string) {
    setMessages((prev) => [...prev, { role, text }]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;
    addMessage("user", question);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `Kamu adalah asisten cerdas yang membantu dalam sistem pertanian digital. Jawabanmu HARUS:\n- Menggunakan bahasa Indonesia yang sopan, ramah, dan mudah dimengerti oleh petani.\n- Ditulis dengan struktur yang rapi: gunakan paragraf pendek, poin-poin (bullet) jika memungkinkan.\n- Memberikan saran praktis dan aplikatif.\n\nFokus pada:\n• Jenis tanaman yang cocok berdasarkan musim dan lokasi\n• Tips pemupukan dan pestisida ramah lingkungan\n• Manajemen irigasi dan pengairan\n• Deteksi dan solusi penyakit tanaman\n• Perkiraan cuaca dan dampaknya\n• Prediksi waktu dan hasil panen\n• Saran pemasaran dan distribusi hasil tani\n\nJangan menggunakan bahasa Inggris atau istilah teknis tanpa penjelasan singkat.`
            },
            { role: "user", content: question }
          ]
        })
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Tidak ada respons dari AI.";
      addMessage("ai", reply);
      showRandomSuggestions();
    } catch (err) {
      addMessage("ai", "Terjadi kesalahan saat mengambil respons dari AI.");
      showRandomSuggestions();
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestionClick(q: string) {
    setInput(q);
  }

  return (
    <DashboardLayout>
      <div className="p-0 sm:p-6 flex flex-col items-center min-h-[80vh] bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="w-full max-w-7xl mt-8 mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-earth-green-700 mb-2">
            <MessageCircle className="h-6 w-6 text-earth-green-600" /> Chatbot
          </h1>
        </div>
        <div className="w-full max-w-7xl flex-1 flex flex-col rounded-2xl bg-white/80 shadow-xl border border-green-100" style={{ minHeight: 420 }}>
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            ref={chatBoxRef}
            id="chatBox"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                    <Bot className="h-6 w-6 text-green-600" />
                  </div>
                )}
                <div
                  className={`max-w-[60%] px-4 py-2 rounded-2xl shadow-md whitespace-pre-line text-base transition-all duration-200 ${
                    msg.role === "user"
                      ? "bg-green-500 text-white rounded-br-md"
                      : "bg-white text-green-900 rounded-bl-md border border-green-100"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0 bg-green-500 rounded-full p-1">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2 animate-fade-in justify-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                  <Bot className="h-6 w-6 text-green-600" />
                </div>
                <div className="max-w-[60%] px-4 py-2 rounded-2xl shadow-md bg-white text-green-900 border border-green-100 opacity-70">
                  Mengetik...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-white/90 rounded-b-2xl shadow-inner" id="chatForm">
            <input
              id="userInput"
              className="flex-1 border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 bg-green-50 text-green-900"
              placeholder="Tulis pertanyaan..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-60 shadow"
              disabled={loading || !input.trim()}
            >
              <Send className="h-5 w-5" />
              Kirim
            </button>
          </form>
        </div>
        <div className="w-full max-w-7xl mt-4">
          <div className="suggestions flex flex-wrap gap-2">
            <span className="w-full text-sm text-green-700 mb-1">Pertanyaan cepat:</span>
            {suggestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-lg text-sm border border-green-200 shadow-sm"
                onClick={() => handleSuggestionClick(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.4s;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
} 