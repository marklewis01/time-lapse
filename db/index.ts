import * as SQLite from "expo-sqlite";
import moment from "moment";

const db = SQLite.openDatabase("db.db");

import { ISQLiteSelectResponse } from "../types";

/*
 * DELETES
 */

export const deleteProject = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `DELETE FROM project
          WHERE id = ?`,
          [id]
        );
      },
      (err) => reject(err),
      () => resolve()
    );
  });
};

/*
 * UPDATES
 */

/*
 * READ
 */
export const selectProjects = (): Promise<[]> =>
  new Promise((resolve, reject) => {
    let projects: [] = [];
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM project`,
          [],
          (_, { rows: { _array } }: { rows: any }) => {
            projects = _array;
          }
        );
      },
      (e) => reject(e),
      () => resolve(projects)
    );
  });

/*
 * CREATE
 */

// Project
export const addProject = (name: string) => {
  return new Promise((resolve, reject) => {
    const date = moment().format("YYYY-MM-DD");
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO project (name, created_at, updated_at) VALUES (?,?,?)`,
          [name, date, date]
        );
      },
      (err) => reject(err),
      () => resolve()
    );
  });
};

//Tables
export const createProjectTable = () => {
  console.log("creating table - function");

  db.transaction(
    (tx) => {
      // tx.executeSql(`DROP TABLE IF EXISTS project`);

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS project (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          name TEXT,
          created_at TEXT,
          updated_at TEXT
        );`,
        []
      );
    },
    (err) => console.log(err)
  );
};
