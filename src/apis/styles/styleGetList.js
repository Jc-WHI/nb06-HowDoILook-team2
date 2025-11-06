import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/gallery', async (req, res) => {});

router.get('/ranking', async (req, res) => {});

export default router;
