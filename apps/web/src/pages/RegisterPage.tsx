import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@tcc/shared';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useState } from 'react';
import axios from 'axios';

export function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setApiError('');
    try {
      await authRegister(data);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(err.response?.data?.message ?? 'Erro ao criar conta');
      } else {
        setApiError('Erro inesperado. Tente novamente.');
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="mt-1 text-sm text-gray-500">Organize sua rotina hoje mesmo</p>
        </div>
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Nome" placeholder="Seu nome" error={errors.name?.message} {...register('name')} />
            <Input label="E-mail" type="email" placeholder="seu@email.com" error={errors.email?.message} {...register('email')} />
            <Input label="Senha" type="password" placeholder="Mínimo 6 caracteres" error={errors.password?.message} {...register('password')} />
            {apiError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{apiError}</p>}
            <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">Criar conta</Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-blue-500 hover:text-blue-600">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
