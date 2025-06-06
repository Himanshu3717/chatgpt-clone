import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export const chatRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(z.object({
      message: z.string(),
      history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const chat = model.startChat({
        history: input.history.map(msg => ({
          role: msg.role,
          parts: msg.content,
        })),
      });

      const result = await chat.sendMessage(input.message);
      const response = await result.response;
      const text = response.text();

      return {
        role: 'assistant' as const,
        content: text,
      };
    }),

  generateImage: publicProcedure
    .input(z.object({
      prompt: z.string(),
    }))
    .mutation(async ({ input }) => {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      
      const result = await model.generateContent(input.prompt);
      const response = await result.response;
      const imageUrl = response.text(); // This will be the URL of the generated image

      return {
        imageUrl,
      };
    }),
}); 