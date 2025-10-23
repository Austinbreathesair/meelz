"use client";
import Dexie, { Table } from 'dexie';
import { useMemo } from 'react';

export interface PantryRow {
  id: string;
  name: string;
  qty?: number;
  unit?: string;
  unit_family?: 'mass' | 'volume' | 'count';
  updated_at?: number;
}

class MeelzDB extends Dexie {
  pantry!: Table<PantryRow, string>;
  constructor() {
    super('meelz');
    this.version(1).stores({ pantry: 'id, name, updated_at' });
  }
}

export function useIndexedDb() {
  const db = useMemo(() => new MeelzDB(), []);
  return db;
}

