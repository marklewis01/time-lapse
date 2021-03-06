import * as SQLite from "expo-sqlite";
import moment from "moment";
import { Asset } from "expo-media-library";

const db = SQLite.openDatabase("db.db");

// required to enable foreign key support
db.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () => {
  // console.log("Foreign keys turned on")
});

import { ISQLiteSelectResponse, IImage, IProject } from "../types";

const createProjectTableQuery = `CREATE TABLE IF NOT EXISTS project (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );`;

const createImageTableQuery = `CREATE TABLE IF NOT EXISTS image (
          id INTEGER PRIMARY KEY,
          uri TEXT NOT NULL,
          project_id INTEGER REFERENCES project(id) ON DELETE CASCADE,
          created_at TEXT NOT NULL,
          asset_id TEXT NOT NULL
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

function deleteAllTables() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`DROP TABLE IF EXISTS project`);
        tx.executeSql("DROP TABLE IF EXISTS image");
      },
      (e) => reject(e),
      () => resolve()
    );
  });
}

export const resetTables = async () => {
  // return new Promise((resolve, reject) => {
  try {
    // delete existing tables
    await deleteAllTables();

    // create fresh tables
    await createProjectTable();
    await createImagesTable();
  } catch (err) {
    console.error(err);
  }
};

/*
 * UPDATES
 */

export const updateProjectName = (id: number, name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const date = moment().format();

    db.transaction(
      (tx) => {
        tx.executeSql(
          `UPDATE project SET name = ?, updated_at = ? WHERE id = ?`,
          [name, date, id],
          () => resolve()
        );
      },
      (e) => reject(e)
    );
  });
};

/*
 * READ
 */
export const getManyProjects = (): Promise<[]> =>
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

export const getOneProject = (id: number): Promise<IProject> =>
  new Promise((resolve, reject) => {
    let project: IProject;
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

export const getProjectImages = (
  projectId: number,
  order: "ASC" | "DESC" = "DESC"
): Promise<IImage[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM image WHERE project_id = ? ORDER BY created_at ${order}`,
          [projectId],
          (_, { rows: { _array } }: { rows: any }) => {
            resolve(_array);
          }
        );
      },
      (err) => reject(err)
    );
  });
};

/*
 * CREATE
 */

// Records
export const insertProject = (name: string) => {
  return new Promise((resolve, reject) => {
    const date = moment().format();
    let projectId: number;

    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO project (name, created_at, updated_at) VALUES (?,?,?)`,
          [name, date, date],
          (_, response) => {
            resolve(response.insertId);
            // projectId = response.insertId;
          }
        );
      },
      (err) => reject(err)
      // () => resolve(projectId)
    );
  });
};

export const insertOneImage = (projectId: number, image: Asset) => {
  const date = moment(image.creationTime).format();

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          // insert details into image table
          `INSERT INTO image (uri, project_id, created_at, asset_id) VALUES (?,?,?,?)`,
          [image.uri, projectId, date, image.id],
          (_, response) => {
            resolve(response.insertId);
          }
        );
        // update project updated_at timestamp
        tx.executeSql(`UPDATE project SET updated_at = ? WHERE id = ?`, [
          date,
          projectId
        ]);
      },
      (err) => reject(err)
    );
  });
};

//Tables
export const createProjectTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(createProjectTableQuery, []);
      },
      (err) => reject(err),
      () => resolve()
    );
  });
};

export const createImagesTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(createImageTableQuery, []);
      },
      (err) => reject(err),
      () => resolve()
    );
  });
};
