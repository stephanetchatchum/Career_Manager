import { useState, useRef, useEffect } from 'react'
import { callAI, buildSystemPrompt } from '../utils/ai'

const QUICK_PROMPTS = [
  { label: 'Analyze CERN for me', text: 'Analyze the CERN Short Term Internship opportunity for me — am I a good fit and what should I emphasize in my application?', type: 'complex' },
  { label: 'Write a cover letter', text: 'Write a tailored cover letter for my top science internship target. Use my profile and make it genuine, not generic.', type: 'complex' },
  { label: 'This week focus', text: 'Based on my opportunities and learning progress, what should I prioritize this week?', type: 'simple' },
  { label: 'Deadlines check', text: 'Which of my tracked opportunities have the most urgent deadlines? What should I act on today?', type: 'simple' },
]

export default function Chat({ profile, opps, learning, apiKeys }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState('full')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const getContext = () => {
    if (context === 'profile') return {}
    if (context === 'opps') return { opportunities: opps }
    if (context === 'learning') return { learning }
    return { opportunities: opps, learning }
  }

  const send = async (text, taskType = 'simple') => {
    if (!text.trim()) return
    if (!apiKeys.groq && !apiKeys.claude) {
      setMessages(prev => [...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: '⚠️ No API key configured. Go to Settings tab to add your Groq API key (free) or Claude API key.' }
      ])
      return
    }

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const systemPrompt = buildSystemPrompt(profile, getContext())
      const history = [...messages, userMsg]
      const reply = await callAI(
        history.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
        systemPrompt,
        taskType,
        apiKeys
      )
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[400px]">
      <div className="flex items-center gap-2 mb-3">
        <select
          className="input text-xs py-1.5"
          style={{ width: 'auto' }}
          value={context}
          onChange={e => setContext(e.target.value)}
        >
          <option value="profile">Profile only</option>
          <option value="opps">+ Opportunities</option>
          <option value="learning">+ Learning</option>
          <option value="full">Full context</option>
        </select>
        <button onClick={() => setMessages([])} className="btn btn-sm text-xs">Clear</button>
        <div className="ml-auto text-xs text-gray-400">
          {apiKeys.claude ? '⚡ Claude' : apiKeys.groq ? '⚡ Groq' : '⚠ No key'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-messages space-y-3 mb-3">
        {messages.length === 0 ? (
          <div className="py-6 text-center">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-sm text-gray-500 mb-4">Ask me anything about your career, applications, or learning.</p>
            <div className="space-y-2">
              {QUICK_PROMPTS.map(q => (
                <button
                  key={q.label}
                  onClick={() => send(q.text, q.type)}
                  className="btn btn-sm w-full justify-start text-left"
                >
                  {q.label} ↗
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                m.role === 'user'
                  ? 'bg-gray-900 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm prose-ai'
              }`}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl rounded-bl-sm px-4 py-3 text-sm text-gray-500">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t pt-3">
        <input
          className="input flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about opportunities, cover letters, deadlines..."
          disabled={loading}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="btn btn-primary px-4 disabled:opacity-40"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
