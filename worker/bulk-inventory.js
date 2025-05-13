/**
 * @author Jerome Dass
 */

'use strict';

import AbstractImportCsv from './abstract-import-csv.js';
import Inventories from '../models/Inventories.js';

export default class ImportInventories extends AbstractImportCsv {

    constructor(message) {
        super(message);
        this.rows = [];
        this.maxBatchSize = 100;
    }

    async chunkHandler(chunk) {
		this.rows.push(chunk);
		if (this.rows.length >= this.maxBatchSize) {
			try {
				await this.processRows();
			} catch (err) {
				console.error(err);
			} finally {
				this.rows.length = 0;
			}
		}
	}

    async processRows() {
		const updateArr = this.rows.map(r => {
			return {
				updateOne: {
					filter: { name: r.name },
					update: {
						$set: {
							name: r.name,
							price: r.price,
							image: r.image,
						},
						$inc: {
							stock: r.stock,
						}
					},
					upsert: true
				}
			};
		});
		await Inventories.bulkWrite(updateArr);
		this.rows.length = 0;
	}

    async execute() {
		try {
			await this.import();
			console.log(`Cleanup ${this.rows.length} documents`);
			while (this.rows.length) {
				await this.processRows();
			}
            console.log('finished');
		} catch (err) {
			console.error(err);
		}
	}
}