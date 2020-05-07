import * as SQLite from "expo-sqlite";

export type orientation =
  | "landscape-left"
  | "landscape-right"
  | "portrait-up"
  | "portrait-down";

export interface IImage {
  created_at: string;
  id: number;
  project_id: number;
  uri: string;
  asset_id: string;
}

export interface IProject {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// SQLite
export interface ISQLiteSelectResponse extends SQLite.SQLResultSet {
  rows: {
    length: number;
    item(index: number): any;
    _array?: [];
  };
}

export type ScreenStackParamList = {
  HomeScreen: undefined;
  Camera: { projectId: number };
  CompareScreen: { images: IImage["uri"][] };
  ProjectScreen: { id: number };
  TestScreen: undefined;
};
