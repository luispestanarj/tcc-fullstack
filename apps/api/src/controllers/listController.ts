import { Request, Response, NextFunction } from 'express';
import * as listService from '../services/listService';
import { listSchema, updateListSchema } from '../validators/list';

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const lists = await listService.getLists(req.user!.sub);
    res.json(lists);
  } catch (err) {
    next(err);
  }
}

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    const list = await listService.getList(req.params.id, req.user!.sub);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = listSchema.parse(req.body);
    const list = await listService.createList(data, req.user!.sub);
    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateListSchema.parse(req.body);
    const list = await listService.updateList(req.params.id, req.user!.sub, data);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await listService.deleteList(req.params.id, req.user!.sub);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
