import { inngest } from './client';
import prisma from '../lib/prisma';
import ExcelJS from 'exceljs';
import * as fs from 'fs';

export const processExcelFile = inngest.createFunction(
    {
        id: 'process-excel-file',
        triggers: [{ event: 'app/process.excel' }]
    },
    async ({ event, step }: { event: { data: { fileId: string; filePath: string } }; step: any }) => {
        const { fileId, filePath } = event.data;

        await step.run('update-job-status-processing', async () => {
            await prisma.uploadJob.update({
                where: { id: fileId },
                data: { status: 'PROCESSING' }
            });
        });

        const results = await step.run('parse-and-upsert', async () => {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);

            let processedCount = 0;
            let errorCount = 0;
            const batchData: {
                externalId: string;
                title: string;
                status: string;
                priority: string;
                assigneeName: string;
                createdAt: Date;
            }[] = [];
            const BATCH_SIZE = 500;

            const processBatch = async (batch: typeof batchData) => {
                await prisma.$transaction(
                    batch.map(item =>
                        prisma.ticket.upsert({
                            where: { externalId: item.externalId },
                            update: {
                                status: item.status,
                                assigneeName: item.assigneeName
                            },
                            create: {
                                externalId: item.externalId,
                                title: item.title,
                                status: item.status,
                                priority: item.priority,
                                createdAt: item.createdAt,
                                updatedAt: item.createdAt,
                                assigneeName: item.assigneeName
                            }
                        })
                    )
                );
            };

            workbook.eachSheet((worksheet) => {
                const assigneeName = worksheet.name;

                // Row 1 = status headers (cols 2+), Col 1 = Date
                const headerRow = worksheet.getRow(1);
                const statusMap = new Map<number, string>();
                headerRow.eachCell((cell, colNumber) => {
                    const val = cell.value?.toString().trim();
                    if (val && colNumber > 1) statusMap.set(colNumber, val);
                });

                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;

                    const dateCellStr = row.getCell(1).value?.toString().trim() || '';
                    if (!dateCellStr) return;

                    const cleanDateStr = dateCellStr.replace(/^Before\s+/i, '').trim();
                    const parsedDate = new Date(cleanDateStr);
                    const finalCreatedAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

                    statusMap.forEach((statusName, colNumber) => {
                        const cellVal = row.getCell(colNumber).value;
                        let cellText = '';
                        if (typeof cellVal === 'object' && cellVal !== null) {
                            const rich = (cellVal as any).richText;
                            cellText = rich
                                ? rich.map((rt: { text: string }) => rt.text).join('')
                                : (cellVal as any).text || '';
                        } else {
                            cellText = cellVal?.toString() || '';
                        }

                        if (!cellText.trim()) return;

                        cellText.split(';')
                            .map((t: string) => t.trim())
                            .filter((t: string) => t.length > 0)
                            .forEach((ticketId: string) => {
                                batchData.push({
                                    externalId: ticketId,
                                    title: `Ticket ${ticketId}`,
                                    status: statusName,
                                    priority: 'Medium',
                                    assigneeName,
                                    createdAt: finalCreatedAt
                                });
                            });
                    });
                });
            });

            for (let i = 0; i < batchData.length; i += BATCH_SIZE) {
                const chunk = batchData.slice(i, i + BATCH_SIZE);
                try {
                    await processBatch(chunk);
                    processedCount += chunk.length;
                } catch (e) {
                    console.error('Batch error:', e);
                    errorCount++;
                }
            }

            return { processedCount, errorCount };
        });

        await step.run('update-job-status-completed', async () => {
            await prisma.uploadJob.update({
                where: { id: fileId },
                data: {
                    status: 'COMPLETED',
                    processed: results.processedCount,
                    errors: { errorCount: results.errorCount }
                }
            });
            try { fs.unlinkSync(filePath); } catch (_) { }
        });

        return { success: true, processed: results.processedCount };
    }
);

export const generateDailySnapshot = inngest.createFunction(
    {
        id: 'generate-daily-snapshot',
        triggers: [{ cron: '0 0 * * *' }]
    },
    async ({ step }: { step: any }) => {
        const metrics = await step.run('calculate-metrics', async () => {
            const now = new Date();

            const openCount = await prisma.ticket.count({
                where: { status: { not: 'Closed' } }
            });
            const closedCount = await prisma.ticket.count({
                where: { status: 'Closed' }
            });

            const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
            const slaBreaches = await prisma.ticket.count({
                where: { status: { not: 'Closed' }, createdAt: { lt: fiveDaysAgo } }
            });

            const openTickets = await prisma.ticket.findMany({
                where: { status: { not: 'Closed' } },
                select: { createdAt: true }
            });

            let totalAgeMs = 0;
            openTickets.forEach((t: { createdAt: Date }) => {
                totalAgeMs += (now.getTime() - t.createdAt.getTime());
            });
            const avgAgeHours = openTickets.length > 0
                ? (totalAgeMs / openTickets.length) / (1000 * 60 * 60)
                : 0;

            return { openCount, closedCount, slaBreaches, avgAgeHours };
        });

        await step.run('save-snapshot', async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await prisma.dailyMetricsSnapshot.upsert({
                where: { date: today },
                update: { ...metrics },
                create: { date: today, ...metrics }
            });
        });

        return { success: true };
    }
);
