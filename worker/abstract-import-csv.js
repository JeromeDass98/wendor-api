/**
 * @author Jerome Dass
 */

'use strict';

import axios from 'axios';
import csv from 'csvtojson';

export default class AbstractImportCsv {
	constructor(params) {
		this.url = params.url;
		this.chunks = [];
	}

	async import() {
		const res = await axios.get(this.url, { responseType: 'stream' });
		const stream = csv().fromStream(res.data);
		return new Promise((resolve, reject) => {
			stream.subscribe(
				async (json) => {
					stream.pause();
					await this.chunkHandler(json);
					stream.resume();
				},
				reject,
				resolve,
			);
		});
	}

	async chunkHandler(chunk) {
		return chunk;
	}
};
