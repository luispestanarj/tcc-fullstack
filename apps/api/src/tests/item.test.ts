import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

async function setup() {
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Usuário', email: 'user@item.com', password: 'senha123' });
  const token = userRes.body.token as string;
  const listRes = await request(app)
    .post('/api/lists')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Tarefas', type: 'TASK' });
  return { token, listId: listRes.body.id as string };
}

describe('Itens — CRUD', () => {
  it('cria item em uma lista', async () => {
    const { token, listId } = await setup();
    const res = await request(app)
      .post(`/api/lists/${listId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Estudar TypeScript' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Estudar TypeScript');
    expect(res.body.completed).toBe(false);
  });

  it('lista itens de uma lista', async () => {
    const { token, listId } = await setup();
    await request(app).post(`/api/lists/${listId}/items`).set('Authorization', `Bearer ${token}`).send({ title: 'I1' });
    await request(app).post(`/api/lists/${listId}/items`).set('Authorization', `Bearer ${token}`).send({ title: 'I2' });
    const res = await request(app).get(`/api/lists/${listId}/items`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('alterna status do item (toggle)', async () => {
    const { token, listId } = await setup();
    const item = await request(app)
      .post(`/api/lists/${listId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Fazer exercício' });
    const toggled = await request(app)
      .patch(`/api/items/${item.body.id}/toggle`)
      .set('Authorization', `Bearer ${token}`);
    expect(toggled.status).toBe(200);
    expect(toggled.body.completed).toBe(true);

    const toggled2 = await request(app)
      .patch(`/api/items/${item.body.id}/toggle`)
      .set('Authorization', `Bearer ${token}`);
    expect(toggled2.body.completed).toBe(false);
  });

  it('atualiza item', async () => {
    const { token, listId } = await setup();
    const item = await request(app)
      .post(`/api/lists/${listId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título original' });
    const res = await request(app)
      .put(`/api/items/${item.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título atualizado', description: 'Detalhes aqui' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Título atualizado');
    expect(res.body.description).toBe('Detalhes aqui');
  });

  it('exclui item', async () => {
    const { token, listId } = await setup();
    const item = await request(app)
      .post(`/api/lists/${listId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Para excluir' });
    const del = await request(app)
      .delete(`/api/items/${item.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);
  });

  it('rejeita item com título vazio', async () => {
    const { token, listId } = await setup();
    const res = await request(app)
      .post(`/api/lists/${listId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });
    expect(res.status).toBe(422);
  });
});
