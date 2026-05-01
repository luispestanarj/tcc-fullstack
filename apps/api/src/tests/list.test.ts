import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

async function createUserAndToken(email = 'user@test.com') {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Usuário', email, password: 'senha123' });
  return res.body.token as string;
}

describe('Listas — CRUD', () => {
  it('cria lista com dados válidos', async () => {
    const token = await createUserAndToken();
    const res = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Compras do mês', type: 'SHOPPING' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Compras do mês');
    expect(res.body.type).toBe('SHOPPING');
  });

  it('lista todas as listas do usuário', async () => {
    const token = await createUserAndToken();
    await request(app).post('/api/lists').set('Authorization', `Bearer ${token}`).send({ title: 'L1', type: 'TASK' });
    await request(app).post('/api/lists').set('Authorization', `Bearer ${token}`).send({ title: 'L2', type: 'REMINDER' });
    const res = await request(app).get('/api/lists').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('atualiza lista existente', async () => {
    const token = await createUserAndToken();
    const created = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Original', type: 'TASK' });
    const res = await request(app)
      .put(`/api/lists/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Atualizada' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Atualizada');
  });

  it('exclui lista e retorna 204', async () => {
    const token = await createUserAndToken();
    const created = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Para excluir', type: 'TASK' });
    const del = await request(app)
      .delete(`/api/lists/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);
  });

  it('impede acesso à lista de outro usuário', async () => {
    const token1 = await createUserAndToken('user1@test.com');
    const token2 = await createUserAndToken('user2@test.com');
    const created = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token1}`)
      .send({ title: 'Privada', type: 'TASK' });
    const res = await request(app)
      .get(`/api/lists/${created.body.id}`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(404);
  });

  it('rejeita tipo inválido', async () => {
    const token = await createUserAndToken();
    const res = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'L', type: 'INVALIDO' });
    expect(res.status).toBe(422);
  });
});
