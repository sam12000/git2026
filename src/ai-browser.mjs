// IA optionnelle de l'assistant : appelée seulement quand le mode local ne
// comprend pas une phrase, et seulement si l'élève a saisi sa propre clé API
// Anthropic dans les réglages. La clé reste sur l'appareil.
import Anthropic from '@anthropic-ai/sdk';

/**
 * tools : [{ name, description, inputSchema, execute(input) }] (format du prototype)
 * Renvoie { text } une fois la réponse finale obtenue.
 */
async function ask(prompt, { tools = [], apiKey, model = 'claude-opus-5-5', maxTurns = 6 } = {}) {
  if (!apiKey) throw Object.assign(new Error('Aucune clé API'), { code: 'not_granted' });
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const defs = tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.inputSchema }));
  const messages = [{ role: 'user', content: prompt }];
  let text = '';
  for (let turn = 0; turn < maxTurns; turn++) {
    const res = await client.beta.messages.create({
      model,
      max_tokens: 16000,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      tools: defs,
      messages,
    });
    text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim() || text;
    if (res.stop_reason === 'refusal') return { text: 'Je ne peux pas traiter cette demande.' };
    if (res.stop_reason === 'pause_turn') { messages.push({ role: 'assistant', content: res.content }); continue; }
    const uses = res.content.filter((b) => b.type === 'tool_use');
    if (res.stop_reason !== 'tool_use' || !uses.length) return { text };
    messages.push({ role: 'assistant', content: res.content });
    const results = uses.map((u) => {
      const tool = tools.find((t) => t.name === u.name);
      try {
        if (!tool) throw new Error('outil inconnu');
        return { type: 'tool_result', tool_use_id: u.id, content: String(tool.execute(u.input || {})) };
      } catch (e) {
        return { type: 'tool_result', tool_use_id: u.id, content: String((e && e.message) || e), is_error: true };
      }
    });
    messages.push({ role: 'user', content: results });
  }
  return { text: text || 'C\'est noté.' };
}

window.MLPAI = { ask };
