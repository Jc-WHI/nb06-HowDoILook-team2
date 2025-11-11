// 기존 코드 삭제
// import "dotenv/config"
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// export default prisma

// lib/prismaClient.js의 prisma 인스턴스를 재사용하도록 수정
import { prisma } from "../../lib/prismaClient.js";

export default prisma;