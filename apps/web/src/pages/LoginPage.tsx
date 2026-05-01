import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@tcc/shared';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useState } from 'react';
import axios from 'axios';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setApiError('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(err.response?.data?.message ?? 'Erro ao fazer login');
      } else {
        setApiError('Erro inesperado. Tente novamente.');
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Rotina Diária</h1>
          <p className="mt-1 text-sm text-gray-500">Entre na sua conta</p>
        </div>
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="E-mail" type="email" placeholder="seu@email.com" error={errors.email?.message} {...register('email')} />
            <Input label="Senha" type="password" placeholder="••••••" error={errors.password?.message} {...register('password')} />
            {apiError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{apiError}</p>}
            <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">Entrar</Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Não tem conta?{' '}
            <Link to="/register" className="font-medium text-blue-500 hover:text-blue-600">Cadastre-se</Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">Demo: demo@tcc.dev / demo123</p>
      </div>
    </div>
  );
}
