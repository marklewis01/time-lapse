import * as SQLite from "expo-sqlite";
import moment from "moment";

const db = SQLite.openDatabase("db.db");

import { ISQLiteSelectResponse } from "../types";

const createProjectTableQuery = `CREATE TABLE IF NOT EXISTS project (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );`;

const createImageTableQuery = `CREATE TABLE IF NOT EXISTS image (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          project_id INTEGER NOT NULL,
          created_at TEXT NOT NULL,
          FOREIGN KEY (project_id)
            REFERENCES project (id)
        );`;

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

export const resetTables = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("recreating tables");
      db.transaction(
        (tx) => {
          tx.executeSql(`DROP TABLE IF EXISTS project`);
          tx.executeSql("DROP TABLE IF EXISTS image");
          tx.executeSql(createProjectTableQuery, []);
          tx.executeSql(createImageTableQuery, []);
        },
        (e) => console.error(e),
        () => resolve()
      );
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

/*
 * UPDATES
 */

/*
 * READ
 */
export const selectManyProjects = (): Promise<[]> =>
  new Promise((resolve, reject) => {
    let projects: [] = [];
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM project ORDER BY updated_at DESC`,
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

export const selectOneProject = (id: number): Promise<[]> =>
  new Promise((resolve, reject) => {
    let project: any;
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM project WHERE id = ? LIMIT 1`,
          [id],
          (_, { rows: { _array } }: { rows: any }) => {
            project = _array[0];
          }
        );
      },
      (e) => reject(e),
      () => resolve(project)
    );
  });

/*
 * CREATE
 */

// Project
export const addProject = (name: string) => {
  return new Promise((resolve, reject) => {
    const date = moment().format();
    let projectId: number;

    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO project (name, created_at, updated_at) VALUES (?,?,?)`,
          [name, date, date],
          (_, response) => {
            projectId = response.insertId;
          }
        );
      },
      (err) => reject(err),
      () => resolve(projectId)
    );
  });
};

//Tables
export const createProjectTable = () => {
  db.transaction(
    (tx) => {
      tx.executeSql(createProjectTableQuery, []);
    },
    (err) => console.error(err)
  );
};

//Tables
export const createImagesTable = () => {
  db.transaction(
    (tx) => {
      tx.executeSql(createImageTableQuery, []);
    },
    (err) => console.error(err)
  );
};
