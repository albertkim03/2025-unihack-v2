"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function fetchUserSession() {
  return await getServerSession(authOptions);
}
