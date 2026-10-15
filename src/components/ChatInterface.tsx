'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { Send, Loader2, Trash2, Edit2, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { auth } from '@/auth'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: string
}

interface Chat {
  id: string
  title: string
  updatedAt: string
  messages?: Message[]
}

export function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [newChatTitle, setNewChatTitle] = useState('')
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchChats() {
    const res = await fetch('/api/chats')
    if (res.ok) {
      const data = await res.json()
      setChats(data)
      if (data.length > 0 && !currentChatId) {
        setCurrentChatId(data[0].id)
        await fetchMessages(data[0].id)
      }
    }
  }

  async function fetchMessages(chatId: string) {
    const res = await fetch(`/api/chats/${chatId}`)
    if (res.ok) {
      const chat = await res.json()
      setMessages(chat.messages || [])
    }
  }

  async function handleNewChat() {
    const res = await fetch('/api/chats', { method: 'POST' })
    if (res.ok) {
      const chat = await res.json()
      setChats([chat, ...chats])
      setCurrentChatId(chat.id)
      setMessages([])
    }
  }

  async function handleSelectChat(chatId: string) {
    setCurrentChatId(chatId)
    await fetchMessages(chatId)
    setShowSidebar(false)
  }

  async function handleDeleteChat(chatId: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Delete this chat?')) return
    const res = await fetch(`/api/chats/${chatId}`, { method: 'DELETE' })
    if (res.ok) {
      setChats(chats.filter((c) => c.id !== chatId))
      if (currentChatId === chatId) {
        const remaining = chats.filter((c) => c.id !== chatId)
        if (remaining.length > 0) {
          await handleSelectChat(remaining[0].id)
        } else {
          setCurrentChatId(null)
          setMessages([])
        }
      }
    }
  }

  async function handleRenameChat(chatId: string, e: React.MouseEvent) {
    e.stopPropagation()
    const chat = chats.find((c) => c.id === chatId)
    if (chat) {
      setEditingChatId(chatId)
      setEditTitle(chat.title)
    }
  }

  async function handleSaveRename(chatId: string) {
    if (!editTitle.trim()) return
    const res = await fetch(`/api/chats/${chatId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle }),
    })
    if (res.ok) {
      const updated = await res.json()
      setChats(chats.map((c) => (c.id === chatId ? updated : c)))
      setEditingChatId(null)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading || !currentChatId) return

    const userMessage = input
    setInput('')
    setIsLoading(true)

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content: userMessage, role: 'user', createdAt: new Date().toISOString() },
    ])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, chatId: currentChatId }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), content: data.message, role: 'assistant', createdAt: new Date().toISOString() },
        ])
        if (data.chatId !== currentChatId) {
          setCurrentChatId(data.chatId)
        }
        fetchChats()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentChat = chats.find((c) => c.id === currentChatId)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          'w-72 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-transform duration-300',
          showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Claude Chat</h1>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">No chats yet</p>
          ) : (
            <ul className="space-y-1">
              {chats.map((chat) =>
                editingChatId === chat.id ? (
                  <li key={chat.id}>
                    <div className="flex items-center gap-1 p-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(chat.id)}
                        onBlur={() => handleSaveRename(chat.id)}
                        autoFocus
                        className="flex-1 px-2 py-1 text-sm border border-primary-300 dark:border-primary-700 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={() => handleSaveRename(chat.id)}
                        className="p-1 text-primary-600 hover:bg-primary-100 rounded"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </li>
                ) : (
                  <li key={chat.id}>
                    <button
                      onClick={() => handleSelectChat(chat.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg transition-colors',
                        currentChatId === chat.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      <span className="flex-1 truncate">{chat.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleRenameChat(chat.id, e)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus size={20} />
            </button>
            <div>
              <h2 className="font-medium text-gray-900 dark:text-white">
                {currentChat?.title || 'Select a chat'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentChat ? `${messages.length} messages` : 'Start a new conversation'}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6" role="log" aria-live="polite">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-medium mb-2">Welcome to Claude Chat</h3>
              <p className="text-sm max-w-xs text-center">
                Start a new chat or select an existing conversation from the sidebar.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {isLoading && (
          <div className="px-4 py-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Claude is thinking...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-end gap-2 max-w-3xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Message Claude... (Shift+Enter for new line)"
              disabled={isLoading || !currentChatId}
              rows={1}
              className="flex-1 resize-none px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              style={{ minHeight: '44px', maxHeight: '200px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || !currentChatId}
              className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </main>
    </div>
  )
}

function Message({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex gap-3 animate-fade-in', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        )}
      >
        {isUser ? '👤' : '🤖'}
      </div>
      <div
        className={cn(
          'max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-md'
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
}