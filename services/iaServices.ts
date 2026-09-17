import { GoogleGenAI } from '@google/genai'
import "dotenv/config"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function buscarDadosComGemini(autor: string, nome: string, ano: number) {
  const resposta = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: `Escreva uma breve resenha ou comentário crítico e atrativo sobre o livro "${nome}", escrito por ${autor} e publicado em ${ano}. Seja direto, conciso e escreva um texto corrido que caiba perfeitamente em no máximo 200 caracteres.`,
  })

  return resposta.text || "Sem comentário gerado."
}