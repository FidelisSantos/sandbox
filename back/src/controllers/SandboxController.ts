import { Request, Response } from "express";
import { SandboxService } from "../services/SandboxService";


const sandboxService = new SandboxService();
export class SandboxController {
    static async describeTables(req: Request, res: Response) {
        const tables = await sandboxService.describeTables();
        res.json(tables);
    }

    static async populateTables(req: Request, res: Response) {
        const tables = await sandboxService.populateTables();
        res.json(tables);
    }
}