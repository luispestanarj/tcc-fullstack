import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres').max(72),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export const listSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(100, 'Título muito longo'),
  type: z.enum(['TASK', 'SHOPPING', 'REMINDER'], {
    errorMap: () => ({ message: 'Tipo deve ser TASK, SHOPPING ou REMINDER' }),
  }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional().nullable(),
});

export const itemSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional().nullable(),
  quantity: z.number().int().positive('Quantidade deve ser positiva').optional().nullable(),
  unit: z.string().max(20).optional().nullable(),
  dueDate: z.string().min(1).optional().nullable(),
  position: z.number().int().min(0).optional(),
});

export const updateItemSchema = itemSchema.partial();
export const updateListSchema = listSchema.partial();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ListInput = z.infer<typeof listSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
