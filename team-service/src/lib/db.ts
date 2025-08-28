import mongoose from "mongoose";
import { APP_REALM, SERVICE_DOMAIN } from "../constants";

const getDatabaseName = () => {
  return `${APP_REALM}_${SERVICE_DOMAIN}`;
}

const defaultSchema = new mongoose.Schema({}, { strict: false });

export const getCollectionByName = (
  collectionName: string
): any => {
  const db = mongoose.connection.useDb(getDatabaseName());
  return db.model(collectionName, defaultSchema, collectionName);
};
