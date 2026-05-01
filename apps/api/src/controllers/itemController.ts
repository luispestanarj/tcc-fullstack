import { Request, Response, NextFunction } from 'express';
import * as itemService from '../services/itemService';
import { itemSchema, updateItemSchema } from '../validators/item';

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await itemService.getItems(req.params.listId, req.user!.sub);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = itemSchema.parse(req.body);
    const item = await itemService.createItem(req.params.listId, req.user!.sub, data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateItemSchema.parse(req.body);
    const item = await itemService.updateItem(req.params.id, req.user!.sub, data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function toggle(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await itemService.toggleItem(req.params.id, req.user!.sub);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await itemService.deleteItem(req.params.id, req.user!.sub);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
