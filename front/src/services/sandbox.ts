import initSql from 'sql.js'
export class SandboxService {
    static db: any;
    static url = "http://localhost:5000";

    private static async initializeDb() {
        if (!this.db) {
            const sql = await initSql.default({
                locateFile: (file) => `https://sql.js.org/dist/${file}`,
            });
            this.db = new sql.Database();
        }
    }

    static async getDb() {
        await this.initializeDb();
        return this.db;
    }

    static async deleteDb() {
        console.log("Deleting db");
        if (this.db) {
            this.db.close();
            this.db = null;
        }
        console.log("Db deleted");
    }

    private static getSqliteType(type: string): string {
        const typeMap: { [key: string]: string } = {
            'INT UNSIGNED': 'INTEGER',
            'VARCHAR': 'TEXT',
            'TEXT': 'TEXT',
            'BOOLEAN': 'INTEGER',
            'DATETIME': 'TEXT',
            'DATE': 'TEXT',
            'TIME': 'TEXT',
            'FLOAT': 'REAL',
            'DOUBLE': 'REAL',
            'DECIMAL': 'REAL'
        };

        const baseType = type.split('(')[0].toUpperCase();
        return typeMap[baseType] || 'TEXT';
    }

    private static getForeignKeys(schema: any): { [key: string]: string[] } {
        const foreignKeys: { [key: string]: string[] } = {};
        
        for (const [tableName, columns] of Object.entries(schema)) {
            const tableForeignKeys: string[] = [];
            
            for (const [columnName, columnInfo] of Object.entries(columns as any)) {
                if (columnName.endsWith('_id') && !(columnInfo as any).primaryKey) {
                    const relatedTable = columnName.replace('_id', '');
                    if (schema[relatedTable]) {
                        tableForeignKeys.push(
                            `FOREIGN KEY (${columnName}) REFERENCES ${relatedTable + 's'}(id)`
                        );
                    }
                }
            }
            
            if (tableForeignKeys.length > 0) {
                foreignKeys[tableName] = tableForeignKeys;
            }
        }
        
        return foreignKeys;
    }

    static async createTablesToMovies() {
        await this.initializeDb();
        try {
            const response = await fetch(`${this.url}/sandbox/describe`);
            const schema = await response.json();
            const db = await this.getDb();
            const foreignKeys = this.getForeignKeys(schema);

            for (const [tableName, columns] of Object.entries(schema)) {
                const columnDefinitions = Object.entries(columns as any).map(([columnName, columnInfo]: [string, any]) => {
                    const type = this.getSqliteType(columnInfo.type);
                    const constraints = [];

                    if (columnInfo.primaryKey) {
                        constraints.push('PRIMARY KEY');
                        if (columnInfo.autoIncrement) {
                            constraints.push('AUTOINCREMENT');
                        }
                    }
                    if (!columnInfo.allowNull) {
                        constraints.push('NOT NULL');
                    }
                    if (columnInfo.defaultValue !== null) {
                        constraints.push(`DEFAULT ${columnInfo.defaultValue}`);
                    }

                    return `${columnName} ${type} ${constraints.join(' ')}`;
                });

                if (foreignKeys[tableName]) {
                    columnDefinitions.push(...foreignKeys[tableName]);
                }

                const createTableSQL = `
                    CREATE TABLE IF NOT EXISTS ${tableName} (
                        ${columnDefinitions.join(',\n                        ')}
                    )
                `;

                console.log(`Criando tabela ${tableName}:`, createTableSQL);
                db.exec(createTableSQL);
                await this.populateTables();
            }

            console.log('Tabelas criadas com sucesso:', schema);
        } catch (error) {
            console.error('Erro ao criar tabelas:', error);
        }
    }

    static async populateTables() {
        try {
            const response = await fetch(`${this.url}/sandbox/populate`);
            const data = await response.json();
            const db = await this.getDb();

            const tables = Object.keys(data).reverse();
            for (const tableName of tables) {
                console.log(`Limpando tabela ${tableName}`);
                db.exec(`DELETE FROM ${tableName}`);
            }

            for (const [tableName, rows] of Object.entries(data)) {
                if (Array.isArray(rows)) {
                    for (const row of rows) {
                        const columns = Object.keys(row);
                        const values = Object.values(row);
                        const placeholders = values.map(() => '?').join(', ');
                        
                        const insertSQL = `
                            INSERT INTO ${tableName} (${columns.join(', ')})
                            VALUES (${placeholders})
                        `;

                        console.log(`Inserindo em ${tableName}:`, row);
                        db.exec(insertSQL, values);
                    }
                }
            }

            console.log('Dados populados com sucesso');
        } catch (error) {
            console.error('Erro ao popular tabelas:', error);
        }
    }
}