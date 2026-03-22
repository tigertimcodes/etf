// netlify/functions/fetch-etfs.js
// Called on page load AND on the weekly cron schedule (Monday 9am ET)

export default async function handler(req, context) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  const today = new Date().toISOString().split('T')[0]

  try {
    // Step 1: Get ETF list via Claude web search
    const listRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: `Fetch https://stockanalysis.com/etf/list/new/ and find ETFs launched after ${sevenDaysAgo}.

For each ETF found, identify the issuer company. Return ONLY a JSON array, no markdown:
[{"etf":"full fund name","ticker":"SYMBOL","company":"issuer name"}]
Max 10 results.`
        }]
      })
    })

    const listData = await listRes.json()
    const listText = listData.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '[]'
    const listMatch = listText.match(/\[[\s\S]*?\]/)
    const etfList = listMatch ? JSON.parse(listMatch[0]).slice(0, 10) : []

    if (etfList.length === 0) {
      return Response.json({ leads: [], date: today })
    }

    // Step 2: For each company, find LinkedIn + marketer (parallel, fast)
    const enriched = await Promise.all(
      etfList.map(async (item) => {
        try {
          const enrichRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01',
              'anthropic-beta': 'web-search-2025-03-05',
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 600,
              tools: [{ type: 'web_search_20250305', name: 'web_search' }],
              messages: [{
                role: 'user',
                content: `Search for "${item.company} LinkedIn company" and "${item.company} ETF marketing".
Return ONLY this JSON (no markdown):
{"linkedin":"https://linkedin.com/company/... or null","marketers":[{"name":"First Last","title":"Job Title"}]}
Max 2 marketers.`
              }]
            })
          })
          const enrichData = await enrichRes.json()
          const enrichText = enrichData.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '{}'
          const enrichMatch = enrichText.replace(/```json|```/g, '').match(/\{[\s\S]*\}/)
          const extra = enrichMatch ? JSON.parse(enrichMatch[0]) : {}
          return { ...item, linkedin: extra.linkedin || null, marketers: extra.marketers || [] }
        } catch {
          return { ...item, linkedin: null, marketers: [] }
        }
      })
    )

    return Response.json({ leads: enriched, date: today })

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
