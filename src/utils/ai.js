export async function callGroq(messages, systemPrompt, apiKey) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 800,
      messages: [{ role: 'system', content: systemPrompt }, ...messages]
    })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Groq error')
  return data.choices[0].message.content
}

export async function callClaude(messages, systemPrompt, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
    })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Claude error')
  return data.content[0].text
}

export async function callAI(messages, systemPrompt, taskType, keys) {
  if (taskType === 'complex' && keys.claude) return await callClaude(messages, systemPrompt, keys.claude)
  if (keys.groq) return await callGroq(messages, systemPrompt, keys.groq)
  if (keys.claude) return await callClaude(messages, systemPrompt, keys.claude)
  throw new Error('No API key configured. Go to Settings to add your Groq or Claude API key.')
}

export function buildSystemPrompt(profile, context = {}) {
  let sys = `You are a personal career manager AI. Be concise, practical, and specific. Always use the user's actual details.

USER PROFILE:
Name: ${profile.name || 'Not set'}
Role: ${profile.role || 'Not set'}
Education: ${profile.education || 'Not set'}
Skills: ${profile.skills || 'Not set'}
Projects: ${profile.projects || 'Not set'}
Goals: ${profile.goals || 'Not set'}
Targets: ${profile.targets || 'Not set'}
`

  if (profile.docContext) {
    sys += `\n--- PROGRAMME & STRATEGY CONTEXT ---\n${profile.docContext}\n--- END CONTEXT ---\n`
  }

  if (context.opportunities && context.opportunities.length > 0) {
    sys += `\nTRACKED OPPORTUNITIES:\n`
    context.opportunities.forEach(o => {
      const days = o.deadline ? daysUntil(o.deadline) : null
      sys += `- ${o.role} at ${o.company} | ${o.status} | Deadline: ${o.deadline || 'none'}${days !== null ? ` (${days}d)` : ''}${o.paid ? ' | Paid' : ''}${o.notes ? ' | ' + o.notes : ''}\n`
    })
  }

  if (context.learning) {
    const l = context.learning
    sys += `\nLEARNING:
Streak: ${l.streak || 0} days | Today: NeetCode ${l.today?.neetcode ? '✓' : '✗'} Khan ${l.today?.khan ? '✓' : '✗'} Reading ${l.today?.reading ? '✓' : '✗'}
300-curriculum: Project #${l.project || 1} of 300
`
  }

  if (context.programme) {
    const done = Object.values(context.programme).filter(Boolean).length
    sys += `\nPROGRAMME PROGRESS: ${done} milestones completed across 3-year plan\n`
  }

  return sys
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return Math.round((d - now) / 86400000)
}
