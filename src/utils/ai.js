export async function callGroq(messages, systemPrompt, apiKey) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
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
      messages: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Claude error')
  return data.content[0].text
}

// Route based on task type
// Simple = Groq (fast, free): quick questions, deadline checks, tips
// Complex = Claude (smart): cover letters, CV tailoring, deep analysis
export async function callAI(messages, systemPrompt, taskType, keys) {
  const isComplex = taskType === 'complex'
  
  if (isComplex && keys.claude) {
    return await callClaude(messages, systemPrompt, keys.claude)
  } else if (keys.groq) {
    return await callGroq(messages, systemPrompt, keys.groq)
  } else if (keys.claude) {
    return await callClaude(messages, systemPrompt, keys.claude)
  } else {
    throw new Error('No API key configured. Go to Settings to add your Groq or Claude API key.')
  }
}

export function buildSystemPrompt(profile, context = {}) {
  let sys = `You are a personal career manager AI assistant. Be concise, practical, and specific. Always use the user's actual details in responses.

USER PROFILE:
Name: ${profile.name || 'Not set'}
Current role: ${profile.role || 'Not set'}
Education: ${profile.education || 'Not set'}
Skills: ${profile.skills || 'Not set'}
Deployed projects: ${profile.projects || 'Not set'}
Career goals: ${profile.goals || 'Not set'}
Target organisations: ${profile.targets || 'Not set'}
`

  if (context.opportunities && context.opportunities.length > 0) {
    sys += `\nTRACKED OPPORTUNITIES (${context.opportunities.length}):\n`
    context.opportunities.forEach(o => {
      const days = o.deadline ? daysUntil(o.deadline) : null
      sys += `- ${o.role} at ${o.company} | Status: ${o.status} | Deadline: ${o.deadline || 'none'}${days !== null ? ` (${days} days)` : ''} | Paid: ${o.paid ? 'yes' : 'no'}${o.notes ? ' | Notes: ' + o.notes : ''}\n`
    })
  }

  if (context.learning) {
    const l = context.learning
    sys += `\nLEARNING PROGRESS:
Current streak: ${l.streak || 0} days
Today: NeetCode ${l.today?.neetcode ? '✓' : '✗'}, Khan Academy ${l.today?.khan ? '✓' : '✗'}, Reading ${l.today?.reading ? '✓' : '✗'}
300-curriculum: Project #${l.project || 1} of 300
`
  }

  return sys
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return Math.round((d - now) / 86400000)
}

export { daysUntil }
