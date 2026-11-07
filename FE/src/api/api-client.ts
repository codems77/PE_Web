import ky from "ky";
import { env } from "../config/env";

export const apiClient = ky.create({ baseUrl: `${env.apiBaseUrl}/`, timeout: 10000, retry: 0 });
