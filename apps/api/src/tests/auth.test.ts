import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

const validUser = { name: 'Usuário Teste', email: 'teste@example.com', password: 'senha123' };

describe('POST /api/auth/register', () => {
  it('cria conta com dados válidos', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(validUser.email);
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('rejeita e-mail duplicado', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('CONFLICT');
  });

  it('rejeita dados inválidos (email sem @)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'X', email: 'invalido', password: 'senha123' });
    expect(res.status).toBe(422);
  });

  it('rejeita senha muito curta', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'X', email: 'x@x.com', password: '123' });
    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  it('faz login com credenciais corretas', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejeita senha incorreta', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'errada' });
    expect(res.status).toBe(401);
  });

  it('rejeita usuário inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@x.com', password: 'qualquer' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('retorna dados do usuário autenticado', async () => {
    const reg = await request(app).post('/api/auth/register').send(validUser);
    const token = reg.body.token;
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(validUser.email);
  });

  it('rejeita requisição sem token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejeita token inválido', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer token-invalido');
    expect(res.status).toBe(401);
  });
});
