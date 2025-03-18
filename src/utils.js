module.exports = {
    /**
	 * INTERNAL: Request the user number images
	 *
	 * @since 1.1.0
	 */
	pollImages: async function () {
        const got = (await import('got')).default; 
        try {
            const response = await got('http://' + this.config.IP + ':4430/titan/handles');
            var jsonobj = JSON.parse(Buffer.from(response.body).toString());
            for (var i = 0; i < jsonobj.length; i++) {
                if(jsonobj[i]["icon"] != null) {
                    await this.getImage(jsonobj[i]["userNumber"]["hashCode"], jsonobj[i]["icon"]);
                }
            }
            this.checkFeedbacks('image');
        } catch (error) {
            console.error("Error polling images: ", error);
        }
	},

	getImage: async function (un, icon) {
        const got = (await import('got')).default; 
        try {
			let data = Buffer.alloc(0);
			const stream = got.stream (icon, { allowGetBody: true })
			stream.on ('data', d => data = Buffer.concat([data, d]));
  			stream.end()
			await new Promise((resolve, reject) => stream.on('end', resolve).on('error', reject))
            this.imageList[un] = data.toString('base64');
        } catch (error) {
            console.error("Error getting image: ", error);
        }

	},

	sendCommand: async function(uri) {

		if (!this.config.IP) {
			console.error("IP is not defined in the configuration.");
		}
		if (this.config.IP && uri) {
			const got = (await import('got')).default; 

			const cmd = `http://${this.config.IP}:4430/titan/${uri}`;

			try {
				await got(cmd);
				this.updateStatus('ok');

				if (!this.pollInterval) {
					this.pollInterval = setInterval(this.pollImages.bind(this), 5000);
				}

				return true;
			} catch (error) {
                console.error("sendCommand error: ", error);
				this.updateStatus('error', error.code);
				return false;
			}
		}
	}

}
